import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Trash2, FileText, User, Hash, CreditCard } from "lucide-react";
import { toast } from "sonner";
import { generateDocumentPDF } from "@/lib/pdf-generator";

interface Item {
  id: string;
  description: string;
  quantity: number;
  price: number;
}

interface DocumentFormProps {
  isOpen: boolean;
  onClose: () => void;
  type: string;
  title: string;
}

export default function DocumentForm({ isOpen, onClose, type: initialType, title: initialTitle }: DocumentFormProps) {
  const [docType, setDocType] = useState(initialType === 'quote' ? 'quote' : 'invoice');
  const [items, setItems] = useState<Item[]>([{ id: '1', description: '', quantity: 1, price: 0 }]);
  const [clientData, setClientData] = useState({ name: '', rut: '', date: new Date().toISOString().split('T')[0] });

  const addItem = () => {
    setItems([...items, { id: Math.random().toString(), description: '', quantity: 1, price: 0 }]);
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const updateItem = (id: string, field: keyof Item, value: any) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const calculateSubtotal = () => items.reduce((acc, item) => acc + (item.quantity * item.price), 0);
  const calculateIva = () => calculateSubtotal() * 0.19;
  const calculateTotal = () => calculateSubtotal() + calculateIva();

  const handleSave = () => {
    const isQuote = docType === 'quote';
    
    // Generar el PDF real con los datos del formulario
    generateDocumentPDF({
      title: isQuote ? 'Cotización' : 'Factura',
      number: `${isQuote ? 'COT' : 'FAC'}-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      date: clientData.date,
      clientName: clientData.name || "Cliente General",
      clientRut: clientData.rut || "1-9",
      items: items.map(item => ({
        description: item.description || "Sin descripción",
        quantity: item.quantity,
        price: item.price
      }))
    });

    toast.success(`${isQuote ? 'Cotización' : 'Factura'} guardada y PDF generado`);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between pr-6">
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <FileText className="text-primary" />
              Crear Documento
            </DialogTitle>
            
            <div className="flex bg-muted p-1 rounded-lg">
              <button 
                onClick={() => setDocType('invoice')}
                className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all ${docType === 'invoice' ? 'bg-white shadow-sm text-primary' : 'text-muted-foreground hover:text-foreground'}`}
              >
                Factura
              </button>
              <button 
                onClick={() => setDocType('quote')}
                className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all ${docType === 'quote' ? 'bg-white shadow-sm text-primary' : 'text-muted-foreground hover:text-foreground'}`}
              >
                Cotización
              </button>
            </div>
          </div>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="flex items-center gap-2 px-1">
            <span className={`h-2 w-2 rounded-full animate-pulse ${docType === 'quote' ? 'bg-amber-500' : 'bg-blue-500'}`}></span>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Modo: <span className="text-foreground">{docType === 'quote' ? 'Generando Cotización' : 'Generando Factura Electrónica'}</span>
            </p>
          </div>

          {/* Información del Cliente/Proveedor */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-muted/30 p-4 rounded-lg">
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase text-muted-foreground flex items-center gap-1">
                <User className="w-3 h-3" /> Nombre / Razón Social
              </Label>
              <Input 
                placeholder="Ej: Constructora Dimade" 
                value={clientData.name}
                onChange={(e) => setClientData({...clientData, name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase text-muted-foreground flex items-center gap-1">
                <Hash className="w-3 h-3" /> RUT
              </Label>
              <Input 
                placeholder="12.345.678-9" 
                value={clientData.rut}
                onChange={(e) => setClientData({...clientData, rut: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase text-muted-foreground flex items-center gap-1">
                <CreditCard className="w-3 h-3" /> Fecha Emisión
              </Label>
              <Input 
                type="date" 
                value={clientData.date}
                onChange={(e) => setClientData({...clientData, date: e.target.value})}
              />
            </div>
          </div>

          {/* Tabla de Items */}
          <div className="space-y-2">
            <Label className="text-[10px] font-bold uppercase text-muted-foreground">Detalle del Documento</Label>
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Descripción</TableHead>
                    <TableHead className="w-[100px]">Cant.</TableHead>
                    <TableHead className="w-[150px]">Precio Unit.</TableHead>
                    <TableHead className="w-[150px] text-right">Total</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <Input 
                          placeholder="Descripción del producto o servicio" 
                          variant="ghost" 
                          value={item.description}
                          onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                        />
                      </TableCell>
                      <TableCell>
                        <Input 
                          type="number" 
                          value={item.quantity}
                          onChange={(e) => updateItem(item.id, 'quantity', Number(e.target.value))}
                        />
                      </TableCell>
                      <TableCell>
                        <Input 
                          type="number" 
                          value={item.price}
                          onChange={(e) => updateItem(item.id, 'price', Number(e.target.value))}
                        />
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        ${(item.quantity * item.price).toLocaleString('es-CL')}
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)}>
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <Button variant="outline" size="sm" className="mt-2" onClick={addItem}>
              <Plus className="w-4 h-4 mr-2" /> Añadir Línea
            </Button>
          </div>

          {/* Totales */}
          <div className="flex justify-end">
            <div className="w-[250px] space-y-2 border-t pt-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Neto:</span>
                <span>${calculateSubtotal().toLocaleString('es-CL')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">IVA (19%):</span>
                <span>${calculateIva().toLocaleString('es-CL')}</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-primary">
                <span>Total:</span>
                <span>${calculateTotal().toLocaleString('es-CL')}</span>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSave} className="flex items-center gap-2">
            <FileText className="w-4 h-4" /> Guardar y Generar PDF
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
