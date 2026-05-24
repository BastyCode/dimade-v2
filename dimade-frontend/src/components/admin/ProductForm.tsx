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
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { toast } from "sonner";
import { catalogApi } from "@/lib/api";

interface Category {
  id: number;
  name: string;
}

interface Product {
  id?: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  sku: string;
  imageUrl?: string;
  category?: { id: number; name?: string } | null;
}

interface ProductFormProps {
  product?: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

export default function ProductForm({ product, isOpen, onClose, onSave }: ProductFormProps) {
  const [formData, setFormData] = useState<Partial<Product>>({
    name: "",
    description: "",
    price: 0,
    stock: 0,
    sku: "",
    category: null
  });
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await catalogApi.getCategories();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories for form:", error);
      }
    };
    
    if (isOpen) {
      fetchCategories();
      if (product) {
        setFormData({
          ...product,
          category: product.category ? { id: product.category.id } : null
        });
      } else {
        setFormData({ name: "", description: "", price: 0, stock: 0, sku: "", category: null });
      }
    }
  }, [product, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "price" || name === "stock" ? Number(value) : value
    }));
  };

  const handleCategoryChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      category: { id: Number(value) }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (product?.id) {
        await catalogApi.updateProduct(product.id, formData);
        toast.success("Producto actualizado");
      } else {
        await catalogApi.createProduct(formData);
        toast.success("Producto creado con éxito");
      }
      onSave();
      onClose();
    } catch (error) {
      toast.error("Error al guardar el producto");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{product?.id ? 'Editar Producto' : 'Nuevo Producto'}</DialogTitle>
            <DialogDescription>
              Introduce los detalles técnicos y de inventario del producto.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="sku" className="text-right text-xs uppercase font-bold text-muted-foreground">SKU</Label>
              <Input id="sku" name="sku" value={formData.sku} onChange={handleChange} className="col-span-3 font-mono" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right text-xs uppercase font-bold text-muted-foreground">Nombre</Label>
              <Input id="name" name="name" value={formData.name} onChange={handleChange} className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right text-xs uppercase font-bold text-muted-foreground">Categoría</Label>
              <div className="col-span-3">
                <Select 
                  onValueChange={handleCategoryChange} 
                  value={formData.category?.id?.toString() || ""}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat.id} value={cat.id.toString()}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="grid grid-cols-2 items-center gap-4">
                    <Label htmlFor="price" className="text-right text-xs uppercase font-bold text-muted-foreground">Precio</Label>
                    <Input id="price" name="price" type="number" step="0.01" value={formData.price} onChange={handleChange} required />
                </div>
                <div className="grid grid-cols-2 items-center gap-4">
                    <Label htmlFor="stock" className="text-right text-xs uppercase font-bold text-muted-foreground">Stock</Label>
                    <Input id="stock" name="stock" type="number" value={formData.stock} onChange={handleChange} required />
                </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right text-xs uppercase font-bold text-muted-foreground">Descripción</Label>
              <Input id="description" name="description" value={formData.description} onChange={handleChange} className="col-span-3" />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Guardando...' : 'Guardar Producto'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
