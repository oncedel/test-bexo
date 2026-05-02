export type SaasProduct = {
  slug: string;
  name: string;
  sector: string;
  hook: string;
  /** Texto fijo de contexto (misma idea que la ficha pública). */
  publicNote: string;
  /** Detalle extra para hover / ficha (puntos concretos). */
  bullets: string[];
  featured?: boolean;
};

export const SAAS_PRODUCTS: SaasProduct[] = [
  {
    slug: "obrago",
    name: "ObraGo",
    sector: "Constructoras",
    hook: "Margen y obra en la misma foto: costos, aprobaciones y avance sin planillas paralelas.",
    publicNote:
      "Ficha pública del producto. Para alcance, integraciones y tiempos reales, coordiná una conversación con el equipo.",
    bullets: [
      "Costos y aprobaciones alineados con avance de obra",
      "Menos planillas paralelas entre obra y administración",
      "Pensado para equipos que viven el margen día a día",
    ],
    featured: true,
  },
  {
    slug: "miscanchas",
    name: "MisCanchas",
    sector: "Clubes",
    hook: "Cobros, reservas y reglas claras. Menos fricción en los horarios que más te pagan.",
    publicNote:
      "Ficha pública del producto. Para alcance, integraciones y tiempos reales, coordiná una conversación con el equipo.",
    bullets: [
      "Reservas y cobros con reglas visibles para socios y staff",
      "Menos fricción en picos de demanda",
      "Operación diaria del club como eje del diseño",
    ],
  },
  {
    slug: "fastfood",
    name: "FastFood",
    sector: "Gastronomía",
    hook: "Cocina y salón al ritmo del rush. Menos errores de pedido, más control del turno.",
    publicNote:
      "Ficha pública del producto. Para alcance, integraciones y tiempos reales, coordiná una conversación con el equipo.",
    bullets: [
      "Salón y cocina sincronizados en el rush",
      "Menos errores de pedido y retrabajos",
      "Control del turno con métricas operativas claras",
    ],
  },
  {
    slug: "agrocombus",
    name: "AgroCombus",
    sector: "Agronegocio",
    hook: "Campo y logística con trazabilidad: qué salió, cuándo y con qué respaldo.",
    publicNote:
      "Ficha pública del producto. Para alcance, integraciones y tiempos reales, coordiná una conversación con el equipo.",
    bullets: [
      "Trazabilidad entre campo, silo y transporte",
      "Registro auditable de movimientos y lotes",
      "Menos dudas cuando hay disputas o auditorías",
    ],
  },
  {
    slug: "nexocam",
    name: "NexoCam",
    sector: "Video / IA",
    hook: "Video como señal de gestión: alertas y registro donde el riesgo es serio.",
    publicNote:
      "Ficha pública del producto. Para alcance, integraciones y tiempos reales, coordiná una conversación con el equipo.",
    bullets: [
      "Alertas y registro donde el riesgo operativo es alto",
      "Video como insumo de gestión, no solo grabación",
      "IA solo donde hay trazabilidad y margen de error acotado",
    ],
  },
];

export function getSaasBySlug(slug: string): SaasProduct | undefined {
  return SAAS_PRODUCTS.find((p) => p.slug === slug);
}
