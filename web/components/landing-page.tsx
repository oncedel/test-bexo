"use client";

import { InicioHero } from "@/components/inicio-hero";
import { LandingChatPanel } from "@/components/landing-chat-panel";
import { LandingCustomCursor } from "@/components/landing-custom-cursor";
import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";

import { SAAS_PRODUCTS, type SaasProduct } from "@/lib/saas-products";
import {
  IconArrowRight,
  IconCalendar,
  IconChart,
  IconChat,
  IconCheck,
  IconChevronDown,
  IconCpu,
  IconCube,
  IconEnvelope,
  IconLightBulb,
  IconProcess,
  IconShield,
  IconSparkles,
  IconUserGroup,
  IconWarning,
} from "@/components/landing-content-icons";

const CONTENT_EASE = [0.22, 1, 0.36, 1] as const;

const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

const staggerItem = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.42, ease: CONTENT_EASE },
  },
};

const STEP_ICONS = [IconLightBulb, IconShield, IconUserGroup, IconChart] as const;

const WIN_ICONS = [IconChart, IconUserGroup, IconShield] as const;

const MAIL_HREF =
  "mailto:hola@bexo.digital?subject=Reunión%20con%20Bexo&body=Contanos%20industria%2C%20volumen%20aproximado%20y%20qué%20querés%20resolver.";

const pains = [
  "Versiones distintas del mismo dato entre finanzas y operación.",
  "Software que nadie quiere usar cuando el día se complica.",
  "Integraciones frágiles que nadie sostiene cuando hay que auditar.",
];

const wins = [
  {
    title: "Una sola verdad",
    text: "Todos miran los mismos números. Menos reuniones para reconciliar Excel.",
  },
  {
    title: "Interfaz que se usa",
    text: "Flujos pensados para el pico del día, no para el screenshot del sitio.",
  },
  {
    title: "Hecho para durar",
    text: "Arquitectura y handover: el código y la doc viven en tu empresa.",
  },
];

const steps = [
  {
    title: "Diagnóstico",
    text: "Dónde se pierde plata o tiempo y qué ya tenés para apoyarnos.",
  },
  {
    title: "Propuesta cerrada",
    text: "Fases, entregables y riesgos por escrito — sin sorpresas a mitad de camino.",
  },
  {
    title: "Ejecución",
    text: "Entregas cortas, revisión con tu equipo y calidad donde importa.",
  },
  {
    title: "Seguimiento",
    text: "Mejoras según uso real; vos quedás con repos y documentación.",
  },
];

const faqs = [
  {
    q: "¿Trabajan con nuestro ERP o pagos?",
    a: "Sí. Definimos contratos, reconciliación y dueños de cada dato desde el inicio.",
  },
  {
    q: "¿El código es nuestro?",
    a: "Sí: accesos, repos y notas de arquitectura. Planificamos la transición cuando quieras tomar el timón interno.",
  },
  {
    q: "¿Cuánto tarda una primera entrega?",
    a: "Depende del alcance, pero siempre por fases verificables. En la primera conversación acotamos supuestos y plazos realistas.",
  },
  {
    q: "¿Usan IA por defecto?",
    a: "Solo donde hay datos, margen de error acotado y trazabilidad. Sin demos que nadie opera después.",
  },
];

/** Secciones de la landing — navegación superior + scroll spy */
const LANDING_NAV_SECTIONS: Array<{
  id: string;
  title: string;
  hint: string;
}> = [
  {
    id: "inicio",
    title: "Inicio",
    hint: "Propuesta y primer paso",
  },
  {
    id: "diagnostico",
    title: "Señales y valor",
    hint: "Cuándo actuar y qué ganás con Bexo",
  },
  {
    id: "proceso",
    title: "Cómo trabajamos",
    hint: "Diagnóstico, propuesta y entregas",
  },
  {
    id: "tecnologia",
    title: "Tecnología",
    hint: "Stack y estándares",
  },
  {
    id: "faq",
    title: "Preguntas",
    hint: "Respuestas frecuentes",
  },
  {
    id: "contacto",
    title: "Contacto",
    hint: "Siguiente paso",
  },
];

const BEHIND_THE_SCENES = {
  inicio: {
    peekLabel: "¿Cómo armamos esta bienvenida?",
    title: "Qué ves arriba y por qué está ordenado así",
    paragraphs: [
      "Arriba del bloque «Somos Bexo» tenés el hero en lime de marca (#B2CC28): textos en navy para contraste, CTA principal relleno navy y —en pantallas grandes— un diagrama en tarjetas claras que conecta «Operación» y «Números». Debajo, el panel amplía con ejemplos y el recorrido Hoy → Con Bexo → Después.",
      "Los botones te llevan a coordinar una reunión o a seguir leyendo las señales típicas cuando el software ya no acompaña al negocio. No hace falta saber de programación: todo está pensado para que entiendas la propuesta antes de comprometer tiempo.",
    ],
  },
  diagnosticoSenales: {
    peekLabel: "¿Por qué listamos estas señales?",
    title: "Cómo leer la lista de “síntomas”",
    paragraphs: [
      "Cada ítem describe una situación real que vemos en diagnóstico: equipos atados a planillas, datos que no cierran, procesos que dependen de una sola persona, etc.",
      "La idea no es asustar ni diagnosticar desde una web: es ayudarte a nombrar lo que ya te está costando plata o tiempo. Si algo te suena familiar, suele ser un buen momento para una charla sin compromiso.",
    ],
  },
  diagnosticoValor: {
    peekLabel: "¿Qué significan esas tres tarjetas de valor?",
    title: "Qué ganás al trabajar con Bexo (en negocio, no en jerga)",
    paragraphs: [
      "Las tres columnas responden a “¿qué cambia en el día a día?”. Cada una traduce un beneficio concreto: menos fricción operativa, decisiones con datos confiables y sistemas que el equipo realmente usa.",
      "Los números 01, 02, 03 solo marcan el orden de lectura. No es un ranking rígido: según tu industria, una tarjeta puede pesar más que otra.",
    ],
  },
  proceso: {
    peekLabel: "¿Cómo leer la línea de tiempo del proceso?",
    title: "De la primera conversación a la entrega",
    paragraphs: [
      "Los pasos muestran cómo encaramos un proyecto: entendemos el contexto, proponemos fases acotadas, construimos con entregas verificables y dejamos documentación para que tu organización no dependa de “magia”.",
      "En cada etapa sabés qué esperar y qué necesitamos de tu lado (accesos, responsables, decisiones). Así se evitan sorpresas a mitad de camino.",
    ],
  },
  tecnologia: {
    peekLabel: "¿Para qué mostramos tecnología en una página comercial?",
    title: "Stack y estándares sin tecnicismo innecesario",
    paragraphs: [
      "Acá contamos con qué herramientas trabajamos y qué nos importa a la hora de integrar con tu ERP, pagos o datos sensibles.",
      "No tenés que conocer los nombres: sirven para que tu equipo técnico (si lo tenés) valide que no estamos improvisando, y para que sepas que pensamos en seguridad, accesibilidad y mantenimiento a largo plazo.",
    ],
  },
  faq: {
    peekLabel: "¿Por qué estas preguntas y no otras?",
    title: "Respuestas cortas a dudas habituales antes del primer mail",
    paragraphs: [
      "Las preguntas frecuentes cubren temas que suelen aparecer en la primera conversación: plazos, propiedad del código, uso de IA, alcance por fases, etc.",
      "Si tu duda no está listada, no pasa nada: el contacto es con personas; la web solo adelanta transparencia.",
    ],
  },
  contacto: {
    peekLabel: "¿Qué datos ves en el cierre de página?",
    title: "Cómo dar el siguiente paso",
    paragraphs: [
      "Al final dejamos el mail y un texto sugerido para el asunto. Así nos llega contexto desde el primer mensaje y podemos responderte con hipótesis y próximos pasos concretos.",
      "También recordamos el tipo de empresas con las que mejor encajamos, para ahorrarte tiempo si hoy no es el momento.",
    ],
  },
} as const;

type BehindTheScenesId = keyof typeof BEHIND_THE_SCENES;

function BehindTheScenesBlock({ id }: { id: BehindTheScenesId }) {
  const copy = BEHIND_THE_SCENES[id];
  return (
    <div className="px-2 py-2 sm:px-3">
      <h3 className="font-display text-base font-bold tracking-tight text-[var(--color-lime)] sm:text-lg">
        {copy.title}
      </h3>
      <div className="mt-3 space-y-3 font-body text-[16px] font-medium leading-relaxed text-[#dadada] sm:text-[17px]">
        {copy.paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
    </div>
  );
}

/** Card lateral al hover (solo puntero fino + pantalla grande; mismo lenguaje visual que HumanPanel). */
function SaasHoverFlyout({
  product,
  position,
  innerRef,
  onMouseEnter,
  onMouseLeave,
}: {
  product: SaasProduct;
  position: { left: number; top: number };
  innerRef: RefObject<HTMLDivElement | null>;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}) {
  const btnBase =
    "flex h-12 min-h-12 flex-1 basis-0 items-center justify-center gap-1.5 rounded-lg px-2 font-body text-[13px] font-semibold leading-none whitespace-nowrap";

  return (
    <div
      ref={innerRef}
      role="tooltip"
      className="fixed z-[80] hidden max-h-[min(68vh,460px)] w-[min(360px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border-2 border-[#5c5c5c] bg-[#1a1a1a] shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_18px_52px_rgba(0,0,0,0.55)] lg:flex"
      style={{ left: position.left, top: position.top }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div
        className="pointer-events-none absolute -right-8 -top-10 h-32 w-32 rounded-full bg-[var(--color-lime)]/12 blur-2xl"
        aria-hidden
      />
      <div className="relative min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-4 pt-5">
        {product.featured ? (
          <p className="font-body text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--color-lime)]">
            Línea destacada
          </p>
        ) : null}
        <p className="font-display text-lg font-bold leading-tight tracking-tight text-white sm:text-xl">
          {product.name}
        </p>
        <p className="mt-1.5 inline-flex rounded-full border-2 border-[color-mix(in_srgb,var(--color-lime)_55%,#666)] bg-[color-mix(in_srgb,var(--color-lime)_16%,#252525)] px-2.5 py-0.5 font-body text-[12px] font-semibold uppercase tracking-wide text-[var(--color-lime)]">
          {product.sector}
        </p>
        <p className="mt-3 font-body text-[14px] font-medium leading-snug text-[#eaeaea] sm:text-[15px]">
          {product.hook}
        </p>
        <ul className="mt-3 space-y-1.5 border-t-2 border-[#4a4a4a] pt-3 font-body text-[13px] font-medium leading-snug text-[#dedede] sm:text-[14px]">
          {product.bullets.map((b) => (
            <li key={b} className="flex gap-2">
              <IconCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--color-lime)] sm:h-4 sm:w-4" />
              <span>{b}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 font-body text-[12px] font-medium leading-snug text-[#b8b8b8] sm:text-[13px]">
          {product.publicNote}
        </p>
      </div>

      <div className="shrink-0 border-t-2 border-[#4a4a4a] bg-[#141414] px-4 py-3">
        <div className="flex gap-2">
          <Link
            href={`/p/${product.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            title="Abrir ficha completa en una pestaña nueva"
            className={`${btnBase} bg-[var(--color-lime)] font-bold text-[#131428] transition-opacity hover:opacity-95`}
          >
            <IconArrowRight className="h-4 w-4 shrink-0" />
            <span className="min-w-0 truncate">Abrir ficha</span>
          </Link>
          <a
            href={MAIL_HREF}
            title="Coordinar reunión por correo"
            className={`${btnBase} border-2 border-[#6a6a6a] bg-[#2e2e2e] font-bold text-white hover:border-[#888] hover:bg-[#3a3a3a]`}
          >
            <IconCalendar className="h-4 w-4 shrink-0 text-[var(--color-lime)]" />
            <span className="min-w-0 truncate">Coordinar</span>
          </a>
        </div>
      </div>
    </div>
  );
}

/** Sección con entrada suave al hacer scroll */
function ContentSection({
  id,
  children,
  className = "",
}: {
  id?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px -6% 0px" }}
      transition={{ duration: 0.55, ease: CONTENT_EASE }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

/** Bloque legible: fondo animado + tipografía sans / display */
function HumanPanel({
  children,
  className = "",
  lead,
}: {
  children: ReactNode;
  className?: string;
  lead?: ReactNode;
}) {
  const reduceMotion = useReducedMotion();
  return (
    <div
      className={[
        "relative overflow-hidden rounded-2xl border border-[#4a4a4a] bg-[#2a2a2a] px-5 py-7 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_12px_40px_rgba(0,0,0,0.25)] sm:px-8 sm:py-9",
        className,
      ].join(" ")}
    >
      {reduceMotion ? (
        <div
          className="pointer-events-none absolute -right-6 -top-6 h-28 w-28 rounded-full bg-[var(--color-lime)]/10 blur-2xl"
          aria-hidden
        />
      ) : (
        <>
          <motion.div
            className="pointer-events-none absolute -right-10 -top-20 h-48 w-48 rounded-full bg-[var(--color-lime)]/14"
            aria-hidden
            animate={{ scale: [1, 1.12, 1], opacity: [0.4, 0.6, 0.4] }}
            transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
            style={{ filter: "blur(42px)" }}
          />
          <motion.div
            className="pointer-events-none absolute -bottom-16 -left-8 h-40 w-40 rounded-full bg-[#569cd6]/08"
            aria-hidden
            animate={{ scale: [1.08, 1, 1.08] }}
            transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
            style={{ filter: "blur(38px)" }}
          />
        </>
      )}
      <div className="relative z-[1] landing-human-doc">
        {lead}
        {children}
      </div>
    </div>
  );
}

/** Detalle plegable — explicación en lenguaje claro de lo que ves arriba */
function CodePeek({
  label = "¿Cómo armamos esta parte?",
  children,
}: {
  label?: string;
  children: ReactNode;
}) {
  return (
    <details className="group/codepeek mt-6 overflow-hidden rounded-xl border border-[#3a3a3a] bg-[#181818]/95 open:border-[color-mix(in_srgb,var(--color-lime)_28%,#3a3a3a)] open:shadow-[0_0_0_1px_rgba(178,204,40,0.08)]">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3.5 font-body text-[15px] leading-snug text-[#e4e4e4] transition-colors hover:bg-white/[0.04] [&::-webkit-details-marker]:hidden">
        <span className="min-w-0 flex-1 font-medium text-white">{label}</span>
        <IconChevronDown className="h-5 w-5 shrink-0 text-[var(--color-lime)] transition-transform duration-200 group-open/codepeek:rotate-180" />
      </summary>
      <div className="border-t border-[#3a3a3a] bg-[#141414] px-2 py-3 sm:px-3">
        <div className="overflow-hidden rounded-lg border border-[#2d2d30] bg-[#1e1e1e] px-2 py-3 shadow-inner sm:px-3">
          {children}
        </div>
      </div>
    </details>
  );
}

export function LandingPage() {
  const [activeSection, setActiveSection] = useState("inicio");
  const [saasPanelOpen, setSaasPanelOpen] = useState(false);
  const saasFlyoutRef = useRef<HTMLDivElement>(null);
  const saasFlyoutCloseTimer = useRef<number | null>(null);
  const [saasFlyout, setSaasFlyout] = useState<{
    product: SaasProduct;
    left: number;
    top: number;
  } | null>(null);
  const reduceMotion = useReducedMotion();
  const mainRef = useRef<HTMLElement | null>(null);
  const navBtnRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const scrollSpyEnabledRef = useRef(false);
  const [mainMounted, setMainMounted] = useState(false);
  const [onboardingDone, setOnboardingDone] = useState<boolean | null>(null);
  const [tourVisible, setTourVisible] = useState(false);
  const [tourMessage, setTourMessage] = useState("");
  const [sidebarPulse, setSidebarPulse] = useState(false);

  useLayoutEffect(() => {
    if (typeof window !== "undefined") {
      const nav = performance.getEntriesByType(
        "navigation",
      )[0] as PerformanceNavigationTiming | undefined;
      const isReload = nav?.type === "reload";
      const forceTour = new URLSearchParams(window.location.search).has(
        "tour",
      );
      if (isReload || forceTour) {
        sessionStorage.removeItem("bexo-onboard");
        if (forceTour) {
          window.history.replaceState(
            null,
            "",
            `${window.location.pathname}${window.location.hash}`,
          );
        }
      }
    }
    if (sessionStorage.getItem("bexo-onboard") === "1" || reduceMotion) {
      if (reduceMotion) sessionStorage.setItem("bexo-onboard", "1");
      setOnboardingDone(true);
    } else {
      setOnboardingDone(false);
    }
  }, [reduceMotion]);

  useEffect(() => {
    scrollSpyEnabledRef.current = onboardingDone === true;
  }, [onboardingDone]);

  const scrollToSection = useCallback(
    (sectionId: string, opts?: { behavior?: ScrollBehavior }) => {
      setActiveSection(sectionId);
      setSaasPanelOpen(false);
      setSaasFlyout(null);
      if (saasFlyoutCloseTimer.current != null) {
        window.clearTimeout(saasFlyoutCloseTimer.current);
        saasFlyoutCloseTimer.current = null;
      }
      const el = document.getElementById(sectionId);
      const behavior =
        opts?.behavior ?? (reduceMotion ? "auto" : "smooth");
      if (el) el.scrollIntoView({ behavior, block: "start" });
      window.requestAnimationFrame(() => {
        navBtnRefs.current[sectionId]?.scrollIntoView({
          block: "nearest",
          behavior: "auto",
        });
      });
    },
    [reduceMotion],
  );

  const clearSaasFlyoutClose = useCallback(() => {
    if (saasFlyoutCloseTimer.current != null) {
      window.clearTimeout(saasFlyoutCloseTimer.current);
      saasFlyoutCloseTimer.current = null;
    }
  }, []);

  const scheduleSaasFlyoutClose = useCallback(() => {
    clearSaasFlyoutClose();
    saasFlyoutCloseTimer.current = window.setTimeout(() => {
      setSaasFlyout(null);
      saasFlyoutCloseTimer.current = null;
    }, 160);
  }, [clearSaasFlyoutClose]);

  const positionSaasFlyout = useCallback(
    (el: HTMLElement, product: SaasProduct) => {
      if (typeof window === "undefined" || window.innerWidth < 1024) return;
      const r = el.getBoundingClientRect();
      const cardW = Math.min(340, window.innerWidth - 32);
      const estH = Math.min(window.innerHeight * 0.68, 460);
      const gutter = 8;
      let left = r.right + gutter;
      if (left + cardW > window.innerWidth - 12) {
        left = Math.max(12, r.left - cardW - gutter);
      }
      let top = r.top;
      if (top + estH > window.innerHeight - 12) {
        top = window.innerHeight - estH - 12;
      }
      if (top < 12) top = 12;
      setSaasFlyout({ product, left, top });
    },
    [],
  );

  useEffect(() => {
    return () => clearSaasFlyoutClose();
  }, [clearSaasFlyoutClose]);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth < 1024) setSaasFlyout(null);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (onboardingDone !== true || !mainRef.current) return;
    const main = mainRef.current;
    const sectionByDomId = Object.fromEntries(
      LANDING_NAV_SECTIONS.map((s) => [s.id, s.id] as const),
    );

    const onMainScroll = () => {
      if (!scrollSpyEnabledRef.current) return;
      if (main.scrollTop < 96) {
        setActiveSection(LANDING_NAV_SECTIONS[0].id);
        return;
      }
    };
    main.addEventListener("scroll", onMainScroll, { passive: true });

    const obs = new IntersectionObserver(
      (entries) => {
        if (!scrollSpyEnabledRef.current) return;
        const visible = entries.filter(
          (e) => e.isIntersecting && e.intersectionRatio >= 0.12,
        );
        if (!visible.length) return;
        const best = visible.reduce((a, b) =>
          a.intersectionRatio >= b.intersectionRatio ? a : b,
        );
        const id = (best.target as HTMLElement).id;
        const sid = sectionByDomId[id];
        if (sid) setActiveSection(sid);
      },
      {
        root: main,
        rootMargin: "-16% 0px -48% 0px",
        threshold: [0.08, 0.15, 0.25, 0.4, 0.55],
      },
    );

    LANDING_NAV_SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) obs.observe(el);
    });
    onMainScroll();

    return () => {
      main.removeEventListener("scroll", onMainScroll);
      obs.disconnect();
    };
  }, [onboardingDone, mainMounted]);

  useEffect(() => {
    if (onboardingDone !== false) return;

    let cancelled = false;
    const sleep = (ms: number) =>
      new Promise<void>((resolve) => window.setTimeout(resolve, ms));

    (async () => {
      setTourVisible(true);
      setSidebarPulse(true);

      setTourMessage(
        "Te damos la bienvenida. Priorizamos el tiempo de quien ya trabaja con nosotros, así que todavía no invertimos en una web \"de estudio\". Esta presentación está armada con el mismo tipo de entorno en el que construimos productos: es nuestra forma directa de mostrarte propuesta, riesgos, cómo trabajamos y, si querés profundizar, una explicación en palabras simples bajo cada bloque principal.",
      );
      await sleep(5500);
      if (cancelled) return;

      setTourMessage(
        "Arriba tenés las pestañas de la landing: un clic en cada una te lleva a esa parte. A la izquierda están nuestras SaaS: cada una abre su ficha en una pestaña nueva.",
      );
      await sleep(4500);
      if (cancelled) return;

      for (let i = 0; i < LANDING_NAV_SECTIONS.length; i++) {
        const { id, title } = LANDING_NAV_SECTIONS[i];
        setTourMessage(
          `Recorremos la landing — ahora: «${title}». Podés volver a cualquier bloque desde la barra superior.`,
        );
        setActiveSection(id);
        document.getElementById(id)?.scrollIntoView({
          behavior: "auto",
          block: "start",
        });
        navBtnRefs.current[id]?.scrollIntoView({
          block: "nearest",
          behavior: "auto",
        });
        await sleep(980);
        if (cancelled) return;
      }

      setTourMessage(
        "Cuando scrollees por tu cuenta, la pestaña activa sigue la sección que estás leyendo.",
      );
      await sleep(4000);
      if (cancelled) return;

      const first = LANDING_NAV_SECTIONS[0];
      setActiveSection(first.id);
      document.getElementById(first.id)?.scrollIntoView({
        behavior: "auto",
        block: "start",
      });
      navBtnRefs.current[first.id]?.scrollIntoView({
        block: "nearest",
        behavior: "auto",
      });
      await sleep(900);
      if (cancelled) return;

      setSidebarPulse(false);
      setTourVisible(false);
      sessionStorage.setItem("bexo-onboard", "1");
      setOnboardingDone(true);
    })();

    return () => {
      cancelled = true;
    };
  }, [onboardingDone]);

  const showCustomCursor =
    onboardingDone !== null && !reduceMotion;

  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden bg-[var(--ide-bg)] text-[#cccccc]">
      {/* Title bar */}
      <header className="flex h-9 shrink-0 items-center gap-2 border-b border-[color-mix(in_srgb,var(--color-navy)_18%,transparent)] bg-[var(--color-lime)] px-2 text-[13px] text-[var(--color-navy)]">
        <button
          type="button"
          className="flex h-8 items-center rounded px-2.5 font-ide-mono text-[13px] font-semibold text-[var(--color-navy)] hover:bg-[color-mix(in_srgb,var(--color-navy)_12%,transparent)] lg:hidden"
          aria-label="Abrir listado de productos SaaS"
          aria-expanded={saasPanelOpen}
          onClick={() => setSaasPanelOpen((v) => !v)}
        >
          SaaS
        </button>
        <span className="hidden font-display text-[12px] font-bold uppercase tracking-[0.26em] text-[var(--color-navy)] sm:inline">
          Bexo
        </span>
        <span className="hidden text-[color-mix(in_srgb,var(--color-navy)_45%,transparent)] lg:inline">
          —
        </span>
        <span className="hidden truncate font-body text-[13px] text-[color-mix(in_srgb,var(--color-navy)_78%,transparent)] lg:inline">
          Software operativo B2B · Bexo
        </span>
        <div className="ml-auto flex items-center gap-2">
          <Link
            href={MAIL_HREF}
            className="rounded px-2 py-0.5 font-ide-mono text-[12px] font-semibold text-[var(--color-navy)] underline-offset-2 hover:underline"
          >
            hola@bexo.digital
          </Link>
        </div>
      </header>

      <div className="relative flex min-h-0 flex-1 flex-col bg-[var(--ide-bg)] lg:flex-row">
        {/* SaaS — enlaces a fichas de producto (nueva pestaña) */}
        <motion.aside
          animate={
            reduceMotion
              ? undefined
              : {
                  scale: sidebarPulse ? 1.02 : 1,
                  boxShadow: sidebarPulse
                    ? "0 0 0 2px rgba(178,204,40,0.45), 0 12px 40px rgba(0,0,0,0.35)"
                    : "0 0 0 0px rgba(178,204,40,0)",
                }
          }
          transition={{ type: "spring", stiffness: 260, damping: 28 }}
          className={[
            "z-30 flex w-[min(320px,92vw)] shrink-0 flex-col border-[var(--ide-border)] text-[16px] transition-[transform,opacity] max-lg:fixed max-lg:inset-y-8 max-lg:left-0 max-lg:top-8 max-lg:border-y max-lg:border-r max-lg:shadow-xl",
            "bg-[linear-gradient(180deg,color-mix(in_srgb,var(--color-lime)_14%,#2a2520)_0%,#252526_22%,var(--ide-sidebar)_55%)]",
            saasPanelOpen
              ? "max-lg:translate-x-0 max-lg:opacity-100"
              : "max-lg:pointer-events-none max-lg:-translate-x-full max-lg:opacity-0",
            "lg:static lg:w-[min(320px,36vw)] lg:max-w-[380px] lg:translate-x-0 lg:opacity-100 lg:shadow-none",
          ].join(" ")}
        >
          <div className="border-b border-[var(--ide-border)] px-3.5 py-3">
            <p className="font-display text-[15px] font-bold uppercase tracking-[0.16em] text-[#e8e8e8]">
              Nuestras SaaS
            </p>
            <p className="mt-1.5 font-body text-[14px] leading-snug text-[#909090] sm:text-[15px]">
              Pasá el mouse por un producto (escritorio) para ver la ficha
              ampliada al costado.
            </p>
          </div>

          <nav
            className="min-h-0 flex-1 space-y-1.5 overflow-y-auto py-3.5 pr-1.5 pl-2.5"
            aria-label="Productos SaaS"
          >
            {SAAS_PRODUCTS.map((item) => (
              <div key={item.slug}>
                <Link
                  href={`/p/${item.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full rounded-lg border border-transparent bg-black/10 px-3.5 py-3 text-left transition-all duration-200 hover:border-[color-mix(in_srgb,var(--color-lime)_35%,#555)] hover:bg-[color-mix(in_srgb,var(--color-lime)_10%,transparent)]"
                  onMouseEnter={(e) => {
                    clearSaasFlyoutClose();
                    positionSaasFlyout(e.currentTarget, item);
                  }}
                  onMouseLeave={scheduleSaasFlyoutClose}
                >
                  <span className="block font-display text-[17px] font-bold leading-tight text-[#f3f3f3] sm:text-[18px]">
                    {item.name}
                    {item.featured ? (
                      <span className="ml-2 align-middle font-body text-[12px] font-bold uppercase tracking-wide text-[var(--color-lime)]">
                        · ref.
                      </span>
                    ) : null}
                  </span>
                  <span className="mt-1.5 block font-body text-[14px] leading-snug text-[#a0a0a0] sm:text-[15px]">
                    {item.sector}
                  </span>
                  <span className="mt-2 block font-body text-[14px] leading-snug text-[#c8c8c8] sm:text-[15px]">
                    {item.hook}
                  </span>
                  <span className="mt-2.5 inline-flex items-center gap-1.5 font-body text-[13px] font-semibold text-[var(--color-lime)] sm:text-[14px]">
                    Abrir ficha
                    <IconArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </span>
                </Link>
              </div>
            ))}
          </nav>
        </motion.aside>
        {saasFlyout ? (
          <SaasHoverFlyout
            product={saasFlyout.product}
            position={{ left: saasFlyout.left, top: saasFlyout.top }}
            innerRef={saasFlyoutRef}
            onMouseEnter={clearSaasFlyoutClose}
            onMouseLeave={scheduleSaasFlyoutClose}
          />
        ) : null}
        {saasPanelOpen ? (
          <button
            type="button"
            className="fixed inset-0 z-20 bg-black/40 lg:hidden"
            aria-label="Cerrar panel de productos"
            onClick={() => setSaasPanelOpen(false)}
          />
        ) : null}

        {/* Editor + status */}
        <div className="flex min-h-0 min-w-0 flex-1 flex-col bg-[var(--ide-bg)]">
          <nav
            className="sticky top-0 z-10 shrink-0 border-b border-[var(--ide-border)] bg-[#252526] shadow-[inset_0_-1px_0_rgba(0,0,0,0.35)]"
            aria-label="Secciones de la presentación"
          >
            <div className="flex max-w-full items-stretch gap-1.5 overflow-x-auto px-2 py-2.5 sm:gap-2 sm:px-3 sm:py-3 [scrollbar-width:thin]">
              {LANDING_NAV_SECTIONS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  ref={(el) => {
                    navBtnRefs.current[item.id] = el;
                  }}
                  onClick={() => scrollToSection(item.id)}
                  title={item.hint}
                  className={[
                    "shrink-0 rounded-lg border px-3.5 py-2.5 text-left font-display text-[15px] font-bold leading-tight transition-all duration-200 sm:px-4 sm:py-3 sm:text-[16px]",
                    activeSection === item.id
                      ? "border-[color-mix(in_srgb,var(--color-lime)_55%,#5a6238)] bg-[color-mix(in_srgb,var(--color-lime)_24%,#2a3220)] text-white shadow-[0_0_20px_color-mix(in_srgb,var(--color-lime)_18%,transparent)]"
                      : "border-transparent bg-black/15 text-[#e2e2e2] hover:border-[color-mix(in_srgb,var(--color-lime)_22%,#444)] hover:bg-[color-mix(in_srgb,var(--color-lime)_8%,transparent)]",
                  ].join(" ")}
                >
                  <span className="block whitespace-nowrap">{item.title}</span>
                  <span className="mt-1 hidden max-w-[11rem] truncate font-body text-[12px] font-normal leading-snug text-[#a8a8a8] sm:block sm:max-w-[12rem] sm:text-[13px]">
                    {item.hint}
                  </span>
                </button>
              ))}
            </div>
          </nav>

          <main
            ref={(el) => {
              mainRef.current = el;
              setMainMounted(!!el);
            }}
            className="landing-doc-column min-h-0 flex-1 overflow-y-auto bg-[#1e1e1e]"
          >
            <div className="border-b border-[#2d2d30] px-3 py-4 sm:px-5 sm:py-5">
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: CONTENT_EASE }}
                className="relative overflow-hidden rounded-2xl border border-[color-mix(in_srgb,var(--color-lime)_35%,#454545)] bg-gradient-to-br from-[#2a3025]/95 via-[#252828] to-[#1e2430] p-4 shadow-[0_20px_50px_rgba(0,0,0,0.35)] sm:p-5"
              >
                <div
                  className="pointer-events-none absolute -right-10 -top-12 h-36 w-36 rounded-full bg-[var(--color-lime)]/12 blur-3xl"
                  aria-hidden
                />
                <div className="relative flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--color-lime)] text-[#131428] shadow-[0_6px_20px_rgba(178,204,40,0.35)]">
                    <IconChart className="h-7 w-7" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-display text-[16px] font-bold leading-tight text-white sm:text-lg">
                      Menos fricción entre operación y números — desde el primer
                      mail
                    </p>
                    <p className="mt-2 font-body text-[16px] leading-relaxed text-[#cfd2c8]">
                      Si dirigís un negocio con mucha operación en paralelo, ya
                      sabés lo que cuesta cuando{" "}
                      <strong className="text-white">cada área mira una versión distinta del dato</strong>
                      . En Bexo diseñamos y construimos{" "}
                      <strong className="text-white">sistemas que tu equipo adopta</strong>
                      : integraciones serias, permisos claros y entregas por fases
                      verificables. Trabajamos con{" "}
                      <strong className="text-[var(--color-lime)]">
                        empresas que facturan de verdad
                      </strong>{" "}
                      en Latam y priorizamos el vínculo comercial cuando ya hay
                      confianza de por medio.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
            <ContentSection
              id="inicio"
              className="scroll-mt-2 border-b border-[#2d2d30] px-3 py-5 sm:px-4"
            >
              <InicioHero
                mailHref={MAIL_HREF}
                onScrollToDiagnostico={() => scrollToSection("diagnostico")}
              />

              <HumanPanel
                lead={
                  <div className="mb-4 flex flex-wrap items-center gap-3">
                    <motion.div
                      initial={{ scale: 0.85, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ type: "spring", stiffness: 380, damping: 24 }}
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[color-mix(in_srgb,var(--color-lime)_50%,#555)] bg-[color-mix(in_srgb,var(--color-lime)_16%,#282828)] text-[var(--color-lime)] shadow-[0_0_28px_color-mix(in_srgb,var(--color-lime)_22%,transparent)]"
                    >
                      <IconSparkles className="h-7 w-7" />
                    </motion.div>
                    <p className="max-w-[18rem] text-[12px] font-semibold uppercase leading-snug tracking-[0.18em] text-[var(--color-lime)] sm:max-w-none sm:tracking-[0.18em]">
                      Pensado para dirección y responsables de área
                    </p>
                  </div>
                }
              >
                <p className="font-body text-[14px] font-medium uppercase tracking-[0.12em] text-[#9a9a9a]">
                  Software a medida para operaciones B2B
                </p>
                <h2 className="mt-2 font-display text-[clamp(1.65rem,4.6vw,2.55rem)] font-bold leading-[1.08] tracking-tight text-white">
                  Somos{" "}
                  <span className="text-[color-mix(in_srgb,var(--color-lime)_92%,white)]">
                    Bexo
                  </span>
                  : hacemos que tu operación y tus números{" "}
                  <span className="text-[color-mix(in_srgb,var(--color-lime)_88%,white)]">
                    dejen de pelear.
                  </span>
                </h2>
                <p className="mt-3 max-w-2xl font-body text-[16px] leading-relaxed text-[#e0e0e0] sm:text-[18px]">
                  Trabajamos con empresas que{" "}
                  <strong className="font-semibold text-white">facturan de verdad</strong>
                  — constructoras, clubes, restaurantes, campo, logística y más.
                  Menos planillas sueltas y reuniones para reconciliar números: más{" "}
                  <strong className="font-semibold text-white">una sola fuente de verdad</strong>{" "}
                  que tu equipo pueda usar un martes complicado.
                </p>

                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  {[
                    {
                      step: "01",
                      title: "Hoy",
                      text: "Datos repartidos: Excel, grupos, ERP a medias… y nadie con la misma cifra.",
                      accent: "border-[#5c5340] bg-[#2d2920]/80",
                    },
                    {
                      step: "02",
                      title: "Con Bexo",
                      text: "Un sistema a la medida: pantallas claras, integraciones serias, permisos bien definidos.",
                      accent:
                        "border-[color-mix(in_srgb,var(--color-lime)_45%,#555)] bg-[color-mix(in_srgb,var(--color-lime)_10%,#252525)]",
                    },
                    {
                      step: "03",
                      title: "Después",
                      text: "Tu gente adopta la herramienta; vos reconciliás menos y decidís con datos que confían.",
                      accent: "border-[#3d4f5c] bg-[#1f2830]/85",
                    },
                  ].map((row) => (
                    <div
                      key={row.step}
                      className={[
                        "relative rounded-xl border p-4 shadow-md backdrop-blur-sm",
                        row.accent,
                      ].join(" ")}
                    >
                      <span className="font-mono text-[11px] font-bold text-[#888]">
                        {row.step}
                      </span>
                      <p className="font-display mt-2 text-sm font-bold text-white">
                        {row.title}
                      </p>
                      <p className="mt-2 font-body text-[14px] leading-relaxed text-[#c4c4c4]">
                        {row.text}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 rounded-2xl border border-white/12 bg-[#141414]/85 p-4 sm:p-5">
                  <p className="flex items-center gap-2 font-display text-[12px] font-bold uppercase tracking-[0.16em] text-[var(--color-lime)]">
                    <IconCube className="h-4 w-4" />
                    Nuestras SaaS (ficha en nueva pestaña)
                  </p>
                  <ul className="mt-3 grid gap-2 font-body text-[15px] text-[#dedede] sm:grid-cols-2">
                    {SAAS_PRODUCTS.map((prod) => (
                      <li
                        key={prod.slug}
                        className="flex gap-2 rounded-lg bg-white/[0.04] px-3 py-2.5"
                      >
                        <IconCheck className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-lime)]" />
                        <span>
                          <Link
                            href={`/p/${prod.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-semibold text-white underline-offset-2 hover:text-[var(--color-lime)] hover:underline"
                          >
                            {prod.name}
                          </Link>
                          <span className="text-[#9a9a9a]">
                            {" "}
                            — {prod.sector}
                          </span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                <motion.ul
                  className="mt-5 flex flex-wrap gap-2"
                  variants={staggerContainer}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: "-5%" }}
                >
                  {[
                    "Productos ya usados en operación real",
                    "Solo empresas B2B",
                    "Código y documentación para tu organización",
                  ].map((t) => (
                    <motion.li
                      key={t}
                      variants={staggerItem}
                      className="flex items-center gap-1.5 rounded-full border border-[#4a4a4a] bg-[#2f2f2f]/90 px-3 py-1.5 font-body text-[13px] text-[#e4e4e4] shadow-sm"
                    >
                      <IconCheck className="h-3.5 w-3.5 shrink-0 text-[var(--color-lime)]" />
                      {t}
                    </motion.li>
                  ))}
                </motion.ul>
                <div className="mt-6 flex flex-wrap gap-2">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Link
                      href={MAIL_HREF}
                      className="inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--color-lime)] px-4 py-2.5 font-body text-sm font-bold text-[#131428] transition-opacity hover:opacity-95"
                    >
                      <IconCalendar className="h-4 w-4" />
                      Coordinar reunión gratuita
                    </Link>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <button
                      type="button"
                      className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#5a5a5a] bg-[#333]/40 px-4 py-2.5 font-body text-sm font-semibold text-white transition-colors hover:border-[#777] hover:bg-[#3a3a3a]"
                      onClick={() => scrollToSection("diagnostico")}
                    >
                      Señales y qué ganás
                      <IconArrowRight className="h-4 w-4 text-[var(--color-lime)]" />
                    </button>
                  </motion.div>
                </div>
                <p className="mt-4 flex items-center gap-1.5 font-body text-[14px] text-[#8f8f8f]">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-lime)] motion-safe:animate-pulse" />
                  Respuesta humana en menos de un día hábil · Latam
                </p>
              </HumanPanel>
              <CodePeek label={BEHIND_THE_SCENES.inicio.peekLabel}>
                <BehindTheScenesBlock id="inicio" />
              </CodePeek>
            </ContentSection>

            <ContentSection
              id="diagnostico"
              className="scroll-mt-2 border-b border-[#2d2d30] px-3 py-5 sm:px-4"
            >
              <HumanPanel
                lead={
                  <div className="mb-2 flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#c5a017]/40 bg-[#3d3518]/60 text-[#e8c547]">
                      <IconWarning className="h-6 w-6" />
                    </div>
                    <div>
                      <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">
                        Antes de invertir: reconocé estas señales
                      </h2>
                    </div>
                  </div>
                }
              >
                <p className="mt-1 max-w-xl font-body text-[16px] leading-relaxed text-[#c8c8c8]">
                  Son patrones que vemos en diagnóstico cuando el software o los
                  procesos ya no acompañan el ritmo del negocio. Si te resonó
                  algo, suele ser buen momento para una conversación sin
                  compromiso.
                </p>
                <motion.ul
                  className="mt-6 space-y-3"
                  variants={staggerContainer}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                >
                  {pains.map((p) => (
                    <motion.li
                      key={p}
                      variants={staggerItem}
                      className="flex gap-3 rounded-lg border border-[#3d3d3d] bg-[#282828]/80 p-3 pl-3 font-body text-[16px] leading-snug text-[#ececec] shadow-sm"
                    >
                      <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[color-mix(in_srgb,var(--color-lime)_15%,#333)] text-[var(--color-lime)]">
                        <IconWarning className="h-4 w-4" />
                      </span>
                      <span>{p}</span>
                    </motion.li>
                  ))}
                </motion.ul>
                <motion.div
                  className="mt-6"
                  whileHover={{ x: 3 }}
                  transition={{ type: "spring", stiffness: 400, damping: 28 }}
                >
                  <Link
                    href={MAIL_HREF}
                    className="inline-flex items-center gap-2 font-body text-sm font-semibold text-[var(--color-lime)] underline-offset-4 hover:underline"
                  >
                    <IconEnvelope className="h-4 w-4" />
                    Contanos tu caso por mail
                  </Link>
                </motion.div>
              </HumanPanel>
              <CodePeek label={BEHIND_THE_SCENES.diagnosticoSenales.peekLabel}>
                <BehindTheScenesBlock id="diagnosticoSenales" />
              </CodePeek>

              <HumanPanel
                className="mt-10"
                lead={
                  <div className="mb-2 flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[color-mix(in_srgb,var(--color-lime)_45%,#555)] bg-[color-mix(in_srgb,var(--color-lime)_12%,#2a2a2a)] text-[var(--color-lime)]">
                      <IconChart className="h-6 w-6" />
                    </div>
                    <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">
                      Qué recuperás al trabajar con Bexo
                    </h2>
                  </div>
                }
              >
                <p className="font-body text-[16px] text-[#b0b0b0]">
                  Tres formas de volver al control — explicadas en negocio, no en
                  jerga.
                </p>
                <div className="mt-6 grid gap-4 sm:grid-cols-3">
                  {wins.map((w, i) => {
                    const WIcon = WIN_ICONS[i] ?? IconChart;
                    return (
                      <motion.article
                        key={w.title}
                        className="rounded-xl border border-[#454545] bg-gradient-to-b from-[#2a2a2a] to-[#222] p-4 shadow-md"
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.08, duration: 0.45, ease: CONTENT_EASE }}
                        whileHover={
                          reduceMotion
                            ? undefined
                            : { y: -4, transition: { duration: 0.2 } }
                        }
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#333] text-[var(--color-lime)]">
                            <WIcon className="h-5 w-5" />
                          </div>
                          <span className="font-display text-2xl font-bold text-white/20">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                        </div>
                        <h3 className="font-display mt-4 text-base font-bold text-white">
                          {w.title}
                        </h3>
                        <p className="mt-2 font-body text-[15px] leading-relaxed text-[#b5b5b5] sm:text-[14px]">
                          {w.text}
                        </p>
                      </motion.article>
                    );
                  })}
                </div>
              </HumanPanel>
              <CodePeek label={BEHIND_THE_SCENES.diagnosticoValor.peekLabel}>
                <BehindTheScenesBlock id="diagnosticoValor" />
              </CodePeek>

              <p className="mt-8 text-center font-body text-[14px] text-[#8f8f8f]">
                ¿Querés profundidad por producto? En el menú{" "}
                <strong className="text-[var(--color-lime)]">Nuestras SaaS</strong>{" "}
                abrís cada ficha en una pestaña nueva.
              </p>
            </ContentSection>

            <ContentSection
              id="proceso"
              className="scroll-mt-2 border-b border-[#2d2d30] px-3 py-5 sm:px-4"
            >
              <HumanPanel
                lead={
                  <div className="mb-2 flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[color-mix(in_srgb,var(--color-lime)_45%,#555)] bg-[color-mix(in_srgb,var(--color-lime)_12%,#2a2a2a)] text-[var(--color-lime)]">
                      <IconProcess className="h-6 w-6" />
                    </div>
                    <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">
                      Cómo es trabajar con nosotros
                    </h2>
                  </div>
                }
              >
                <p className="mt-1 font-body text-[16px] text-[#b0b0b0]">
                  Transparente desde el primer mail: sabés qué esperar en cada
                  etapa.
                </p>
                <div className="relative mt-8">
                  <div
                    className="absolute left-[8%] right-[8%] top-[2.25rem] hidden h-[2px] rounded-full bg-gradient-to-r from-transparent via-[var(--color-lime)]/55 to-transparent lg:block"
                    aria-hidden
                  />
                  <ol className="relative grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {steps.map((s, i) => {
                      const SIcon = STEP_ICONS[i] ?? IconProcess;
                      return (
                        <motion.li
                          key={s.title}
                          className="relative"
                          initial={{ opacity: 0, y: 18 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{
                            delay: i * 0.1,
                            duration: 0.45,
                            ease: CONTENT_EASE,
                          }}
                        >
                          <motion.div
                            className="h-full rounded-xl border border-[#454545] bg-[#252525] p-4 pt-5 shadow-sm"
                            whileHover={
                              reduceMotion
                                ? undefined
                                : {
                                    boxShadow:
                                      "0 12px 32px rgba(0,0,0,0.35)",
                                    borderColor: "rgba(178,204,40,0.25)",
                                  }
                            }
                          >
                            <div className="flex items-center gap-2">
                              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#333] text-[var(--color-lime)]">
                                <SIcon className="h-5 w-5" />
                              </div>
                              <span className="flex h-7 w-7 items-center justify-center rounded-full border border-[var(--color-lime)]/50 bg-[#1a1a1a] font-mono text-[12px] font-bold text-[var(--color-lime)]">
                                {i + 1}
                              </span>
                            </div>
                            <h3 className="font-display mt-4 text-sm font-bold text-white">
                              {s.title}
                            </h3>
                            <p className="mt-2 font-body text-[14px] leading-relaxed text-[#ababab] sm:text-[15px]">
                              {s.text}
                            </p>
                          </motion.div>
                        </motion.li>
                      );
                    })}
                  </ol>
                </div>
              </HumanPanel>
              <CodePeek label={BEHIND_THE_SCENES.proceso.peekLabel}>
                <BehindTheScenesBlock id="proceso" />
              </CodePeek>
            </ContentSection>

            <ContentSection
              id="tecnologia"
              className="scroll-mt-2 border-b border-[#2d2d30] px-3 py-5 sm:px-4"
            >
              <HumanPanel
                lead={
                  <div className="mb-2 flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#569cd6]/35 bg-[#1e2a38]/70 text-[#7dccff]">
                      <IconCpu className="h-6 w-6" />
                    </div>
                    <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">
                      Tecnología seria, explicada simple
                    </h2>
                  </div>
                }
              >
                <p className="mt-1 max-w-2xl font-body text-[16px] leading-relaxed text-[#b8b8b8]">
                  <strong className="font-semibold text-white">
                    React, Next.js y TypeScript
                  </strong>{" "}
                  — la misma familia de herramientas que usan productos globales.
                  Vos pensás en el negocio; nosotros en integraciones, seguridad e
                  interfaz impecable.
                </p>
                <motion.div
                  className="mt-5 flex flex-wrap gap-2"
                  variants={staggerContainer}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                >
                  {[
                    "APIs",
                    "ERP",
                    "Pagos",
                    "Observabilidad",
                    "Accesibilidad",
                    "IA aplicada",
                  ].map((tag) => (
                    <motion.span
                      key={tag}
                      variants={staggerItem}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-[#555] bg-[#2c2c2c] px-2.5 py-1.5 font-body text-[13px] text-[#ddd] shadow-sm"
                    >
                      <IconCpu className="h-3.5 w-3.5 text-[var(--color-lime)] opacity-70" />
                      {tag}
                    </motion.span>
                  ))}
                </motion.div>
              </HumanPanel>
              <CodePeek label={BEHIND_THE_SCENES.tecnologia.peekLabel}>
                <BehindTheScenesBlock id="tecnologia" />
              </CodePeek>
            </ContentSection>

            <ContentSection
              id="faq"
              className="scroll-mt-2 border-b border-[#2d2d30] px-3 py-5 sm:px-4"
            >
              <HumanPanel
                lead={
                  <div className="mb-2 flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#7dccff]/30 bg-[#1e2a38]/50 text-[#7dccff]">
                      <IconChat className="h-6 w-6" />
                    </div>
                    <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">
                      Preguntas frecuentes
                    </h2>
                  </div>
                }
              >
                <p className="mt-1 font-body text-[16px] text-[#a8a8a8]">
                  Respuestas directas antes del primer llamado.
                </p>
                <div className="mt-6 space-y-2">
                  {faqs.map((f, i) => (
                    <motion.details
                      key={f.q}
                      className="group rounded-xl border border-[#454545] bg-[#252525] px-4 py-3 shadow-sm open:border-[color-mix(in_srgb,var(--color-lime)_35%,#454545)] open:shadow-[0_0_0_1px_rgba(178,204,40,0.15)]"
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{
                        delay: i * 0.06,
                        duration: 0.35,
                        ease: CONTENT_EASE,
                      }}
                    >
                      <summary className="flex cursor-pointer list-none items-start justify-between gap-2 font-body text-[16px] font-medium text-[#f0f0f0] marker:content-none [&::-webkit-details-marker]:hidden">
                        <span>{f.q}</span>
                        <IconChevronDown className="mt-0.5 h-5 w-5 shrink-0 text-[var(--color-lime)] transition-transform duration-200 group-open:rotate-180" />
                      </summary>
                      <p className="mt-3 border-t border-[#3c3c3c] pt-3 font-body text-[15px] leading-relaxed text-[#b5b5b5] sm:text-[14px]">
                        {f.a}
                      </p>
                    </motion.details>
                  ))}
                </div>
              </HumanPanel>
              <CodePeek label={BEHIND_THE_SCENES.faq.peekLabel}>
                <BehindTheScenesBlock id="faq" />
              </CodePeek>
            </ContentSection>

            <motion.footer
              id="contacto"
              className="scroll-mt-2 border-t border-[#2d2d30] px-3 py-8 sm:px-4"
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-8% 0px" }}
              transition={{ duration: 0.55, ease: CONTENT_EASE }}
            >
              <HumanPanel
                lead={
                  <div className="mb-2 flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[color-mix(in_srgb,var(--color-lime)_50%,#555)] bg-[color-mix(in_srgb,var(--color-lime)_14%,#2a2a2a)] text-[var(--color-lime)]">
                      <IconEnvelope className="h-6 w-6" />
                    </div>
                    <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-[var(--color-lime)]">
                      Siguiente paso
                    </p>
                  </div>
                }
              >
                <h2 className="font-display text-2xl font-bold leading-tight text-white sm:text-3xl">
                  Mandanos un mail. Volvemos con hipótesis claras y una propuesta
                  por fases.
                </h2>
                <motion.div
                  className="mt-6"
                  whileHover={{ scale: reduceMotion ? 1 : 1.02 }}
                  whileTap={{ scale: reduceMotion ? 1 : 0.98 }}
                >
                  <Link
                    href={MAIL_HREF}
                    className="inline-flex items-center gap-2 rounded-lg bg-[var(--color-lime)] px-5 py-3 font-body text-sm font-bold text-[#131428] hover:opacity-95"
                  >
                    <IconEnvelope className="h-4 w-4" />
                    Escribir a Bexo
                  </Link>
                </motion.div>
                <p className="mt-4 font-body text-[14px] text-[#888]">
                  © {new Date().getFullYear()} Bexo
                </p>
              </HumanPanel>
              <CodePeek label={BEHIND_THE_SCENES.contacto.peekLabel}>
                <BehindTheScenesBlock id="contacto" />
              </CodePeek>
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mt-6 text-center sm:text-left"
              >
                <Link
                  href={MAIL_HREF}
                  className="inline-flex items-center gap-2 border-b-2 border-[#4fc1ff] font-display text-lg font-semibold text-[#7dccff] hover:opacity-85 sm:text-xl"
                >
                  <IconEnvelope className="h-5 w-5" />
                  hola@bexo.digital
                </Link>
              </motion.div>
            </motion.footer>
          </main>

          <div className="flex h-7 shrink-0 items-center gap-3 border-t border-[color-mix(in_srgb,var(--color-navy)_18%,transparent)] bg-[var(--color-lime)] px-2 font-ide-mono text-[12px] text-[var(--color-navy)]">
            <span className="font-medium text-[color-mix(in_srgb,var(--color-navy)_92%,transparent)]">
              main*
            </span>
            <span className="hidden font-medium text-[color-mix(in_srgb,var(--color-navy)_88%,transparent)] sm:inline">
              TypeScript
            </span>
            <span className="ml-auto tabular-nums text-[color-mix(in_srgb,var(--color-navy)_85%,transparent)]">
              UTF-8 · LF
            </span>
          </div>
        </div>

        <aside
          className="flex h-[min(42vh,380px)] shrink-0 flex-col border-[var(--ide-border)] lg:h-auto lg:min-h-0 lg:w-[min(400px,32vw)] lg:max-w-[420px] lg:shrink-0 lg:border-l lg:border-t-0"
          aria-label="Panel Composer"
        >
          <LandingChatPanel variant="ide" />
        </aside>
      </div>

      {tourVisible ? (
        <div
          className="pointer-events-auto fixed inset-0 z-[100001] flex items-end justify-center bg-black/45 pb-[max(2rem,env(safe-area-inset-bottom))] sm:items-center sm:pb-0"
          aria-live="polite"
          role="status"
        >
          <motion.div
            key={tourMessage.slice(0, 48)}
            initial={{ opacity: 0, y: 18, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.4, ease: CONTENT_EASE }}
            className="mx-4 max-w-md rounded-2xl border border-[color-mix(in_srgb,var(--color-lime)_25%,#444)] bg-[#1b1b1b]/96 px-5 py-4 text-center shadow-[0_24px_80px_rgba(0,0,0,0.55)] backdrop-blur-md sm:px-6 sm:py-5"
          >
            <p className="font-body text-sm leading-relaxed text-[#efefef]">
              {tourMessage}
            </p>
            <p className="mt-3 font-body text-[12px] text-[#888]">
              No hace falta hacer clic — seguí viendo la pantalla.
            </p>
          </motion.div>
        </div>
      ) : null}
      <LandingCustomCursor active={showCustomCursor} />
    </div>
  );
}
