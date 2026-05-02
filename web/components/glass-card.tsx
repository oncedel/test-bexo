import type { ReactNode } from "react";

type GlassCardProps = {
  children: ReactNode;
  className?: string;
  innerClassName?: string;
};

/** Card rectangular glass (sin silueta folder). */
export function GlassCard({
  children,
  className = "",
  innerClassName = "",
}: GlassCardProps) {
  return (
    <div className={`apple-glass rounded-[1.75rem] ${className}`}>
      <div className={innerClassName}>{children}</div>
    </div>
  );
}
