"use client";

import { useEffect, useState } from "react";

function isInteractiveTarget(el: Element | null): boolean {
  if (!el) return false;
  return !!el.closest(
    "a[href], button, summary, input, textarea, select, label, [role='button'], [data-cursor-interactive]",
  );
}

export function LandingCustomCursor({ active }: { active: boolean }) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [hover, setHover] = useState(false);
  const [finePointer, setFinePointer] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine)");
    const sync = () => setFinePointer(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!active || !finePointer) return;

    const onMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      const under = document.elementFromPoint(e.clientX, e.clientY);
      setHover(isInteractiveTarget(under));
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [active, finePointer]);

  useEffect(() => {
    if (!active || !finePointer) return;
    document.body.classList.add("bexo-landing-hide-cursor");
    return () => document.body.classList.remove("bexo-landing-hide-cursor");
  }, [active, finePointer]);

  if (!active || !finePointer) return null;

  return (
    <div
      className="pointer-events-none fixed z-[100002] mix-blend-normal"
      style={{
        left: pos.x,
        top: pos.y,
        transform: "translate(-50%, -50%)",
      }}
      aria-hidden
    >
      <div
        className={[
          "flex h-9 w-9 items-center justify-center rounded-full border-2 transition-all duration-150 ease-out",
          hover
            ? "border-[var(--color-lime)] shadow-[0_0_20px_color-mix(in_srgb,var(--color-lime)_45%,transparent)]"
            : "border-white/75",
        ].join(" ")}
      >
        <span
          className={[
            "block h-[5px] w-[5px] rounded-full transition-colors duration-150",
            hover ? "bg-[var(--color-lime)]" : "bg-white",
          ].join(" ")}
        />
      </div>
    </div>
  );
}
