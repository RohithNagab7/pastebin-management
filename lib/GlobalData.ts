import { InputFieldDataProps } from "./GlobalUtils";

export const InputFields: InputFieldDataProps[] = [
  { label: "Paste Content", name: "content", textarea: true, placeholder: "Enter text..." },
  { label: "TTL (minutes)", name: "ttl_minutes", placeholder: "Optional" },
  { label: "Max Views", name: "max_views", placeholder: "Optional" },
];