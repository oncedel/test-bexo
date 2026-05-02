"use client";

import { useEffect, useRef } from "react";

type Seg = {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
  len: number;
  cum0: number;
};

type Margins = {
  xLO: number;
  xLI: number;
  xRI: number;
  xRO: number;
  gutterWLeft: number;
  gutterWRight: number;
};

/** Alineado con landing: px-4 / sm:px-10 / lg:px-14 / xl:px-20 y max-w-[90rem]. */
function layoutMargins(w: number): Margins {
  const innerPad = w < 640 ? 16 : w < 1024 ? 40 : w < 1280 ? 56 : 80;
  const maxContent = Math.min(1440, Math.max(0, w - 2 * innerPad));
  const contentLeft = (w - maxContent) / 2;
  const contentRight = contentLeft + maxContent;

  const edgeInset = 13;
  const clearOfContent = 34;

  const leftOuter = edgeInset + 10;
  const leftInner = contentLeft - clearOfContent;
  const rightInner = contentRight + clearOfContent;
  const rightOuter = w - edgeInset - 10;

  const gutterWLeft = leftInner - leftOuter;
  const gutterWRight = rightOuter - rightInner;

  const xLO = leftOuter;
  const xLI =
    gutterWLeft >= 22
      ? leftInner
      : Math.max(leftOuter + 16, contentLeft - Math.min(clearOfContent, 20));
  const xRO = rightOuter;
  const xRI =
    gutterWRight >= 22
      ? rightInner
      : Math.min(rightOuter - 16, contentRight + Math.min(clearOfContent, 20));

  return {
    xLO,
    xLI: Math.max(xLO + 18, xLI),
    xRI: Math.min(xRO - 18, xRI),
    xRO,
    gutterWLeft: Math.max(0, Math.max(xLO, xLI) - Math.min(xLO, xLI)),
    gutterWRight: Math.max(0, xRO - xRI),
  };
}

function pointsToSegs(points: { x: number; y: number }[]): Seg[] {
  const segs: Seg[] = [];
  let cum = 0;
  for (let k = 0; k < points.length - 1; k++) {
    const x0 = points[k].x;
    const y0 = points[k].y;
    const x1 = points[k + 1].x;
    const y1 = points[k + 1].y;
    const len = Math.hypot(x1 - x0, y1 - y0);
    if (len < 0.5) continue;
    segs.push({ x0, y0, x1, y1, len, cum0: cum });
    cum += len;
  }
  return segs;
}

/**
 * Camino solo en un callejón (entre borde de pantalla y columna de contenido).
 * xOuter = más cerca del borde del viewport; xInner = más cerca del contenido.
 * Incluye “bifurcaciones” locales: bucles en U que salen al carril interior y vuelven.
 */
function buildGutterChain(
  xOuter: number,
  xInner: number,
  docH: number,
  startPhase: number,
): Seg[] {
  const span = Math.abs(xInner - xOuter);
  if (span < 16) return [];

  const points: { x: number; y: number }[] = [];
  const targetY = docH + Math.max(180, 140);
  let y = Math.min(-55, -docH * 0.012) + startPhase * 47;
  let x = xOuter;

  points.push({ x, y });

  let i = 0;
  while (y < targetY && i < 110) {
    const chunk = 118 + (i % 6) * 26;

    const useFork = i % 5 === 2 && span >= 28;

    if (useFork) {
      const h1 = chunk * 0.34;
      const h2 = chunk * 0.4;
      const h3 = Math.max(40, chunk - h1 - h2);

      y += h1;
      points.push({ x: xOuter, y });
      points.push({ x: xInner, y });

      y += h2;
      points.push({ x: xInner, y });
      points.push({ x: xOuter, y });

      y += h3;
      points.push({ x: xOuter, y });
      x = xOuter;
    } else {
      const y1 = y + chunk * 0.52;
      points.push({ x, y: y1 });
      const nextX = Math.abs(x - xOuter) < 1 ? xInner : xOuter;
      points.push({ x: nextX, y: y1 });
      y = y1 + chunk * 0.48;
      points.push({ x: nextX, y });
      x = nextX;
    }
    i++;
  }

  return pointsToSegs(points);
}

type Chain = { segs: Seg[]; totalLen: number };

function buildMarginChains(w: number, docH: number): Chain[] {
  const m = layoutMargins(w);
  const chains: Chain[] = [];

  const left = buildGutterChain(m.xLO, m.xLI, docH, 0);
  if (left.length) {
    chains.push({
      segs: left,
      totalLen: left.reduce((a, s) => a + s.len, 0),
    });
  }

  if (m.gutterWRight >= 18) {
    const right = buildGutterChain(m.xRO, m.xRI, docH, 0.35);
    if (right.length) {
      chains.push({
        segs: right,
        totalLen: right.reduce((a, s) => a + s.len, 0),
      });
    }
  }

  return chains;
}

export function SystemConnectionsBg() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scrollRef = useRef(0);
  const docHRef = useRef(0);
  const chainsRef = useRef<Chain[]>([]);
  const wRef = useRef(0);
  const progressSmoothRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const surface = canvas;
    const context = ctx;

    const measureDoc = () =>
      Math.max(
        document.documentElement.scrollHeight,
        document.documentElement.clientHeight,
        window.innerHeight,
      );

    let raf = 0;

    function rebuildPath() {
      const w = wRef.current || window.innerWidth;
      const docH = docHRef.current || measureDoc();
      chainsRef.current = buildMarginChains(w, docH);
    }

    function snapProgressToScroll() {
      const h = window.innerHeight;
      const maxScr = Math.max(1, docHRef.current - h * 0.85);
      progressSmoothRef.current = Math.min(
        1,
        Math.max(0, scrollRef.current / maxScr),
      );
    }

    function resize() {
      const dpr = Math.min(window.devicePixelRatio ?? 1, 2);
      const w = window.innerWidth;
      const h = window.innerHeight;
      surface.width = w * dpr;
      surface.height = h * dpr;
      surface.style.width = `${w}px`;
      surface.style.height = `${h}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      wRef.current = w;
      docHRef.current = measureDoc();
      rebuildPath();
      snapProgressToScroll();
    }

    const onScroll = () => {
      scrollRef.current = window.scrollY;
      const nextH = measureDoc();
      if (Math.abs(nextH - docHRef.current) > 40) {
        docHRef.current = nextH;
        rebuildPath();
        snapProgressToScroll();
      }
    };

    function drawChainEnergy(
      segs: Seg[],
      energyS: number,
      sigma: number,
      sigmaGlow: number,
    ) {
      context.strokeStyle = "rgba(115, 128, 150, 0.12)";
      context.lineWidth = 0.55;
      for (const seg of segs) {
        context.beginPath();
        context.moveTo(seg.x0, seg.y0);
        context.lineTo(seg.x1, seg.y1);
        context.stroke();
      }

      for (const seg of segs) {
        const steps = Math.max(12, Math.ceil(seg.len / 3.2));
        for (let j = 0; j < steps; j++) {
          const ta = j / steps;
          const tb = (j + 1) / steps;
          const tm = (ta + tb) * 0.5;
          const sMid = seg.cum0 + seg.len * tm;
          const d = sMid - energyS;
          const pulse = Math.exp(-(d * d) / (2 * sigma * sigma));
          const pulseG = Math.exp(-(d * d) / (2 * sigmaGlow * sigmaGlow));

          if (pulseG < 0.04) continue;

          const xa = seg.x0 + (seg.x1 - seg.x0) * ta;
          const ya = seg.y0 + (seg.y1 - seg.y0) * ta;
          const xb = seg.x1 - (seg.x1 - seg.x0) * (1 - tb);
          const yb = seg.y1 - (seg.y1 - seg.y0) * (1 - tb);

          context.beginPath();
          context.moveTo(xa, ya);
          context.lineTo(xb, yb);
          context.strokeStyle = `rgba(130, 170, 85, ${0.02 + 0.09 * pulseG})`;
          context.lineWidth = 3.2 * pulseG;
          context.stroke();

          if (pulse < 0.08) continue;

          context.beginPath();
          context.moveTo(xa, ya);
          context.lineTo(xb, yb);
          context.strokeStyle = `rgba(170, 200, 110, ${0.1 + 0.22 * pulse})`;
          context.lineWidth = 0.55 + 1.35 * pulse;
          context.stroke();

          context.beginPath();
          context.moveTo(xa, ya);
          context.lineTo(xb, yb);
          context.strokeStyle = `rgba(255, 255, 255, ${0.05 + 0.22 * pulse})`;
          context.lineWidth = 0.35 + 0.45 * pulse;
          context.stroke();
        }
      }
    }

    function drawFrame() {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const scrollY = scrollRef.current;

      const chains = chainsRef.current;
      const maxTotalLen = Math.max(
        1,
        ...chains.map((c) => c.totalLen),
        1,
      );

      const maxScroll = Math.max(1, docHRef.current - h * 0.85);
      const targetP = Math.min(1, Math.max(0, scrollY / maxScroll));
      const prevP = progressSmoothRef.current;
      progressSmoothRef.current = prevP + (targetP - prevP) * 0.14;

      context.clearRect(0, 0, w, h);
      context.save();
      context.translate(0, -scrollY);
      context.lineJoin = "round";
      context.lineCap = "round";

      const sigma = Math.max(88, maxTotalLen * 0.072);
      const sigmaGlow = sigma * 1.65;

      for (const ch of chains) {
        const energyS = progressSmoothRef.current * ch.totalLen;
        drawChainEnergy(ch.segs, energyS, sigma, sigmaGlow);
      }

      context.restore();

      raf = requestAnimationFrame(drawFrame);
    }

    resize();
    scrollRef.current = window.scrollY;
    raf = requestAnimationFrame(drawFrame);

    window.addEventListener("resize", resize);
    window.addEventListener("scroll", onScroll, { passive: true });
    const ro = new ResizeObserver(() => {
      docHRef.current = measureDoc();
      rebuildPath();
      snapProgressToScroll();
    });
    ro.observe(document.documentElement);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[5] h-full w-full opacity-45"
      aria-hidden
    />
  );
}
