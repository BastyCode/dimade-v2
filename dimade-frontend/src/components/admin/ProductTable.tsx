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
import { Plus, Search, Package, Tag, Edit2, Trash2, RefreshCcw } from "lucide-react";
import ProductForm from "./ProductForm";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { catalogApi } from "@/lib/api";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  sku: string;
  category?: { id: number; name: string } | null;
}

export default function ProductTable() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<number | null>(null);

  // Estados para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await catalogApi.getProducts();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Error al cargar productos. ¿Servicio activo?");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleCreate = () => { setSelectedProduct(null); setIsFormOpen(true); };
  const handleEdit = (product: Product) => { setSelectedProduct(product); setIsFormOpen(true); };
  const confirmDelete = (id: number) => { setProductToDelete(id); setIsDeleteDialogOpen(true); };
  
  const handleDelete = async () => {
    if (productToDelete) {
      try {
        await catalogApi.deleteProduct(productToDelete);
        toast.success("Producto eliminado");
        fetchProducts();
      } catch (error) {
        toast.error("Error al eliminar el producto");
      } finally {
        setProductToDelete(null);
        setIsDeleteDialogOpen(false);
      }
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Lógica de paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  return (
    <div className="w-full space-y-4">
      <Toaster position="top-right" richColors />
      <ProductForm isOpen={isFormOpen} product={selectedProduct} onClose={() => setIsFormOpen(false)} onSave={fetchProducts} />
      
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar este producto?</AlertDialogTitle>
            <AlertDialogDescription>Esta acción es permanente.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">Sí, eliminar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
          <div>
            <CardTitle className="text-2xl font-bold flex items-center gap-2"><Package className="text-primary" /> Productos</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">Gestión de inventario de Dimade V2.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={fetchProducts} disabled={loading}>
              <RefreshCcw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
            <Button className="flex items-center gap-2" onClick={handleCreate}><Plus className="w-4 h-4" /> Nuevo</Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Buscar..." className="pl-9" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>

          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="hidden md:table-cell">SKU</TableHead>
                  <TableHead>Producto</TableHead>
                  <TableHead className="hidden sm:table-cell">Categoría</TableHead>
                  <TableHead className="text-right">Precio/Stock</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                    <TableRow><TableCell colSpan={6} className="text-center py-10 text-muted-foreground italic">Cargando catálogo...</TableCell></TableRow>
                ) : currentProducts.length === 0 ? (
                  <TableRow><TableCell colSpan={6} className="text-center py-10 text-muted-foreground">No se encontraron productos.</TableCell></TableRow>
                ) : currentProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-mono text-xs hidden md:table-cell text-muted-foreground">{product.sku}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-bold text-sm">{product.name}</span>
                        <span className="text-[10px] text-muted-foreground md:hidden">{product.sku}</span>
                        <span className="inline-flex sm:hidden mt-1 text-[9px] uppercase font-bold text-primary">{product.category?.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary text-[10px] uppercase font-bold text-secondary-foreground">
                        <Tag className="w-3 h-3" /> {product.category?.name || "N/A"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex flex-col items-end">
                        <span className="font-bold text-sm text-primary">${product.price.toFixed(2)}</span>
                        <span className={`text-[10px] ${product.stock < 10 ? 'text-destructive font-bold' : 'text-muted-foreground'}`}>
                          Stock: {product.stock}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                        <div className="flex justify-end gap-0.5">
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(product)}><Edit2 className="h-3.5 w-3.5 text-primary" /></Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => confirmDelete(product.id)}><Trash2 className="h-3.5 w-3.5 text-destructive" /></Button>
                        </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {totalPages > 1 && (
            <div className="pt-4 border-t">
                <Pagination>
                    <PaginationContent>
                        <PaginationItem><PaginationPrevious className="cursor-pointer" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} /></PaginationItem>
                        {[...Array(totalPages)].map((_, i) => (
                            <PaginationItem key={i}>
                                <PaginationLink isActive={currentPage === i + 1} onClick={() => setCurrentPage(i + 1)} className="cursor-pointer">{i + 1}</PaginationLink>
                            </PaginationItem>
                        ))}
                        <PaginationItem><PaginationNext className="cursor-pointer" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} /></PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
