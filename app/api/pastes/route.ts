import { NextResponse } from "next/server";
import { createPasteSchema } from "@/validators/paste.schema";
import { createPaste } from "@/services/paste.service";
import { getNowMs } from "@/lib/time";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = createPasteSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const { content, ttl_minutes, max_views } = parsed.data;
    const nowMs = getNowMs(req);

    const paste = await createPaste(content, max_views, ttl_minutes,  nowMs);

    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL || req.headers.get("origin");

    return NextResponse.json({
      id: paste.id,
      url: `${baseUrl}/p/${paste.id}`,
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
