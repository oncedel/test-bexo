import { NextResponse } from "next/server";

export const runtime = "nodejs";

const BEXO_SYSTEM = `Sos el asistente comercial de Bexo (bexo.digital), estudio de producto digital e ingeniería en español (Argentina / Latam).

Qué es Bexo: equipos que diseñan y construyen software interno B2B con criterio de producto — UX/UI, backend, datos, integraciones e IA aplicada cuando suma.

Líneas de producto en producción (mencionalas si encajan):
- ObraGo: constructoras — costos, obra, compras, proveedores, permisos por obra.
- MisCanchas: clubes/deportes — turnos, membresías, cobros.
- FastFood: gastronomía — comanda, cocina, salón, picos de servicio.
- AgroCombus: agronegocio — campo, logística, trazabilidad.
- NexoCam: video e IA — alertas operativas, registro auditable.

Proceso: diagnóstico → diseño/arquitectura → implementación incremental → evolución con métricas. Entregan código y documentación; integraciones con ERP/APIs con criterio.

Contacto comercial: hola@bexo.digital — ofrecé coordinar conversación técnica cuando el usuario muestra intención seria.

Reglas:
- Sé breve (2–4 párrafos cortos máx). Tono profesional, claro, sin humo.
- Si preguntan precios o plazos sin contexto, pedí volumen, integraciones y alcance — no inventes cifras.
- No prometas resultados legales ni garantías imposibles.
- Si no sabés algo de un cliente específico, decí que en una llamada lo afinan.`;

const MAX_BODY = 12_000;
const MAX_MESSAGES = 24;

type Msg = { role: "user" | "assistant" | "system"; content: string };

function fallbackReply(userText: string): string {
  const t = userText.toLowerCase();

  if (/hola|buen(d|o)s|hey|hi\b/.test(t)) {
    return "Hola. Soy el asistente de Bexo: puedo contarte qué hacemos, cómo trabajamos y qué líneas de producto encajan con tu operación. ¿En qué industria estás y qué proceso te está costando más hoy?";
  }
  if (/precio|cu[aá]nto cuesta|honorario|presupuesto|cotiz/.test(t)) {
    return "Los números dependen de alcance, integraciones y criticidad. Lo habitual es partir de un diagnóstico corto y un plan por fases con entregables claros. Si nos contás volumen de transacciones, sistemas que ya usan y plazo deseado, en **hola@bexo.digital** o en una llamada te devolvemos supuestos explícitos — sin presupuesto genérico.";
  }
  if (/obra|construc/.test(t)) {
    return "Para constructoras trabajamos **ObraGo**: costos vivos por obra, compras, avance y comunicación con proveedores, con permisos por rol y trazabilidad. Si querés profundizar, decime si el dolor está más en margen, compras o reporting para dirección.";
  }
  if (/cancha|club|deporte|gimnasio|turno/.test(t)) {
    return "**MisCanchas** cubre ocupación de superficies, turnos, membresías y cobros con reglas claras — menos fricción para el club y para el socio. ¿Manejan muchos deportes o una sola disciplina principal?";
  }
  if (/restauran|comanda|cocina|gastro|fast food|sal[oó]n/.test(t)) {
    return "**FastFood** alinea comanda, cocina y salón para picos de servicio, con tiempos visibles. Si el problema es errores de pedido, tiempos o stock en vivo, encaja bien una charla técnica.";
  }
  if (/agro|campo|log[ií]stica|cosecha/.test(t)) {
    return "**AgroCombus** se orienta a movimientos y logística con estados auditables (qué salió, cuándo, hacia dónde) e integración con pesaje o terceros cuando aplica.";
  }
  if (/c[aá]mara|video|vigilancia|ia|inteligencia artificial|patente/.test(t)) {
    return "**NexoCam** trata el video como señal operativa: alertas accionables y registro cuando la norma o el riesgo lo piden — con pipeline y retención definidos, no demos sueltos.";
  }
  if (/proceso|c[oó]mo trabaj|metodolog|agile|implement/.test(t)) {
    return "Trabajamos en ciclos cortos con entregas útiles: **diagnóstico** del flujo y riesgos, **diseño y arquitectura** acordados, **implementación** incremental con documentación, y **evolución** según uso e incidentes. Siempre con criterios de “hecho” compartidos.";
  }
  if (/contacto|mail|email|reuni[oó]n|llamad|agendar|hablar/.test(t)) {
    return "Podés escribir a **hola@bexo.digital** o usar el bloque de contacto en la página. Lo más útil para la primera conversación: un flujo que hoy sea doloroso, qué decisión de negocio depende de él, y qué sistemas ya usan (ERP, pagos, identidad).";
  }
  if (/ux|ui|dise[nñ]o|interfaz/.test(t)) {
    return "El diseño en Bexo es **operativo**: flujos críticos primero, sistema de componentes, estados claros y foco en adopción real — menos pantallas ornamentales.";
  }
  if (/integracion|erp|api|sistema/.test(t)) {
    return "Integramos con ERP y APIs priorizando contratos claros, reintentos idempotentes y reconciliación cuando hay dinero de por medio. En discovery mapeamos fuentes de verdad y riesgos.";
  }

  return "Bexo arma **software interno** para equipos que ya facturan: producto + ingeniería con profundidad de dominio en obra, clubes, gastronomía, agro y video/IA. Contame en una frase tu industria y qué proceso querés ordenar; te digo qué línea o enfoque encaja mejor. Para cierre comercial, **hola@bexo.digital**.";
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  if (typeof body !== "object" || body === null || !("messages" in body)) {
    return NextResponse.json({ error: "Falta messages" }, { status: 400 });
  }

  const raw = (body as { messages: unknown }).messages;
  if (!Array.isArray(raw)) {
    return NextResponse.json({ error: "messages debe ser un array" }, { status: 400 });
  }

  const messages: Msg[] = [];
  for (const m of raw.slice(-MAX_MESSAGES)) {
    if (
      typeof m === "object" &&
      m !== null &&
      "role" in m &&
      "content" in m &&
      (m as Msg).role !== "system"
    ) {
      const role = (m as Msg).role;
      const content = String((m as Msg).content ?? "").slice(0, 8000);
      if (content.length === 0) continue;
      if (role === "user" || role === "assistant") {
        messages.push({ role, content });
      }
    }
  }

  if (messages.length === 0) {
    return NextResponse.json({ error: "Sin mensajes válidos" }, { status: 400 });
  }

  const payload = JSON.stringify(body);
  if (payload.length > MAX_BODY) {
    return NextResponse.json({ error: "Pedido demasiado grande" }, { status: 413 });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (apiKey) {
    const model = process.env.OPENAI_MODEL ?? "gpt-4o-mini";
    try {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: BEXO_SYSTEM },
            ...messages.map((m) => ({ role: m.role, content: m.content })),
          ],
          max_tokens: 650,
          temperature: 0.55,
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error("OpenAI error", res.status, errText);
        const lastUser = [...messages].reverse().find((m) => m.role === "user");
        return NextResponse.json({
          message: fallbackReply(lastUser?.content ?? ""),
          fallback: true,
        });
      }

      const data = (await res.json()) as {
        choices?: { message?: { content?: string } }[];
      };
      const text = data.choices?.[0]?.message?.content?.trim() ?? "";
      if (!text) {
        const lastUser = [...messages].reverse().find((m) => m.role === "user");
        return NextResponse.json({
          message: fallbackReply(lastUser?.content ?? ""),
          fallback: true,
        });
      }
      return NextResponse.json({ message: text, fallback: false });
    } catch (e) {
      console.error(e);
      const lastUser = [...messages].reverse().find((m) => m.role === "user");
      return NextResponse.json({
        message: fallbackReply(lastUser?.content ?? ""),
        fallback: true,
      });
    }
  }

  const lastUser = [...messages].reverse().find((m) => m.role === "user");
  return NextResponse.json({
    message: fallbackReply(lastUser?.content ?? ""),
    fallback: true,
  });
}
