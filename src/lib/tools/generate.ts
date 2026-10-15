/**
 * Server-side entry point for the AI tools (used by src/app/api/tools/[slug]/route.ts).
 *
 * LLM seam: everything goes through a `ToolEngine`. Today `templateEngine` fills templates from the
 * submitted inputs (see ./templates.ts). To plug in a real model, write an engine that sends
 * `buildPrompt(tool, input)` to the LLM, parses the JSON reply into `ToolResult` (validate it with
 * `isToolResult`), and assign it to `activeEngine` below. Nothing else needs to change.
 */
import type { AiTool, ToolResult } from "@/lib/data/tools";
import { renderTemplate, type ToolInput } from "./templates";

export type { ToolInput };
export type ToolEngine = (tool: AiTool, input: ToolInput) => Promise<ToolResult>;

/** Artificial latency so the loading state is visible (a real LLM call takes far longer). */
const TEMPLATE_DELAY_MS = 1200;

export const templateEngine: ToolEngine = async (tool, input) => {
  await new Promise((resolve) => setTimeout(resolve, TEMPLATE_DELAY_MS));
  return { groups: renderTemplate(tool.slug, input) };
};

const activeEngine: ToolEngine = templateEngine;

export function generateToolResult(tool: AiTool, input: ToolInput): Promise<ToolResult> {
  return activeEngine(tool, input);
}

/**
 * Validates a request body against the tool's fields. Values are trimmed and capped at maxLength;
 * unknown keys are dropped. Returns the first missing required field as an error message.
 */
export function validateToolInput(tool: AiTool, body: unknown): { input: ToolInput } | { error: string } {
  const raw = body && typeof body === "object" && !Array.isArray(body) ? (body as Record<string, unknown>) : {};
  const input: ToolInput = {};
  for (const field of tool.fields) {
    const value = typeof raw[field.name] === "string" ? (raw[field.name] as string).trim().slice(0, field.maxLength) : "";
    if (field.required && !value) return { error: `Please provide: ${field.label}.` };
    if (value) input[field.name] = value;
  }
  return { input };
}

/** Prompt for a future LLM engine. The model must reply with JSON matching ToolResult. */
export function buildPrompt(tool: AiTool, input: ToolInput): string {
  const details = tool.fields
    .filter((f) => input[f.name])
    .map((f) => `- ${f.label}: ${input[f.name]}`)
    .join("\n");
  return [
    `You are a local SEO expert powering the free "${tool.name}" tool.`,
    `Tool purpose: ${tool.description}`,
    `User details:\n${details}`,
    "Reply with JSON only, shaped as {\"groups\":[{\"title\":string,\"items\":[{\"text\":string,\"note\"?:string}]}]}.",
    "Use 3-6 groups of 3-7 concise, specific, actionable items tailored to the business and location.",
  ].join("\n\n");
}

export function isToolResult(value: unknown): value is ToolResult {
  if (!value || typeof value !== "object") return false;
  const groups = (value as { groups?: unknown }).groups;
  return (
    Array.isArray(groups) &&
    groups.every(
      (g) =>
        g &&
        typeof g.title === "string" &&
        Array.isArray(g.items) &&
        g.items.every((i: unknown) => {
          const it = i as { text?: unknown; note?: unknown };
          return typeof it?.text === "string" && (it.note === undefined || typeof it.note === "string");
        }),
    )
  );
}
