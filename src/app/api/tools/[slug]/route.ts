import { getTool } from "@/lib/data/tools";
import { generateToolResult, validateToolInput } from "@/lib/tools/generate";

export async function POST(request: Request, ctx: RouteContext<"/api/tools/[slug]">) {
  const { slug } = await ctx.params;
  const tool = getTool(slug);
  if (!tool || tool.type !== "ai") return Response.json({ error: "Unknown tool." }, { status: 404 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const checked = validateToolInput(tool, body);
  if ("error" in checked) return Response.json({ error: checked.error }, { status: 400 });

  try {
    const data = await generateToolResult(tool, checked.input);
    return Response.json({ data });
  } catch {
    return Response.json({ error: "Something went wrong." }, { status: 500 });
  }
}

export function GET() {
  return Response.json({ error: "Method not allowed." }, { status: 405, headers: { Allow: "POST" } });
}
