import { notFound } from "next/navigation";
import { getPasteAndConsumeView } from "@/services/paste.service";
import { getNowMs } from "@/lib/time";

type PageProps = {
  params: {
    id: string;
  };
};

export default async function PastePage({ params }: PageProps) {
  const nowMs = getNowMs();
  const { id } = await params;
  const result = await getPasteAndConsumeView(id, nowMs);

  if (!result) {
    notFound();
  }

  return (
    <main
      style={{
        padding: "2rem",
        fontFamily: "monospace",
        whiteSpace: "pre-wrap",
      }}
    >
      <h1 className="text-3xl text-gray-700 mb-5">Shared Paste</h1>
      <h1 className="text-xl text-gray-600 mb-5">
        Content: 
      </h1>
      <pre className="text-xl text-gray-500 tracking-wide mb-5">{result.content}</pre>

      <hr />

      <div style={{ fontSize: "0.9rem", color: "#555" }}>
        {result.remainingViews !== null && (
          <p>Remaining views: {result.remainingViews}</p>
        )}

        {result.expiresAt && (
          <p>
            Expires on:{" "}
            {new Date(result.expiresAt).toLocaleString("en-IN", {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </p>
        )}
      </div>
    </main>
  );
}
