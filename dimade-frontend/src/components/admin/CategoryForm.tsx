import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { catalogApi } from "@/lib/api";

interface Category {
  id?: number;
  name: string;
  description: string;
  slug: string;
}

interface CategoryFormProps {
  category?: Category | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

export default function CategoryForm({ category, isOpen, onClose, onSave }: CategoryFormProps) {
  const [formData, setFormData] = useState<Category>({
    name: "",
    description: "",
    slug: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (category) {
      setFormData(category);
    } else {
      setFormData({ name: "", description: "", slug: "" });
    }
  }, [category, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
        const newData = { ...prev, [name]: value };
        // Generar slug automáticamente si se cambia el nombre y estamos creando
        if (name === "name" && !category) {
            newData.slug = value.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
        }
        return newData;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (category?.id) {
        await catalogApi.updateCategory(category.id, formData);
        toast.success("Categoría actualizada");
      } else {
        await catalogApi.createCategory(formData);
        toast.success("Categoría creada con éxito");
      }
      onSave();
      onClose();
    } catch (error) {
      console.error("Error saving category:", error);
      toast.error("Hubo un error al guardar la categoría. Revisa la consola.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{category?.id ? 'Editar Categoría' : 'Nueva Categoría'}</DialogTitle>
            <DialogDescription>
              Completa la información de la categoría. El slug se genera automáticamente al escribir el nombre.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right text-xs uppercase font-bold text-muted-foreground">
                Nombre
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="col-span-3"
                required
                autoComplete="off"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="slug" className="text-right text-xs uppercase font-bold text-muted-foreground">
                Slug
              </Label>
              <Input
                id="slug"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                className="col-span-3 bg-muted font-mono text-[11px]"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right text-xs uppercase font-bold text-muted-foreground">
                Descripción
              </Label>
              <Input
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
