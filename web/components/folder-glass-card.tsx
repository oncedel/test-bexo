"use client";

import { useId, type ReactNode } from "react";

/**
 * Silueta folder geométrica: rectángulo-oreja con uniones en L + curvas solo en
 * esquinas (sin cubics “orgánicos” en el borde superior).
 * clipPathUnits="objectBoundingBox"
 */
const PATH_EAR_PRIMARY =
  "M0.036,1 L0.964,1 Q1,1 1,0.964 L1,0.151 Q1,0.115 0.964,0.115 L0.296,0.115 Q0.26,0.115 0.26,0.079 L0.26,0.036 Q0.26,0 0.224,0 L0.036,0 Q0,0 0,0.036 L0,0.964 Q0,1 0.036,1 Z";

const PATH_EAR_COMPACT =
  "M0.032,1 L0.968,1 Q1,1 1,0.968 L1,0.13 Q1,0.098 0.968,0.098 L0.242,0.098 Q0.21,0.098 0.21,0.066 L0.21,0.032 Q0.21,0 0.178,0 L0.032,0 Q0,0 0,0.032 L0,0.968 Q0,1 0.032,1 Z";

type Variant = "primary" | "compact";

type FolderGlassCardProps = {
  children: ReactNode;
  variant?: Variant;
  tone?: "frosted" | "milky";
  className?: string;
  innerClassName?: string;
  ear?: ReactNode;
};

export function FolderGlassCard({
  children,
  variant = "primary",
  tone = "frosted",
  className = "",
  innerClassName = "",
  ear,
}: FolderGlassCardProps) {
  const rawId = useId().replace(/:/g, "");
  const clipId = `ear-clip-${rawId}`;
  const path = variant === "primary" ? PATH_EAR_PRIMARY : PATH_EAR_COMPACT;

  const toneClass =
    tone === "milky"
      ? "folder-glass-m milky-edge-apple"
      : "folder-glass-f frosted-edge-apple";

  return (
    <div className={`relative isolate ${className}`}>
      <svg
        className="pointer-events-none absolute h-0 w-0 overflow-hidden"
        aria-hidden
      >
        <defs>
          <clipPath id={clipId} clipPathUnits="objectBoundingBox">
            <path d={path} />
          </clipPath>
        </defs>
      </svg>
      <div
        className={`folder-clip-wrapper ${toneClass} ${innerClassName}`}
        style={{ clipPath: `url(#${clipId})` }}
      >
        {ear ? (
          <div className="pointer-events-none absolute left-[6%] top-[3.5%] z-10 sm:left-[7%] sm:top-[3%]">
            {ear}
          </div>
        ) : null}
        <div className="relative z-0">{children}</div>
      </div>
    </div>
  );
}
