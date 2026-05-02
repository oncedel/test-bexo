export type SaasProduct = {
  slug: string;
  name: string;
  sector: string;
  hook: string;
  featured?: boolean;
};

export const SAAS_PRODUCTS: SaasProduct[] = [
  {
    slug: "obrago",
    name: "ObraGo",
    sector: "Constructoras",
    hook: "Margen y obra en la misma foto: costos, aprobaciones y avance sin planillas paralelas.",
    featured: true,
  },
  {
    slug: "miscanchas",
    name: "MisCanchas",
    sector: "Clubes",
    hook: "Cobros, reservas y reglas claras. Menos fricción en los horarios que más te pagan.",
  },
  {
    slug: "fastfood",
    name: "FastFood",
    sector: "Gastronomía",
    hook: "Cocina y salón al ritmo del rush. Menos errores de pedido, más control del turno.",
  },
  {
    slug: "agrocombus",
    name: "AgroCombus",
    sector: "Agronegocio",
    hook: "Campo y logística con trazabilidad: qué salió, cuándo y con qué respaldo.",
  },
  {
    slug: "nexocam",
    name: "NexoCam",
    sector: "Video / IA",
    hook: "Video como señal de gestión: alertas y registro donde el riesgo es serio.",
  },
];

export function getSaasBySlug(slug: string): SaasProduct | undefined {
  return SAAS_PRODUCTS.find((p) => p.slug === slug);
}
