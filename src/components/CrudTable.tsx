"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash2, Edit, Plus, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { CrudButtonWithConfirm } from "./CrudButtonWithConfirm";

export interface CrudTableColumn<T> {
  key: keyof T;
  label: string;
}

interface CrudTableProps<T> {
  data: T[];
  columns: CrudTableColumn<T>[];
  onEdit?: (item: T) => Promise<void>;
  onDelete?: (id: string | number) => Promise<void>;
  onAdd?: () => Promise<void>;
  isLoading?: boolean;
}

export function CrudTable<T extends { id: string | number }>({
  data,
  columns,
  onEdit,
  onDelete,
  onAdd,
  isLoading = false,
}: CrudTableProps<T>) {
  const [isPending, startTransition] = useTransition();
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const { toast } = useToast();

  const handleDelete = async (id: number) => {
    if (!onDelete) return;

    setDeletingId(id);
    startTransition(async () => {
      try {
        await onDelete(id);
        toast({
          title: "Success",
          description: "Item deleted successfully",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete item",
          variant: "destructive",
        });
      } finally {
        setDeletingId(null);
      }
    });
  };

  const handleEdit = async (item: T) => {
    if (!onEdit) return;

    startTransition(async () => {
      try {
        await onEdit(item);
        toast({
          title: "Success",
          description: "Item updated successfully",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to update item",
          variant: "destructive",
        });
      }
    });
  };

  const renderCellValue = (column: CrudTableColumn<T>, item: T) => {
    const value = item[column.key];

    // TODO: handle custom rendering for specific columns
    // if (column.render) {
    //   return column.render(value, item);
    // }

    if (value instanceof Date) {
      return value.toLocaleDateString();
    }

    return String(value);
  };

  return (
    <Card className="bg-background text-foreground">
      <CardHeader className="flex flex-row items-center justify-between">
        {onAdd && (
          <Button
            onClick={() => startTransition(() => onAdd())}
            disabled={isPending}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <Table className="hover:bg-transparent">
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                {columns.map((column) => (
                  <TableHead key={String(column.key)}>{column.label}</TableHead>
                ))}
                {(onEdit || onDelete) && <TableHead>Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length + 1}
                    className="text-center py-8 text-muted-foreground"
                  >
                    No data available
                  </TableCell>
                </TableRow>
              ) : (
                data.map((item) => (
                  <TableRow key={item.id} className="hover:bg-transparent">
                    {columns.map((column) => (
                      <TableCell key={String(column.key)}>
                        {renderCellValue(column, item)}
                      </TableCell>
                    ))}
                    {(onEdit || onDelete) && (
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {onEdit && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(item)}
                              disabled={isPending}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          )}
                          {onDelete && (
                            <CrudButtonWithConfirm
                              icon={<Trash2 className="h-4 w-4" />}
                              onConfirm={() => handleDelete(item.id)}
                              disabled={isPending || deletingId === item.id}
                            />
                          )}
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
