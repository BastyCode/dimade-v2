import React, { useState, useEffect } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";
import { Plus, Search, LayoutGrid, Edit2, Trash2, RefreshCcw } from "lucide-react";
import CategoryForm from "./CategoryForm";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { catalogApi } from "@/lib/api";

interface Category {
  id: number;
  name: string;
  description: string;
  slug: string;
  productCount?: number;
}

export default function CategoryTable() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null);

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = await catalogApi.getCategories();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("No se pudieron cargar las categorías. ¿Está el backend activo?");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  const handleDelete = async () => {
    if (categoryToDelete) {
      try {
        await catalogApi.deleteCategory(categoryToDelete);
        toast.error("Categoría eliminada");
        fetchCategories();
      } catch (error) {
        toast.error("Error al eliminar la categoría");
      } finally {
        setIsDeleteDialogOpen(false);
        setCategoryToDelete(null);
      }
    }
  };

  const filteredCategories = categories.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCategories.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="w-full space-y-4">
      <Toaster position="top-right" richColors />
      <CategoryForm isOpen={isFormOpen} category={selectedCategory} onClose={() => setIsFormOpen(false)} onSave={fetchCategories} />
      
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>¿Confirmar eliminación?</AlertDialogTitle><AlertDialogDescription>Esta acción no se puede deshacer y podría afectar a los productos asociados.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>No</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">Sí, eliminar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Card className="w-full shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <LayoutGrid className="text-primary" /> Categorías
          </CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={fetchCategories} disabled={loading}>
              <RefreshCcw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
            <Button onClick={() => { setSelectedCategory(null); setIsFormOpen(true); }}>
              <Plus className="w-4 h-4 mr-1" /> Nueva
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Buscar por nombre o slug..." className="pl-9" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px] hidden sm:table-cell">ID</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead className="text-center hidden md:table-cell">Productos</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={4} className="text-center py-10 text-muted-foreground italic">Cargando categorías...</TableCell></TableRow>
                ) : currentItems.length === 0 ? (
                  <TableRow><TableCell colSpan={4} className="text-center py-10 text-muted-foreground">No se encontraron categorías.</TableCell></TableRow>
                ) : currentItems.map((cat) => (
                  <TableRow key={cat.id}>
                    <TableCell className="font-mono text-xs hidden sm:table-cell text-muted-foreground">#{cat.id}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-bold text-sm">{cat.name}</span>
                        <span className="text-[10px] text-muted-foreground sm:hidden">{cat.productCount || 0} productos</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center hidden md:table-cell">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary">
                        {cat.productCount || 0}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                        <div className="flex justify-end gap-0.5">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setSelectedCategory(cat); setIsFormOpen(true); }}><Edit2 className="h-3.5 w-3.5 text-primary" /></Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setCategoryToDelete(cat.id); setIsDeleteDialogOpen(true); }}><Trash2 className="h-3.5 w-3.5 text-destructive" /></Button>
                        </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {totalPages > 1 && (
            <Pagination>
                <PaginationContent>
                    <PaginationItem><PaginationPrevious className="cursor-pointer" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} /></PaginationItem>
                    {[...Array(totalPages)].map((_, i) => (
                        <PaginationItem key={i}><PaginationLink isActive={currentPage === i + 1} onClick={() => setCurrentPage(i + 1)} className="cursor-pointer">{i + 1}</PaginationLink></PaginationItem>
                    ))}
                    <PaginationItem><PaginationNext className="cursor-pointer" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} /></PaginationItem>
                </PaginationContent>
            </Pagination>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
