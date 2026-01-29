import { FormInputProps } from "@/lib/GlobalUtils";

export default function FormInput({
  label,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  textarea = false,
}: FormInputProps) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-1">{label}</label>
      {textarea ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full border rounded p-2 focus:outline-none focus:ring"
          rows={6}
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full border rounded p-2 focus:outline-none focus:ring"
        />
      )}
    </div>
  );
}
