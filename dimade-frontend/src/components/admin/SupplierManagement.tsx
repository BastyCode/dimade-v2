import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { crmApi } from "@/lib/api";
import { toast } from "sonner";
import { Plus, Edit, Trash2, Search, Building2, Phone, Mail, Tag } from "lucide-react";

interface Supplier {
  id?: number;
  name: string;
  identifier: string;
  email: string;
  phone: string;
  address: string;
  category: string;
}

export default function SupplierManagement() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  
  const [formData, setFormData] = useState<Supplier>({
    name: "",
    identifier: "",
    email: "",
    phone: "",
    address: "",
    category: ""
  });

  const fetchSuppliers = async () => {
    try {
      const data = await crmApi.getSuppliers();
      setSuppliers(data);
    } catch (error) {
      toast.error("Error al cargar proveedores");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const handleOpenDialog = (supplier: Supplier | null = null) => {
    if (supplier) {
      setEditingSupplier(supplier);
      setFormData(supplier);
    } else {
      setEditingSupplier(null);
      setFormData({
        name: "",
        identifier: "",
        email: "",
        phone: "",
        address: "",
        category: ""
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingSupplier(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingSupplier?.id) {
        await crmApi.updateSupplier(editingSupplier.id, formData);
        toast.success("Proveedor actualizado");
      } else {
        await crmApi.createSupplier(formData);
        toast.success("Proveedor creado con éxito");
      }
      fetchSuppliers();
      handleCloseDialog();
    } catch (error) {
      toast.error("Error al guardar proveedor");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Estás seguro de eliminar este proveedor?")) return;
    try {
      await crmApi.deleteSupplier(id);
      toast.success("Proveedor eliminado");
      fetchSuppliers();
    } catch (error) {
      toast.error("Error al eliminar proveedor");
    }
  };

  const filteredSuppliers = suppliers.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.identifier.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Gestión de Proveedores</h1>
          <p className="text-muted-foreground text-sm">Administra la base de datos de tus proveedores y empresas aliadas.</p>
        </div>
        <Button onClick={() => handleOpenDialog()} className="gap-2">
          <Plus size={18} /> Nuevo Proveedor
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2 bg-slate-50 border px-3 py-2 rounded-md w-full max-w-sm">
            <Search size={18} className="text-slate-400" />
            <input 
              type="text" 
              placeholder="Buscar por nombre, RUT o rubro..." 
              className="bg-transparent border-none focus:outline-none text-sm w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/50">
                  <TableHead className="text-[10px] font-black uppercase tracking-widest">Empresa / Proveedor</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest">Identificación</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest">Contacto</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest">Rubro / Categoría</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-10 text-muted-foreground italic">Cargando proveedores...</TableCell>
                  </TableRow>
                ) : filteredSuppliers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-10 text-muted-foreground italic">No se encontraron proveedores.</TableCell>
                  </TableRow>
                ) : (
                  filteredSuppliers.map((supplier) => (
                    <TableRow key={supplier.id} className="hover:bg-slate-50/50 transition-colors">
                      <TableCell className="font-bold text-slate-700">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center">
                            <Building2 size={16} />
                          </div>
                          {supplier.name}
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-xs">{supplier.identifier}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 text-xs text-slate-500">
                            <Mail size={12} /> {supplier.email}
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-slate-500">
                            <Phone size={12} /> {supplier.phone}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-[10px] font-bold text-slate-600 uppercase">
                          <Tag size={10} /> {supplier.category || 'General'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0 text-slate-400 hover:text-primary"
                            onClick={() => handleOpenDialog(supplier)}
                          >
                            <Edit size={16} />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0 text-slate-400 hover:text-red-600"
                            onClick={() => supplier.id && handleDelete(supplier.id)}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>{editingSupplier ? 'Editar Proveedor' : 'Nuevo Proveedor'}</DialogTitle>
              <DialogDescription>
                Completa los datos fiscales y de contacto del proveedor.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right text-xs uppercase font-bold text-muted-foreground">Razón Social</Label>
                <Input id="name" name="name" value={formData.name} onChange={handleChange} className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="identifier" className="text-right text-xs uppercase font-bold text-muted-foreground">RUT / ID</Label>
                <Input id="identifier" name="identifier" value={formData.identifier} onChange={handleChange} className="col-span-3 font-mono" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right text-xs uppercase font-bold text-muted-foreground">Email</Label>
                <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right text-xs uppercase font-bold text-muted-foreground">Teléfono</Label>
                <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="address" className="text-right text-xs uppercase font-bold text-muted-foreground">Dirección</Label>
                <Input id="address" name="address" value={formData.address} onChange={handleChange} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right text-xs uppercase font-bold text-muted-foreground">Rubro</Label>
                <Input id="category" name="category" placeholder="Ej: Logística, Alimentos..." value={formData.category} onChange={handleChange} className="col-span-3" />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseDialog}>Cancelar</Button>
              <Button type="submit">
                {editingSupplier ? 'Actualizar' : 'Guardar Proveedor'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
