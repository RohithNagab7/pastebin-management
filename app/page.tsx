"use client";

import { useState } from "react";
import FormInput from "@/components/FormInput";
import { InputFields } from "@/lib/GlobalData";
import { HomeStateTypes, uiPasteSchema } from "@/lib/GlobalUtils";
import { createPaste } from "./uiServices/pasteService";

type FieldName = keyof HomeStateTypes["formState"];

const initialState: HomeStateTypes = {
  formState: {
    content: "",
    ttl_seconds: "",
    max_views: "",
  },
  error: null,
  link: null,
  loading: false,
};

function Home() {
  const [state, setState] = useState<HomeStateTypes>(initialState);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;

    setState((prev) => ({
      ...prev,
      formState: {
        ...prev.formState,
        [name as FieldName]: value,
      },
    }));
  }

  async function handleSubmit() {
    setState((prev) => ({ ...prev, error: null, loading: true }));

    const parsed = uiPasteSchema.safeParse(state.formState);
    if (!parsed.success) {
      setState((prev) => ({
        ...prev,
        error: "Invalid input",
        loading: false,
      }));
      return;
    }

    try {
      const payload = {
        content: state.formState.content,
        ...(state.formState.ttl_seconds && {
          ttl_seconds: Number(state.formState.ttl_seconds),
        }),
        ...(state.formState.max_views && {
          max_views: Number(state.formState.max_views),
        }),
      };

      const data = await createPaste(payload);

      setState((prev) => ({
        ...prev,
        link: data.url,
        loading: false,
        formState: {
          content: "",
          ttl_seconds: "",
          max_views: "",
        }
      }));
    } catch (err: unknown) {
  const message =
    err instanceof Error ? err.message : "Failed to create paste";

  setState((prev) => ({
    ...prev,
    error: message,
    loading: false,
  }));
}
  }

  return (
    <main className="p-12 bg-gray-900 text-gray-100 w-screen min-h-screen">
      <div className="p-6 rounded shadow w-full max-w-xl bg-gray-950">
        <h1 className="text-xl font-semibold mb-4">Create Paste</h1>

        {InputFields.map((f) => (
          <FormInput
            key={f.name}
            {...f}
            value={state.formState[f.name as FieldName]}
            onChange={handleChange}
          />
        ))}

        {state.error && (
          <p className="text-red-500 text-sm mb-2">{state.error}</p>
        )}

        <button
          onClick={handleSubmit}
          disabled={state.loading}
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 disabled:opacity-50"
        >
          {state.loading ? "Creating..." : "Create Paste"}
        </button>

        {state.link && (
          <div className="mt-4">
            <p className="text-sm">Shareable Link:</p>
            <a
              href={state.link}
              className="text-gray-400 underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {state.link}
            </a>
          </div>
        )}
      </div>
    </main>
  );
}

export default Home;
