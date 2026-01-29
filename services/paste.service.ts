import { generatePasteId } from "@/lib/id";
import { prisma } from "@/lib/prisma";
import { computeExpiry } from "@/lib/time";

export async function createPaste(content: string, maxViews: number | undefined, ttlSeconds: undefined | number, nowMs: number) {
  const id = generatePasteId();

  const expiresAt = ttlSeconds
    ? computeExpiry(ttlSeconds, nowMs)
    : null;

  const paste = await prisma.paste.create({
    data: {
      id,
      content,
      expiresAt,
      maxViews,
      viewCount: 0,
    },
  });

  return paste;
}

export async function getPasteAndConsumeView(
  id: string,
  nowMs: number
) {
  return await prisma.$transaction(async (tx) => {
    const paste = await tx.paste.findUnique({ where: { id } });

    if (!paste) return null;

    if (paste.expiresAt && paste.expiresAt.getTime() <= nowMs) {
      return null;
    }

    if (paste.maxViews !== null && paste.viewCount >= paste.maxViews) {
      return null;
    }

    const updated = await tx.paste.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    });

    const remainingViews =
      updated.maxViews !== null
        ? Math.max(updated.maxViews - updated.viewCount, 0)
        : null;

    return {
      content: updated.content,
      remainingViews,
      expiresAt: updated.expiresAt,
    };
  });
}