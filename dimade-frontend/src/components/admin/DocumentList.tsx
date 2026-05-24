import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, FileText, Download, User, Calendar as CalendarIcon, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import DocumentForm from "./DocumentForm";
import { generateDocumentPDF } from "@/lib/pdf-generator";

interface Document {
  id: string;
  type: 'invoice' | 'quote' | 'order' | 'receipt';
  number: string;
  date: string;
  clientName: string;
  clientRut: string;
  total: number;
  status: string;
}

export default function DocumentList({ type, title }: { type: string, title: string }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [activeTab, setActiveType] = useState<string>(type === 'invoice' ? 'all' : type);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Datos mock para visualizar la estructura
  const initialDocuments: Document[] = [
    { id: '1', type: 'quote', number: 'COT-2026-001', date: '2026-05-20', clientName: 'Juan Pérez', clientRut: '12.345.678-9', total: 150000, status: 'Pendiente' },
    { id: '2', type: 'invoice', number: 'FAC-2026-045', date: '2026-05-21', clientName: 'Constructora Dimade SpA', clientRut: '76.543.210-K', total: 1250000, status: 'Pagada' },
    { id: '3', type: 'order', number: 'ORD-2026-012', date: '2026-05-22', clientName: 'Servicios Industriales Ltda', clientRut: '88.888.888-8', total: 500000, status: 'En Proceso' },
    { id: '4', type: 'receipt', number: 'BOL-2026-089', date: '2026-05-23', clientName: 'María García', clientRut: '15.555.555-5', total: 25000, status: 'Pagada' },
  ];

  const [documents, setDocuments] = useState<Document[]>(initialDocuments);

  const handleGeneratePdf = (doc: Document) => {
    toast.info(`Generando PDF para ${doc.number}...`);
    const mockItems = [{ description: "Servicio General", quantity: 1, price: doc.total / 1.19 }];
    generateDocumentPDF({
      title: doc.type === 'invoice' ? 'Factura' : doc.type === 'quote' ? 'Cotización' : doc.type === 'order' ? 'Orden de Compra' : 'Boleta',
      number: doc.number,
      date: doc.date,
      clientName: doc.clientName,
      clientRut: doc.clientRut,
      items: mockItems
    });
  };

  const handleConvertToOrder = (doc: Document) => {
    toast.success(`Cotización ${doc.number} convertida a Orden de Compra`);
    setDocuments(prev => prev.map(d => d.id === doc.id ? { ...d, type: 'order', number: d.number.replace('COT', 'ORD') } : d));
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.clientRut.includes(searchTerm) ||
                         doc.number.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = activeTab === 'all' || doc.type === activeTab;
    
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6 w-full">
      <Toaster position="top-right" richColors />
      
      <DocumentForm 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        type={type} 
        title={title} 
      />
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-primary flex items-center gap-2">
            <FileText className="w-8 h-8" />
            {title}
          </h2>
          <p className="text-muted-foreground mt-1">Gestión y flujo de documentos comerciales.</p>
        </div>
        <Button className="flex items-center gap-2" onClick={() => setIsFormOpen(true)}>
          <Plus className="w-4 h-4" /> Nuevo Documento
        </Button>
      </div>

      {/* Filtros de Tipo (Solo si estamos en Facturas/Boletas) */}
      {type === 'invoice' && (
        <div className="flex bg-muted/50 p-1 rounded-xl w-fit border shadow-sm">
          <button onClick={() => setActiveType('all')} className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${activeTab === 'all' ? 'bg-white shadow-sm text-primary' : 'text-muted-foreground'}`}>Todos</button>
          <button onClick={() => setActiveType('invoice')} className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${activeTab === 'invoice' ? 'bg-white shadow-sm text-primary' : 'text-muted-foreground'}`}>Facturas</button>
          <button onClick={() => setActiveType('receipt')} className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${activeTab === 'receipt' ? 'bg-white shadow-sm text-primary' : 'text-muted-foreground'}`}>Boletas</button>
        </div>
      )}

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Búsqueda Avanzada</CardTitle>
          <CardDescription>Filtra por nombre, RUT o folio.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Nombre, RUT o Número..." 
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="relative">
              <CalendarIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                type="date"
                className="pl-9"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              />
            </div>
            <Button variant="secondary" className="w-full md:w-auto" onClick={() => {setSearchTerm(""); setDateFilter("");}}>Limpiar Filtros</Button>
          </div>
        </CardContent>
      </Card>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="w-[150px]">Número</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Cliente / Empresa</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead className="text-right">Monto Total</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDocuments.map((doc) => (
              <TableRow key={doc.id} className="hover:bg-accent/5 transition-colors">
                <TableCell className="font-bold text-primary">{doc.number}</TableCell>
                <TableCell className="text-xs">{doc.date}</TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium text-sm">{doc.clientName}</span>
                    <span className="text-[10px] text-muted-foreground font-mono">{doc.clientRut}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-tighter ${
                    doc.type === 'quote' ? 'bg-amber-100 text-amber-700' : 
                    doc.type === 'invoice' ? 'bg-blue-100 text-blue-700' :
                    doc.type === 'order' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {doc.type === 'quote' ? 'Cotización' : doc.type === 'invoice' ? 'Factura' : doc.type === 'order' ? 'Orden C.' : 'Boleta'}
                  </span>
                </TableCell>
                <TableCell className="text-right font-bold">
                  ${doc.total.toLocaleString('es-CL')}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    {doc.type === 'quote' && (
                      <Button variant="ghost" size="icon" onClick={() => handleConvertToOrder(doc)} title="Convertir a Orden de Compra" className="h-8 w-8 text-amber-600 hover:bg-amber-50">
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    )}
                    <Button variant="ghost" size="icon" onClick={() => handleGeneratePdf(doc)} title="Descargar PDF" className="h-8 w-8">
                      <Download className="h-4 w-4 text-primary" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
