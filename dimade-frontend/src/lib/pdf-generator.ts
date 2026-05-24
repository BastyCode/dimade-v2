import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface DocItem {
  description: string;
  quantity: number;
  price: number;
}

interface DocData {
  title: string;
  number: string;
  date: string;
  clientName: string;
  clientRut: string;
  items: DocItem[];
}

export const generateDocumentPDF = (data: DocData) => {
  const doc = new jsPDF();
  
  // Colores y Estilo
  const primaryColor = [15, 23, 42]; // Slate 900
  
  // Encabezado
  doc.setFontSize(22);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text("DIMADE SpA", 14, 20);
  
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text("Soluciones en Construcción y Operaciones", 14, 26);
  doc.text("Santiago, Chile", 14, 31);
  
  // Recuadro del Documento
  doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setLineWidth(0.5);
  doc.rect(140, 15, 55, 25);
  
  doc.setFontSize(12);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text("R.U.T.: 76.543.210-K", 145, 23);
  doc.setFontSize(14);
  doc.text(data.title.toUpperCase(), 145, 30);
  doc.text(data.number, 145, 37);
  
  // Información del Cliente
  doc.setFontSize(10);
  doc.setTextColor(0);
  doc.text("SEÑOR(ES):", 14, 55);
  doc.setFont("helvetica", "bold");
  doc.text(data.clientName, 40, 55);
  
  doc.setFont("helvetica", "normal");
  doc.text("R.U.T.:", 14, 61);
  doc.text(data.clientRut, 40, 61);
  
  doc.text("FECHA:", 14, 67);
  doc.text(data.date, 40, 67);
  
  // Tabla de Items
  const tableColumn = ["Descripción", "Cantidad", "Precio Unit.", "Total"];
  const tableRows = data.items.map(item => [
    item.description,
    item.quantity.toString(),
    `$${item.price.toLocaleString('es-CL')}`,
    `$${(item.quantity * item.price).toLocaleString('es-CL')}`
  ]);
  
  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 80,
    theme: 'grid',
    headStyles: { fillColor: primaryColor },
    styles: { fontSize: 9 },
    columnStyles: {
      1: { halign: 'center' },
      2: { halign: 'right' },
      3: { halign: 'right' }
    }
  });
  
  // Totales
  const finalY = (doc as any).lastAutoTable.finalY + 10;
  const subtotal = data.items.reduce((acc, item) => acc + (item.quantity * item.price), 0);
  const iva = subtotal * 0.19;
  const total = subtotal + iva;
  
  doc.setFont("helvetica", "normal");
  doc.text("MONTO NETO:", 140, finalY);
  doc.text(`$${subtotal.toLocaleString('es-CL')}`, 195, finalY, { align: 'right' });
  
  doc.text("IVA (19%):", 140, finalY + 7);
  doc.text(`$${iva.toLocaleString('es-CL')}`, 195, finalY + 7, { align: 'right' });
  
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("TOTAL:", 140, finalY + 15);
  doc.text(`$${total.toLocaleString('es-CL')}`, 195, finalY + 15, { align: 'right' });
  
  // Guardar PDF
  doc.save(`${data.number}_${data.clientName.replace(/\s+/g, '_')}.pdf`);
};
