"use client";

/**
 * Decorativo: sugiere un panel operativo real sin screenshots.
 */
export function LandingDashboardMock() {
  const bars = [38, 62, 48, 74, 52, 88, 58, 71];

  return (
    <div className="mt-5 overflow-hidden rounded-lg border border-[color-mix(in_srgb,white_10%,transparent)] bg-[color-mix(in_srgb,black_38%,transparent)] shadow-[inset_0_1px_0_color-mix(in_srgb,white_7%,transparent),0_12px_40px_color-mix(in_srgb,black_45%,transparent)]">
      <div className="flex items-center justify-between gap-3 border-b border-[color-mix(in_srgb,white_8%,transparent)] px-3 py-2.5">
        <div className="flex gap-1.5" aria-hidden>
          <span className="h-2 w-2 rounded-full bg-[#ff5f56]/95" />
          <span className="h-2 w-2 rounded-full bg-[#febc2e]/95" />
          <span className="h-2 w-2 rounded-full bg-[#28c840]/95" />
        </div>
        <span className="truncate text-center text-[0.62rem] font-medium tracking-wide text-[color-mix(in_srgb,white_38%,transparent)]">
          operaciones.bexo · staging
        </span>
        <span
          className="h-2 w-9 shrink-0 rounded-full bg-[color-mix(in_srgb,white_7%,transparent)]"
          aria-hidden
        />
      </div>
      <div className="space-y-3.5 p-4">
        <div className="flex flex-wrap gap-2">
          {["Tiempo real", "Cuellos", "Auditoría"].map((t) => (
            <span
              key={t}
              className="rounded-md border border-[color-mix(in_srgb,white_10%,transparent)] bg-[color-mix(in_srgb,white_4%,transparent)] px-2 py-0.5 text-[0.6rem] font-semibold uppercase tracking-wider text-[color-mix(in_srgb,white_52%,transparent)]"
            >
              {t}
            </span>
          ))}
        </div>
        <div className="flex h-[52px] items-end gap-1 pt-0.5">
          {bars.map((h, i) => (
            <div
              key={i}
              className="flex min-w-0 flex-1 flex-col justify-end rounded-[2px] bg-[color-mix(in_srgb,white_5%,transparent)]"
            >
              <div
                className="min-h-[5px] rounded-[2px] bg-[color-mix(in_srgb,var(--color-lime)_42%,transparent)]"
                style={{ height: `${h}%` }}
              />
            </div>
          ))}
        </div>
        <div className="space-y-2 pt-0.5">
          {["Aprobación pendiente", "Stock crítico — Turno 2", "Sync ERP · OK"].map(
            (label, row) => (
              <div
                key={label}
                className="flex items-center gap-3 rounded-md border border-[color-mix(in_srgb,white_7%,transparent)] bg-[color-mix(in_srgb,white_3%,transparent)] px-3 py-2"
              >
                <span
                  className="h-1.5 w-1.5 shrink-0 rounded-full bg-[color-mix(in_srgb,var(--color-lime)_75%,transparent)] shadow-[0_0_8px_color-mix(in_srgb,var(--color-lime)_45%,transparent)]"
                  aria-hidden
                />
                <span className="min-w-0 flex-1 truncate text-[0.68rem] font-medium text-[color-mix(in_srgb,white_58%,transparent)]">
                  {label}
                </span>
                <span
                  className={`shrink-0 rounded px-1.5 py-0.5 text-[0.58rem] font-bold uppercase tracking-wider ${
                    row === 2
                      ? "bg-[color-mix(in_srgb,var(--color-lime)_22%,transparent)] text-[color-mix(in_srgb,white_78%,transparent)]"
                      : "bg-[color-mix(in_srgb,white_6%,transparent)] text-[color-mix(in_srgb,white_44%,transparent)]"
                  }`}
                >
                  {row === 2 ? "Live" : row === 0 ? "Alto" : "Medio"}
                </span>
              </div>
            ),
          )}
        </div>
      </div>
    </div>
  );
}
