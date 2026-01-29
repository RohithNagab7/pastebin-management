import { NextResponse } from "next/server";
import { getPasteAndConsumeView } from "@/services/paste.service";
import { getNowMs } from "@/lib/time";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }   // <-- Promise here
) {
  const { id } = await params;  
  const nowMs = getNowMs(req);
  const result = await getPasteAndConsumeView(id, nowMs);

  if (!result) {
    return NextResponse.json(
      { error: "Paste not found or unavailable" },
      { status: 404 },
    );
  }

  return NextResponse.json({
    content: result.content,
    remaining_views: result.remainingViews,
    expires_at: result.expiresAt ? result.expiresAt.toISOString() : null,
  });
}
