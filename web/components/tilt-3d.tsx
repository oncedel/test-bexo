"use client";

import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { type ReactNode, useRef } from "react";

type Tilt3DProps = {
  children: ReactNode;
  className?: string;
  intensity?: number;
};

export function Tilt3D({
  children,
  className = "",
  intensity = 10,
}: Tilt3DProps) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const springX = useSpring(mx, { stiffness: 280, damping: 28, mass: 0.6 });
  const springY = useSpring(my, { stiffness: 280, damping: 28, mass: 0.6 });
  const rotateX = useTransform(
    springY,
    [-0.5, 0.5],
    [intensity * 0.55, -intensity * 0.55],
  );
  const rotateY = useTransform(
    springX,
    [-0.5, 0.5],
    [-intensity, intensity],
  );

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    mx.set(px);
    my.set(py);
  }

  function onLeave() {
    mx.set(0);
    my.set(0);
  }

  return (
    <div
      ref={ref}
      className={`relative [perspective:1200px] ${className}`}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="h-full w-full will-change-transform"
      >
        <div style={{ transform: "translateZ(0.01px)" }} className="h-full">
          {children}
        </div>
      </motion.div>
    </div>
  );
}
