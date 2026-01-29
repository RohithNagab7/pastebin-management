import { z } from "zod";

export const uiPasteSchema = z.object({
  content: z.string().min(1, "Content is required"),
  ttl_seconds: z.string().optional(),
  max_views: z.string().optional(),
});

export interface FormInputProps {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  textarea?: boolean;
};

export interface InputFieldDataProps {
  label:string;
  name: string;
  placeholder: string;
  textarea?: boolean;
}

export interface FormState {
  content: string;
  ttl_minutes: string;
  max_views: string;
};

export interface HomeStateTypes {
  formState: FormState;
  error: string | null;
  link: string | null;
  loading: boolean;
};
