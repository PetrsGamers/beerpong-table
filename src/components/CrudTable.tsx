// components/CrudTable.tsx
"use client";

import { useTransition } from "react";

function formatValue(value: unknown): React.ReactNode {
  if (value instanceof Date) {
    return value.toLocaleString(); // or .toISOString(), etc.
  }
  if (typeof value === "object" && value !== null) {
    return JSON.stringify(value); // fallback for objects
  }
  return value as React.ReactNode;
}

export function CrudTable<T extends { id: string | number }>({
  data,
  columns,
  onDelete,
}: {
  data: T[];
  columns: { key: keyof T; label: string }[];
  onDelete: (id: string | number) => Promise<void>;
}) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = (id: string | number) => {
    startTransition(() => onDelete(id));
  };

  return (
    <table className="w-full border mt-4">
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col.key as string} className="p-2 border-b text-left">
              {col.label}
            </th>
          ))}
          <th className="p-2 border-b">Actions</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <tr key={item.id}>
            {columns.map((col) => (
              <td key={col.key as string} className="p-2 border-b">
                {formatValue(item[col.key])}
              </td>
            ))}
            <td className="p-2 border-b space-x-2">
              <button
                onClick={() => handleDelete(item.id)}
                className="text-red-600"
                disabled={isPending}
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
