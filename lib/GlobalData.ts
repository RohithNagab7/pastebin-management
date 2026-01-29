import { InputFieldDataProps } from "./GlobalUtils";

export const InputFields: InputFieldDataProps[] = [
  { label: "Paste Content", name: "content", textarea: true, placeholder: "Enter text..." },
  { label: "TTL (seconds)", name: "ttl_seconds", placeholder: "Optional" },
  { label: "Max Views", name: "max_views", placeholder: "Optional" },
];