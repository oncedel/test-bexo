"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

type Role = "user" | "assistant";

type ChatMessage = { id: string; role: Role; content: string };

const INITIAL_ASSISTANT =
  "Hola — soy el asistente de **Bexo**. Preguntame por nuestras líneas (ObraGo, MisCanchas, FastFood, AgroCombus, NexoCam), cómo trabajamos o cómo dar el siguiente paso comercial. Si preferís humano directo: **hola@bexo.digital**.";

const SUGGESTIONS = [
  "¿Qué hace Bexo en una frase?",
  "Tengo una constructora",
  "Proceso y plazos",
  "IA y NexoCam",
  "Quiero agendar",
];

function id() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/** Markdown muy acotado: **negrita** y saltos de línea */
function formatAssistantText(text: string, ide: boolean) {
  const strongClass = ide
    ? "font-semibold text-[#c586c0]"
    : "font-semibold text-[color-mix(in_srgb,white_88%,transparent)]";
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((chunk, i) => {
    const m = chunk.match(/^\*\*([^*]+)\*\*$/);
    if (m) {
      return (
        <strong key={i} className={strongClass}>
          {m[1]}
        </strong>
      );
    }
    return (
      <span key={i} className="whitespace-pre-wrap">
        {chunk}
      </span>
    );
  });
}

export function LandingChatPanel({
  variant = "default",
}: {
  variant?: "default" | "ide";
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: "welcome", role: "assistant", content: INITIAL_ASSISTANT },
  ]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [usedFallback, setUsedFallback] = useState<boolean | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, pending, scrollToBottom]);

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || pending) return;

    const userMsg: ChatMessage = { id: id(), role: "user", content: trimmed };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setPending(true);

    try {
      const history = [...messages, userMsg].map((x) => ({
        role: x.role,
        content: x.content,
      }));
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });
      const data = (await res.json()) as { message?: string; fallback?: boolean; error?: string };
      if (!res.ok) {
        setMessages((m) => [
          ...m,
          {
            id: id(),
            role: "assistant",
            content:
              data.error ??
              "Hubo un error al responder. Escribinos a hola@bexo.digital y lo vemos en persona.",
          },
        ]);
        return;
      }
      setUsedFallback(data.fallback ?? null);
      setMessages((m) => [
        ...m,
        {
          id: id(),
          role: "assistant",
          content: data.message ?? "Sin respuesta del servidor.",
        },
      ]);
    } catch {
      setMessages((m) => [
        ...m,
        {
          id: id(),
          role: "assistant",
          content:
            "No pudimos conectar. Revisá tu conexión o escribí a **hola@bexo.digital**.",
        },
      ]);
    } finally {
      setPending(false);
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    send(input);
  };

  const ide = variant === "ide";

  return (
    <div
      id="asistente"
      className={
        ide
          ? "flex h-full min-h-0 flex-col bg-[var(--ide-sidebar)]"
          : "flex h-full min-h-0 flex-col bg-[color-mix(in_srgb,var(--color-navy)_96%,black)]"
      }
    >
      <header
        className={
          ide
            ? "shrink-0 border-b border-[var(--ide-border)] px-3 py-2.5"
            : "shrink-0 border-b border-[color-mix(in_srgb,white_9%,transparent)] px-4 py-3 sm:px-5"
        }
      >
        <div className="flex items-start justify-between gap-2">
          <div>
            {ide ? (
              <>
                <div className="flex items-center gap-2">
                  <span className="font-ide-mono text-[11px] font-medium text-[#cccccc]">
                    Composer
                  </span>
                  <span className="rounded border border-[var(--ide-border)] bg-[#37373d] px-1.5 py-px font-ide-mono text-[9px] uppercase tracking-wide text-[#aeafad]">
                    Bexo
                  </span>
                </div>
                <p className="mt-1.5 font-ide-mono text-[11px] leading-snug text-[#969696]">
                  Plan, Build, / for commands · Consultas sobre líneas y proceso. Mail:{" "}
                  <a
                    href="mailto:hola@bexo.digital"
                    className="text-[#4fc1ff] hover:underline"
                  >
                    hola@bexo.digital
                  </a>
                </p>
              </>
            ) : (
              <>
                <p className="font-display text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[color-mix(in_srgb,var(--color-lime)_82%,transparent)]">
                  Asistente con IA
                </p>
                <h2 className="font-display text-base font-bold tracking-tight text-white">
                  Bexo
                </h2>
                <p className="mt-0.5 text-[0.7rem] leading-snug text-[color-mix(in_srgb,white_48%,transparent)]">
                  Consultas sobre servicios y productos. Para propuestas formales:
                  mail al equipo.
                </p>
              </>
            )}
          </div>
          <span
            className={
              ide
                ? "shrink-0 rounded px-1.5 py-0.5 font-ide-mono text-[9px] font-medium uppercase tracking-wider text-[#6a9955]"
                : "shrink-0 rounded-md border border-[color-mix(in_srgb,white_12%,transparent)] bg-[color-mix(in_srgb,white_5%,transparent)] px-2 py-1 text-[0.58rem] font-semibold uppercase tracking-wider text-[color-mix(in_srgb,white_46%,transparent)]"
            }
          >
            {ide ? "// live" : "En vivo"}
          </span>
        </div>
        {usedFallback === true ? (
          <p
            className={
              ide
                ? "mt-2 font-ide-mono text-[10px] leading-snug text-[#858585]"
                : "mt-2 text-[0.62rem] leading-snug text-[color-mix(in_srgb,white_40%,transparent)]"
            }
          >
            Modo orientativo sin modelo cloud. Configurá{" "}
            <code
              className={
                ide
                  ? "rounded bg-[#1e1e1e] px-1 py-px text-[10px] text-[#ce9178]"
                  : "rounded bg-black/30 px-1 py-px text-[0.58rem]"
              }
            >
              OPENAI_API_KEY
            </code>{" "}
            para respuestas con IA.
          </p>
        ) : null}
      </header>

      <div
        ref={listRef}
        className={
          ide
            ? "min-h-0 flex-1 space-y-2 overflow-y-auto px-3 py-2"
            : "min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-3 sm:px-5"
        }
        role="log"
        aria-live="polite"
        aria-relevant="additions"
      >
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={
                ide
                  ? `max-w-[94%] rounded-sm border px-2.5 py-2 font-ide-mono text-[12px] leading-relaxed sm:max-w-[90%] ${
                      msg.role === "user"
                        ? "border-[#3c3c3c] bg-[#37373d] text-[#d4d4d4]"
                        : "border-[var(--ide-border)] bg-[#1e1e1e] text-[#cccccc]"
                    }`
                  : `max-w-[92%] rounded-2xl px-3.5 py-2.5 text-[0.8125rem] leading-relaxed sm:max-w-[88%] ${
                      msg.role === "user"
                        ? "bg-[color-mix(in_srgb,var(--color-lime)_22%,transparent)] text-[color-mix(in_srgb,white_92%,transparent)]"
                        : "border border-[color-mix(in_srgb,white_8%,transparent)] bg-[color-mix(in_srgb,black_25%,transparent)] text-[color-mix(in_srgb,white_72%,transparent)]"
                    }`
              }
            >
              {msg.role === "assistant"
                ? formatAssistantText(msg.content, ide)
                : msg.content}
            </div>
          </motion.div>
        ))}
        {pending ? (
          <div className="flex justify-start">
            <div
              className={
                ide
                  ? "rounded-sm border border-[var(--ide-border)] bg-[#1e1e1e] px-2.5 py-2 font-ide-mono text-[12px] italic text-[#858585]"
                  : "rounded-2xl border border-[color-mix(in_srgb,white_8%,transparent)] bg-[color-mix(in_srgb,black_25%,transparent)] px-3.5 py-2.5 text-[0.8125rem] italic text-[color-mix(in_srgb,white_44%,transparent)]"
              }
            >
              Pensando…
            </div>
          </div>
        ) : null}
      </div>

      <div
        className={
          ide
            ? "shrink-0 border-t border-[var(--ide-border)] bg-[var(--ide-sidebar)] px-2.5 pb-2.5 pt-2"
            : "shrink-0 border-t border-[color-mix(in_srgb,white_8%,transparent)] px-3 pb-3 pt-2 sm:px-4"
        }
      >
        <div className={ide ? "mb-1.5 flex flex-wrap gap-1" : "mb-2 flex flex-wrap gap-1.5"}>
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              type="button"
              disabled={pending}
              onClick={() => send(s)}
              className={
                ide
                  ? "rounded border border-[#3c3c3c] bg-[#2d2d30] px-2 py-1 font-ide-mono text-[10px] text-[#cccccc] transition-colors hover:bg-[#37373d] disabled:opacity-50"
                  : "rounded-full border border-[color-mix(in_srgb,white_10%,transparent)] bg-[color-mix(in_srgb,white_4%,transparent)] px-2.5 py-1 text-[0.65rem] font-medium text-[color-mix(in_srgb,white_58%,transparent)] transition-colors hover:border-[color-mix(in_srgb,white_16%,transparent)] hover:text-[color-mix(in_srgb,white_78%,transparent)] disabled:opacity-50"
              }
            >
              {s}
            </button>
          ))}
        </div>
        <form onSubmit={onSubmit} className="flex gap-1.5">
          <label htmlFor="landing-chat-input" className="sr-only">
            Escribí tu mensaje
          </label>
          <input
            id="landing-chat-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              ide
                ? "Plan, Build, / for commands…"
                : "Preguntá por tu industria o necesidad…"
            }
            disabled={pending}
            className={
              ide
                ? "min-w-0 flex-1 rounded-sm border border-[#3c3c3c] bg-[#3c3c3c] px-2.5 py-2 font-ide-mono text-[12px] text-[#cccccc] placeholder:text-[#6a6a6a] focus:border-[#007fd4] focus:outline-none focus:ring-1 focus:ring-[#007fd4]/40 disabled:opacity-60"
                : "min-w-0 flex-1 rounded-xl border border-[color-mix(in_srgb,white_12%,transparent)] bg-[color-mix(in_srgb,black_22%,transparent)] px-3.5 py-2.5 text-[0.8125rem] text-[color-mix(in_srgb,white_88%,transparent)] placeholder:text-[color-mix(in_srgb,white_36%,transparent)] focus:border-[color-mix(in_srgb,var(--color-lime)_40%,transparent)] focus:outline-none focus:ring-1 focus:ring-[color-mix(in_srgb,var(--color-lime)_35%,transparent)] disabled:opacity-60"
            }
            autoComplete="off"
          />
          <button
            type="submit"
            disabled={pending || !input.trim()}
            className={
              ide
                ? "shrink-0 rounded-sm bg-[#0e639c] px-3 py-2 font-ide-mono text-[11px] font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-45"
                : "shrink-0 rounded-xl bg-[var(--color-lime)] px-4 py-2.5 text-xs font-semibold text-[var(--color-navy)] shadow-[0_6px_20px_color-mix(in_srgb,var(--color-lime)_20%,transparent)] transition-opacity hover:opacity-90 disabled:opacity-45"
            }
          >
            {ide ? "Run" : "Enviar"}
          </button>
        </form>
        <p
          className={
            ide
              ? "mt-1.5 text-center font-ide-mono text-[10px] text-[#858585]"
              : "mt-2 text-center text-[0.62rem] text-[color-mix(in_srgb,white_38%,transparent)]"
          }
        >
          ¿Cierre comercial?{" "}
          <Link
            href="#contacto"
            className={
              ide
                ? "text-[#4fc1ff] underline-offset-2 hover:underline"
                : "font-semibold text-[color-mix(in_srgb,var(--color-lime)_85%,transparent)] underline-offset-2 hover:underline"
            }
          >
            #contacto
          </Link>
        </p>
      </div>
    </div>
  );
}
