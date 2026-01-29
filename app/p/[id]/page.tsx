import { notFound } from "next/navigation";
import { getPasteAndConsumeView } from "@/services/paste.service"
import { getNowMs } from "@/lib/time";

type PageProps = {
  params: {
    id: string;
  };
};

export default async function PastePage({ params }: PageProps) {
  const nowMs = getNowMs(); 
  const {id} = await params;
  const result = await getPasteAndConsumeView(id, nowMs);

  if (!result) {
    notFound();
  }

  return (
    <main style={{ padding: "2rem", fontFamily: "monospace", whiteSpace: "pre-wrap" }}>
      <h1>Shared Paste</h1>
      <pre>{result.content}</pre>

      <hr />

      <div style={{ fontSize: "0.9rem", color: "#555" }}>
        {result.remainingViews !== null && (
          <p>Remaining views: {result.remainingViews}</p>
        )}

        {result.expiresAt && (
          <p>Expires at: {result.expiresAt.toISOString()}</p>
        )}
      </div>
    </main>
  );
}
