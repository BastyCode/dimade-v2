import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { crmApi } from "@/lib/api";
import { toast } from "sonner";
import { UserPlus, Edit, Trash2, Search, User, Phone, Mail, MapPin, Tag } from "lucide-react";

interface Client {
  id?: number;
  name: string;
  identifier: string;
  email: string;
  phone: string;
  address: string;
  clientType: string;
}

export default function ClientManagement() {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  
  const [formData, setFormData] = useState<Client>({
    name: "",
    identifier: "",
    email: "",
    phone: "",
    address: "",
    clientType: "Regular"
  });

  const fetchClients = async () => {
    try {
      const data = await crmApi.getClients();
      setClients(data);
    } catch (error) {
      toast.error("Error al cargar clientes");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleOpenDialog = (client: Client | null = null) => {
    if (client) {
      setEditingClient(client);
      setFormData(client);
    } else {
      setEditingClient(null);
      setFormData({
        name: "",
        identifier: "",
        email: "",
        phone: "",
        address: "",
        clientType: "Regular"
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingClient(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTypeChange = (value: string) => {
    setFormData(prev => ({ ...prev, clientType: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingClient?.id) {
        await crmApi.updateClient(editingClient.id, formData);
        toast.success("Cliente actualizado");
      } else {
        await crmApi.createClient(formData);
        toast.success("Cliente creado con éxito");
      }
      fetchClients();
      handleCloseDialog();
    } catch (error) {
      toast.error("Error al guardar cliente");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Estás seguro de eliminar este cliente?")) return;
    try {
      await crmApi.deleteClient(id);
      toast.success("Cliente eliminado");
      fetchClients();
    } catch (error) {
      toast.error("Error al eliminar cliente");
    }
  };

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.identifier.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Gestión de Clientes</h1>
          <p className="text-muted-foreground text-sm">Administra la base de datos de tus clientes y prospectos.</p>
        </div>
        <Button onClick={() => handleOpenDialog()} className="gap-2">
          <UserPlus size={18} /> Nuevo Cliente
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2 bg-slate-50 border px-3 py-2 rounded-md w-full max-w-sm">
            <Search size={18} className="text-slate-400" />
            <input 
              type="text" 
              placeholder="Buscar por nombre, RUT o email..." 
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
                  <TableHead className="text-[10px] font-black uppercase tracking-widest">Cliente</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest">Identificación</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest">Contacto</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest">Categoría</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-10 text-muted-foreground italic">Cargando clientes...</TableCell>
                  </TableRow>
                ) : filteredClients.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-10 text-muted-foreground italic">No se encontraron clientes.</TableCell>
                  </TableRow>
                ) : (
                  filteredClients.map((client) => (
                    <TableRow key={client.id} className="hover:bg-slate-50/50 transition-colors">
                      <TableCell className="font-bold text-slate-700">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                            <User size={16} />
                          </div>
                          {client.name}
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-xs">{client.identifier}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 text-xs text-slate-500">
                            <Mail size={12} /> {client.email}
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-slate-500">
                            <Phone size={12} /> {client.phone}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          client.clientType === 'VIP' ? 'bg-amber-100 text-amber-700' : 
                          client.clientType === 'Regular' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'
                        }`}>
                          <Tag size={10} /> {client.clientType}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0 text-slate-400 hover:text-primary"
                            onClick={() => handleOpenDialog(client)}
                          >
                            <Edit size={16} />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0 text-slate-400 hover:text-red-600"
                            onClick={() => client.id && handleDelete(client.id)}
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
              <DialogTitle>{editingClient ? 'Editar Cliente' : 'Nuevo Cliente'}</DialogTitle>
              <DialogDescription>
                Completa los datos del cliente para su registro en el sistema.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right text-xs uppercase font-bold text-muted-foreground">Nombre</Label>
                <Input id="name" name="name" value={formData.name} onChange={handleChange} className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="identifier" className="text-right text-xs uppercase font-bold text-muted-foreground">RUT / DNI</Label>
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
                <Label htmlFor="clientType" className="text-right text-xs uppercase font-bold text-muted-foreground">Tipo</Label>
                <div className="col-span-3">
                  <Select onValueChange={handleTypeChange} value={formData.clientType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Regular">Regular</SelectItem>
                      <SelectItem value="VIP">VIP</SelectItem>
                      <SelectItem value="Nuevo">Nuevo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseDialog}>Cancelar</Button>
              <Button type="submit">
                {editingClient ? 'Actualizar' : 'Guardar Cliente'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
