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
import { Trash2, Edit, Plus, Loader2, Check, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { CrudButtonWithConfirm } from "./CrudButtonWithConfirm";
import { CrudTableColumn } from "./types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Input } from "../ui/input";
import { CrudButtonWithDialog } from "./CrudButtonWithDialog";

interface CrudTableProps<T> {
  data: T[];
  columns: CrudTableColumn<T>[];
  onEdit?: (item: T) => Promise<void>;
  onDelete?: (id: number) => Promise<void>;
  onAdd?: (item: Partial<T>) => Promise<void>;
  isLoading?: boolean;
}

export function CrudTable<T extends { id: number }>({
  data,
  columns,
  onEdit,
  onDelete,
  onAdd,
  isLoading = false,
}: CrudTableProps<T>) {
  const [isPending, startTransition] = useTransition();
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [addFormData, setAddFormData] = useState<Record<string, any>>({});

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

  const handleAddSubmit = async () => {
    if (!onAdd) return;

    // Basic validation - check if required fields are filled
    const hasEmptyFields = columns
      .filter((column) => column.required)
      .some((column) => {
        const value = addFormData[String(column.key)];
        return !value || value === "";
      });

    if (hasEmptyFields) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    startTransition(async () => {
      try {
        console.log("Adding item with data:", addFormData);
        await onAdd(addFormData as Partial<T>);
        toast({
          title: "Success",
          description: "Item added successfully",
        });
        setAddFormData({});
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to add item",
          variant: "destructive",
        });
      }
    });
  };

  const handleInputChange = (key: string, value: any) => {
    setAddFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddSubmit();
    }
  };

  const renderAddInput = (column: CrudTableColumn<T>) => {
    const key = String(column.key);
    const value = addFormData[key] || "";

    if (column.type === "enum" && column.options) {
      return (
        <Select
          value={value}
          onValueChange={(val) => handleInputChange(key, val)}
        >
          <SelectTrigger className="h-8">
            <SelectValue placeholder={`Select ${column.label}`} />
          </SelectTrigger>
          <SelectContent>
            {column.options.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }

    if (column.type === "number") {
      return (
        <Input
          type="number"
          value={value}
          onChange={(e) =>
            handleInputChange(key, Number.parseInt(e.target.value) || "")
          }
          onKeyDown={handleKeyPress}
          placeholder={column.label}
          className="h-8"
        />
      );
    }

    if (column.type === "date") {
      return (
        <Input
          type="date"
          value={value}
          onChange={(e) => handleInputChange(key, e.target.value)}
          onKeyDown={handleKeyPress}
          className="h-8"
        />
      );
    }

    // Default to text input
    return (
      <Input
        type="text"
        value={value}
        onChange={(e) => handleInputChange(key, e.target.value)}
        onKeyDown={handleKeyPress}
        placeholder={column.label}
        className="h-8"
      />
    );
  };

  return (
    <Card className="bg-background text-foreground">
      <CardHeader className="flex flex-row items-center justify-between"></CardHeader>
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
              {/* Add Form Row */}
              {onAdd && (
                <TableRow className="hover:bg-transparent">
                  {columns.map((column) => (
                    <TableCell key={String(column.key)}>
                      <div className="w-[20rem]">
                        {column.required ? renderAddInput(column) : null}
                      </div>
                    </TableCell>
                  ))}
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAddSubmit()}
                        disabled={isPending}
                        className="h-8 w-8 p-0 bg-transparent"
                      >
                        {isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Plus className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
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
                            <CrudButtonWithDialog
                              data={item}
                              columns={columns}
                              title="Edit item"
                              description="Make changes to this item."
                              onConfirm={async (data) => {
                                await handleEdit({ ...item, ...data });
                              }}
                              icon={<Edit className="h-4 w-4" />}
                              disabled={isPending || deletingId === item.id}
                            />
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
