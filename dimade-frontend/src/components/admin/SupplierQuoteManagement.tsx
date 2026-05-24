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
import { FileUp, FileText, Trash2, Search, Building2, Calendar, DollarSign, ExternalLink } from "lucide-react";

interface Supplier {
  id: number;
  name: string;
}

interface SupplierQuote {
  id?: number;
  supplierId: number;
  supplierName: string;
  quoteNumber: string;
  totalAmount: number;
  observation: string;
  createdAt?: string;
}

export default function SupplierQuoteManagement() {
  const [quotes, setQuotes] = useState<SupplierQuote[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const [formData, setFormData] = useState({
    supplierId: "",
    quoteNumber: "",
    totalAmount: 0,
    observation: ""
  });

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const quotesData = await crmApi.getSupplierQuotes() || [];
      const suppliersData = await crmApi.getSuppliers() || [];
      setQuotes(Array.isArray(quotesData) ? quotesData : []);
      setSuppliers(Array.isArray(suppliersData) ? suppliersData : []);
    } catch (error) {
      console.error("Error fetching supplier data:", error);
      toast.error("Error al cargar los datos de proveedores");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenDialog = () => {
    setFormData({
      supplierId: "",
      quoteNumber: "",
      totalAmount: 0,
      observation: ""
    });
    setSelectedFile(null);
    setIsDialogOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type !== "application/pdf") {
        toast.error("Solo se permiten archivos PDF");
        return;
      }
      setSelectedFile(file);
      toast.success(`Archivo "${file.name}" cargado`);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSupplierChange = (value: string) => {
    setFormData(prev => ({ ...prev, supplierId: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      toast.error("Por favor adjunta el PDF de la cotización");
      return;
    }
    try {
      const selectedSupplier = (suppliers || []).find(s => s.id.toString() === formData.supplierId);
      const dataToSave = {
        ...formData,
        supplierId: parseInt(formData.supplierId),
        supplierName: selectedSupplier?.name || "Proveedor Desconocido",
        pdfUrl: selectedFile.name
      };
      
      await crmApi.createSupplierQuote(dataToSave);
      toast.success("Cotización registrada correctamente");
      fetchData();
      setIsDialogOpen(false);
    } catch (error) {
      toast.error("Error al guardar cotización");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar este registro?")) return;
    try {
      await crmApi.deleteSupplierQuote(id);
      toast.success("Registro eliminado");
      fetchData();
    } catch (error) {
      toast.error("Error al eliminar");
    }
  };

  const safeQuotes = Array.isArray(quotes) ? quotes : [];
  const filteredQuotes = safeQuotes.filter(q => 
    (q.supplierName || "").toLowerCase().includes(searchTerm.toLowerCase()) || 
    (q.quoteNumber || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-medium text-muted-foreground italic">Cargando cotizaciones...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <FileText className="text-primary" />
            Cotizaciones de Proveedores
          </h1>
          <p className="text-muted-foreground text-sm">Registro de propuestas recibidas y subida de archivos PDF.</p>
        </div>
        <Button onClick={handleOpenDialog} className="gap-2 bg-slate-900">
          <FileUp size={18} /> Registrar Cotización
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2 bg-slate-50 border px-3 py-2 rounded-xl w-full max-w-sm">
            <Search size={18} className="text-slate-400" />
            <input 
              type="text" 
              placeholder="Buscar por proveedor o número..." 
              className="bg-transparent border-none focus:outline-none text-sm w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/50">
                <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400">Proveedor</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400">Folio PDF</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Monto Total</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={4} className="text-center py-10 italic">Cargando...</TableCell></TableRow>
              ) : filteredQuotes.length === 0 ? (
                <TableRow><TableCell colSpan={4} className="text-center py-10 text-muted-foreground">No hay cotizaciones registradas.</TableCell></TableRow>
              ) : (
                filteredQuotes.map((quote) => (
                  <TableRow key={quote.id} className="hover:bg-slate-50/50">
                    <TableCell className="font-bold">
                      <div className="flex items-center gap-2">
                        <Building2 size={14} className="text-slate-400" />
                        {quote.supplierName || 'S/N'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-mono text-xs bg-slate-100 px-2 py-1 rounded text-slate-600">{quote.quoteNumber || 'S/N'}</span>
                    </TableCell>
                    <TableCell className="text-right font-black text-primary">
                      ${quote.totalAmount?.toLocaleString('es-CL') || '0'}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Ver PDF">
                          <ExternalLink size={16} />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-400 hover:text-red-600" onClick={() => quote.id && handleDelete(quote.id)}>
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Registrar Cotización Proveedor</DialogTitle>
              <DialogDescription>
                Sube el archivo y registra el monto total cobrado por el proveedor.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Seleccionar Proveedor</Label>
                <Select onValueChange={handleSupplierChange} value={formData.supplierId}>
                  <SelectTrigger className="rounded-xl border-slate-200">
                    <SelectValue placeholder="Busca un proveedor..." />
                  </SelectTrigger>
                  <SelectContent>
                    {(suppliers || []).map(s => (
                      <SelectItem key={s.id} value={s.id.toString()}>{s.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Número de Folio</Label>
                  <Input 
                    name="quoteNumber" 
                    placeholder="Ej: COT-5542" 
                    className="rounded-xl font-mono"
                    value={formData.quoteNumber}
                    onChange={handleChange}
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Monto Total ($)</Label>
                  <Input 
                    type="number" 
                    name="totalAmount" 
                    placeholder="0" 
                    className="rounded-xl font-black text-primary"
                    value={formData.totalAmount}
                    onChange={handleChange}
                    required 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Archivo PDF</Label>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  accept=".pdf" 
                  className="hidden" 
                />
                <div 
                  onClick={triggerFileInput}
                  className={`border-2 border-dashed rounded-2xl p-8 text-center transition-colors cursor-pointer group ${selectedFile ? 'border-primary bg-primary/5' : 'border-slate-200 hover:bg-slate-50'}`}
                >
                  <FileUp className={`mx-auto w-10 h-10 ${selectedFile ? 'text-primary' : 'text-slate-300 group-hover:text-primary'}`} />
                  <p className={`text-xs mt-2 ${selectedFile ? 'text-primary font-bold' : 'text-slate-400'}`}>
                    {selectedFile ? `Archivo: ${selectedFile.name}` : 'Haz clic para seleccionar el PDF'}
                  </p>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
              <Button type="submit" className="bg-primary rounded-xl px-8">Guardar Registro</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
