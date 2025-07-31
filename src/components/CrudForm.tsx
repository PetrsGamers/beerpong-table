// components/CrudForm.tsx
"use client";

import { useState, useTransition } from "react";

export function CrudForm<T extends { id?: string }>({
  initialValues,
  fields,
  onSubmit,
  onCancel,
  isEdit,
}: {
  initialValues: Partial<T>;
  fields: { key: keyof T; label: string }[];
  onSubmit: (values: Partial<T>) => Promise<void>;
  onCancel: () => void;
  isEdit?: boolean;
}) {
  const [formData, setFormData] = useState<Partial<T>>(initialValues);
  const [isPending, startTransition] = useTransition();

  const handleChange = (key: keyof T, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    startTransition(() => {
      onSubmit(formData);
    });
  };

  return (
    <div className="border p-4 rounded bg-gray-50">
      <h2 className="text-xl font-semibold mb-2">
        {isEdit ? "Edit" : "Create"} Item
      </h2>
      <div className="space-y-3 mb-4">
        {fields.map(({ key, label }) => (
          <div key={key as string}>
            <label className="block font-medium">{label}</label>
            <input
              className="border p-1 w-full"
              value={(formData[key] as string) || ""}
              onChange={(e) => handleChange(key, e.target.value)}
            />
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <button
          onClick={handleSubmit}
          disabled={isPending}
          className="bg-blue-500 text-white px-3 py-1 rounded"
        >
          {isEdit ? "Update" : "Create"}
        </button>
        <button onClick={onCancel} className="text-gray-600 underline">
          Cancel
        </button>
      </div>
    </div>
  );
}
