export interface CrudTableColumn<T> {
  key: keyof T;
  label: string;
  required: boolean;
  type: "string" | "number" | "date" | "enum";
  options?: string[]; // Only for enum type
  link?: string; // Optional link for navigation, in case of dynamic routes use `/path/[id]`
}
