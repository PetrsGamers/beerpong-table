"use client";

import type React from "react";

import { Loader2 } from "lucide-react";
import { AlertDialogFooter } from "../ui/alert-dialog";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import type { CrudTableColumn } from "./types";
import { useState, useEffect, useRef } from "react";

type Props<T> = {
  data: T;
  columns: CrudTableColumn<T>[];
  title: string;
  description?: string;
  onConfirm: (data: T) => void;
  icon: React.ReactNode;
  disabled?: boolean;
  isPending?: boolean;
};

export function CrudButtonWithDialog<T extends { id: string | number }>({
  data,
  columns,
  title,
  description,
  onConfirm,
  icon,
  disabled = false,
  isPending = false,
}: Props<T>) {
  const [formData, setFormData] = useState<T>(data);
  const [isOpen, setIsOpen] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  const handleChange = (key: keyof T, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    onConfirm(formData);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setFormData(data); // Reset form data
    setIsOpen(false);
  };

  const renderValue = (value: any) => {
    if (typeof value === "string" || typeof value === "number") {
      return value;
    }
    if (value instanceof Date) {
      return value.toLocaleString();
    }
    return "";
  };

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        handleSubmit();
      } else if (e.key === "Escape") {
        e.preventDefault();
        handleCancel();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, formData]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" disabled={disabled}>
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : icon}
        </Button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-[425px] bg-black text-white"
        ref={dialogRef}
      >
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {Object.entries(formData).map(([key, value]) => (
              <div key={key} className="grid gap-2">
                <Label htmlFor={key}>{key}</Label>
                <Input
                  id={key}
                  name={key}
                  value={renderValue(value)}
                  onChange={(e) => handleChange(key as keyof T, e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit();
                    }
                  }}
                  placeholder={`Enter ${key}`}
                  disabled={
                    isPending ||
                    key === "id" ||
                    columns.some((col) => col.key === key && !col.required)
                  }
                />
              </div>
            ))}
          </div>
          <AlertDialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                "Save changes"
              )}
            </Button>
          </AlertDialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
