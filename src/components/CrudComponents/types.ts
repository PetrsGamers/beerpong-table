export interface CrudTableColumn<T> {
  key: keyof T;
  label: string;
  required: boolean;
  type: "string" | "number" | "date" | "enum";
  options?: string[]; // Only for enum type
}
