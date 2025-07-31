import { CrudTable } from "./CrudTable";

export type CrudPageProps<T extends { id: string | number }> = {
  title: string;
  fetchData: () => Promise<T[]>;
  columns: { key: keyof T; label: string }[];
  createAction?: () => Promise<void>;
  editAction?: (item: T) => Promise<void>;
  deleteAction: (id: string | number) => Promise<void>;
};

export async function CrudPage<T extends { id: string | number }>({
  title,
  fetchData,
  columns,
  createAction,
  editAction,
  deleteAction,
}: CrudPageProps<T>) {
  const data = await fetchData();

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">{title}</h1>
      <CrudTable
        data={data}
        columns={columns}
        onAdd={createAction}
        onEdit={editAction}
        onDelete={deleteAction}
      />
    </div>
  );
}
