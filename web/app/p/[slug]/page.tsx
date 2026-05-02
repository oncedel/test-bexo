import { SAAS_PRODUCTS, getSaasBySlug } from "@/lib/saas-products";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

const MAIL_HREF =
  "mailto:hola@bexo.digital?subject=Reunión%20con%20Bexo&body=Contanos%20industria%2C%20volumen%20aproximado%20y%20qué%20querés%20resolver.";

export function generateStaticParams() {
  return SAAS_PRODUCTS.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  return params.then(({ slug }) => {
    const p = getSaasBySlug(slug);
    if (!p) return { title: "Producto · Bexo" };
    return {
      title: `${p.name} · Bexo`,
      description: p.hook,
    };
  });
}

export default async function SaasProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = getSaasBySlug(slug);
  if (!p) notFound();

  return (
    <div className="min-h-[100dvh] bg-[var(--ide-bg)] text-[#d4d4d4]">
      <header className="border-b border-[var(--ide-border)] bg-[#252526] px-4 py-4 sm:px-8">
        <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-3">
          <Link
            href="/"
            className="font-display text-base font-bold uppercase tracking-[0.14em] text-[#b0b0b0] hover:text-white"
          >
            ← Volver al inicio
          </Link>
          <span className="rounded-full border border-[color-mix(in_srgb,var(--color-lime)_40%,#555)] bg-[color-mix(in_srgb,var(--color-lime)_12%,#2a2a2a)] px-3 py-1 font-body text-[12px] font-semibold uppercase tracking-wide text-[var(--color-lime)]">
            SaaS Bexo
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-8 sm:py-14">
        {p.featured ? (
          <p className="font-body text-[12px] font-bold uppercase tracking-[0.18em] text-[var(--color-lime)]">
            Línea destacada
          </p>
        ) : null}
        <h1 className="mt-2 font-display text-[clamp(2rem,5.5vw,2.75rem)] font-bold leading-tight tracking-tight text-white">
          {p.name}
        </h1>
        <p className="mt-2 font-body text-base font-semibold uppercase tracking-wider text-[#9a9a9a]">
          {p.sector}
        </p>
        <p className="mt-6 font-body text-xl leading-relaxed text-[#c8c8c8]">
          {p.hook}
        </p>
        <p className="mt-8 font-body text-[16px] leading-relaxed text-[#a8a8a8]">
          {p.publicNote}
        </p>
        <ul className="mt-6 space-y-2.5 font-body text-[16px] leading-relaxed text-[#c4c4c4]">
          {p.bullets.map((b) => (
            <li key={b} className="flex gap-2">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-lime)]" />
              <span>{b}</span>
            </li>
          ))}
        </ul>
        <div className="mt-10 flex flex-wrap gap-3">
          <a
            href={MAIL_HREF}
            className="inline-flex items-center justify-center rounded-lg bg-[var(--color-lime)] px-5 py-3 font-body text-base font-bold text-[#131428] hover:opacity-95"
          >
            Coordinar reunión
          </a>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-lg border border-[#5a5a5a] bg-[#333]/50 px-5 py-3 font-body text-base font-semibold text-white shadow-sm hover:border-[#777] hover:bg-[#3a3a3a]"
          >
            Ver presentación Bexo
          </Link>
        </div>
      </main>
    </div>
  );
}
