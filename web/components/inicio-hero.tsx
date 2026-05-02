"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import {
  IconArrowRight,
  IconCalendar,
  IconChart,
  IconLightBulb,
  IconProcess,
} from "@/components/landing-content-icons";

const EASE = [0.22, 1, 0.36, 1] as const;

function FloatingOrb({
  className,
  delay = 0,
  reduceMotion,
}: {
  className: string;
  delay?: number;
  reduceMotion: boolean;
}) {
  if (reduceMotion) {
    return <div className={className} aria-hidden />;
  }
  return (
    <motion.div
      className={className}
      aria-hidden
      initial={{ opacity: 0.6 }}
      animate={{
        y: [0, -18, 0],
        x: [0, 10, 0],
        scale: [1, 1.08, 1],
        opacity: [0.45, 0.75, 0.45],
      }}
      transition={{
        duration: 11 + delay,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
    />
  );
}

function HeroVisualCluster({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <div className="relative mx-auto flex max-w-[260px] flex-col items-center justify-center py-4 sm:max-w-none sm:py-6">
      <FloatingOrb
        reduceMotion={reduceMotion}
        className="pointer-events-none absolute -right-4 top-0 h-24 w-24 rounded-full bg-[var(--color-navy)]/30 blur-2xl"
        delay={0}
      />
      <FloatingOrb
        reduceMotion={reduceMotion}
        className="pointer-events-none absolute -left-8 bottom-4 h-28 w-28 rounded-full bg-white/45 blur-2xl"
        delay={2.2}
      />

      <motion.div
        initial={{ opacity: 0, y: 16, rotate: -2 }}
        whileInView={{ opacity: 1, y: 0, rotate: 0 }}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 280, damping: 22, delay: 0.08 }}
        className="relative z-[2] w-full max-w-[220px] rounded-xl border-2 border-[color-mix(in_srgb,var(--color-navy)_55%,white)] bg-white px-4 py-3 shadow-[0_14px_36px_rgba(19,20,40,0.42)]"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-navy)] text-[var(--color-lime)] shadow-inner">
            <IconProcess className="h-5 w-5" />
          </div>
          <div>
            <p className="font-display text-[11px] font-bold uppercase tracking-wider text-[color-mix(in_srgb,var(--color-navy)_72%,#333)]">
              Capa 1
            </p>
            <p className="font-display text-[15px] font-bold text-[var(--color-navy)]">
              Operación
            </p>
          </div>
        </div>
      </motion.div>

      <div className="relative z-[1] flex h-14 flex-col items-center justify-center">
        <motion.div
          className="h-full w-px bg-gradient-to-b from-transparent via-[var(--color-navy)]/55 to-transparent"
          aria-hidden
          animate={
            reduceMotion
              ? undefined
              : { opacity: [0.45, 1, 0.45], scaleY: [0.85, 1, 0.85] }
          }
          transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
        />
        {!reduceMotion ? (
          <motion.div
            className="absolute top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-[var(--color-navy)] shadow-[0_0_12px_rgba(19,20,40,0.55)]"
            animate={{ y: [-22, 22, -22] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
            aria-hidden
          />
        ) : null}
      </div>

      <motion.div
        initial={{ opacity: 0, y: -12, rotate: 2 }}
        whileInView={{ opacity: 1, y: 0, rotate: 0 }}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 280, damping: 22, delay: 0.15 }}
        className="relative z-[2] w-full max-w-[220px] rounded-xl border-2 border-[color-mix(in_srgb,var(--color-navy)_55%,white)] bg-white px-4 py-3 shadow-[0_14px_36px_rgba(19,20,40,0.42)]"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-navy)] text-[var(--color-lime)] shadow-inner">
            <IconChart className="h-5 w-5" />
          </div>
          <div>
            <p className="font-display text-[11px] font-bold uppercase tracking-wider text-[color-mix(in_srgb,var(--color-navy)_72%,#333)]">
              Capa 2
            </p>
            <p className="font-display text-[15px] font-bold text-[var(--color-navy)]">
              Números
            </p>
          </div>
        </div>
      </motion.div>

      {!reduceMotion ? (
        <motion.div
          className="pointer-events-none absolute right-[-6%] top-[18%] flex h-11 w-11 items-center justify-center rounded-xl border-2 border-white bg-[var(--color-navy)] text-[var(--color-lime)] shadow-[0_8px_24px_rgba(19,20,40,0.55)]"
          animate={{ y: [0, -8, 0], rotate: [0, 6, 0] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
          aria-hidden
        >
          <IconLightBulb className="h-5 w-5" />
        </motion.div>
      ) : null}
    </div>
  );
}

const headlineVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.07, delayChildren: 0.12 },
  },
};

const lineVariants = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: EASE },
  },
};

export function InicioHero({
  mailHref,
  onScrollToDiagnostico,
}: {
  mailHref: string;
  onScrollToDiagnostico: () => void;
}) {
  const reduceMotionPref = useReducedMotion();
  const reduceMotion = Boolean(reduceMotionPref);

  return (
    <motion.div
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-6% 0px" }}
      transition={{ duration: 0.6, ease: EASE }}
      className="relative mb-8 overflow-hidden rounded-2xl border-2 border-[var(--color-navy)] bg-[var(--color-lime)] shadow-[0_28px_64px_rgba(19,20,40,0.5)] sm:mb-10"
    >
      {/* Profundidad sutil sobre lime marca (#B2CC28) */}
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/14 via-transparent to-[color-mix(in_srgb,var(--color-navy)_18%,var(--color-lime))]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.22]"
        style={{
          backgroundImage: `linear-gradient(color-mix(in srgb, var(--color-navy) 32%, transparent) 1px, transparent 1px),
            linear-gradient(90deg, color-mix(in srgb, var(--color-navy) 28%, transparent) 1px, transparent 1px)`,
          backgroundSize: "24px 24px",
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--color-navy)]/45 to-transparent"
        aria-hidden
      />

      <div className="relative z-[1] px-5 py-8 sm:px-8 sm:py-10 lg:grid lg:grid-cols-[minmax(0,1fr)_min(300px,34%)] lg:gap-10 lg:items-center">
        <div className="min-w-0">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, ease: EASE }}
            className="inline-flex items-center gap-2 rounded-full border-2 border-[var(--color-navy)] bg-white px-3 py-1.5 shadow-sm"
          >
            <span className="relative flex h-2 w-2">
              {!reduceMotion ? (
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--color-navy)] opacity-45" />
              ) : null}
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--color-navy)]" />
            </span>
            <span className="font-body text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--color-navy)] sm:text-[12px]">
              Software operativo B2B · Latam
            </span>
          </motion.div>

          <motion.h1
            className="mt-5 font-display text-[clamp(2rem,6.5vw,3.45rem)] font-bold leading-[1.06] tracking-tight"
            variants={headlineVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <motion.span variants={lineVariants} className="block text-[var(--color-navy)]">
              Operación y números,
            </motion.span>
            <motion.span
              variants={lineVariants}
              className="mt-1 block text-[var(--color-navy)]"
            >
              en la misma historia.
            </motion.span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: EASE, delay: 0.2 }}
            className="mt-6 max-w-2xl font-body text-[17px] font-medium leading-relaxed text-[var(--color-navy)] sm:text-[18px]"
          >
            Menos reconciliación entre áreas y más decisiones con datos que todos
            respetan. El sistema acompaña al negocio — sin humo y con entregas que
            se pueden verificar.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, ease: EASE, delay: 0.28 }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link
                href={mailHref}
                className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-white bg-[var(--color-navy)] px-5 py-3.5 font-body text-[15px] font-bold text-white shadow-[0_12px_32px_rgba(0,0,0,0.35)] transition-opacity hover:opacity-90"
              >
                <IconCalendar className="h-4 w-4 text-[var(--color-lime)]" />
                Coordinar reunión gratuita
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-[var(--color-navy)] bg-white px-5 py-3.5 font-body text-[15px] font-bold text-[var(--color-navy)] shadow-[0_4px_16px_rgba(19,20,40,0.2)] transition-colors hover:bg-[color-mix(in_srgb,white_92%,var(--color-lime))]"
                onClick={onScrollToDiagnostico}
              >
                Ver señales y qué ganás
                <IconArrowRight className="h-4 w-4 text-[var(--color-navy)]" />
              </button>
            </motion.div>
          </motion.div>
        </div>

        <div className="mt-10 border-t-2 border-[color-mix(in_srgb,var(--color-navy)_35%,transparent)] pt-10 lg:mt-0 lg:border-t-0 lg:border-l-2 lg:border-[color-mix(in_srgb,var(--color-navy)_38%,transparent)] lg:pt-0 lg:pl-10">
          <HeroVisualCluster reduceMotion={reduceMotion} />
        </div>
      </div>
    </motion.div>
  );
}
