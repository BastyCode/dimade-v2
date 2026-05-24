import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LayoutGrid, AlertTriangle, TrendingUp } from "lucide-react";

const financialData = [
  { month: 'Ene', ventas: 4000, compras: 2400 },
  { month: 'Feb', ventas: 3000, compras: 1398 },
  { month: 'Mar', ventas: 2000, compras: 9800 },
  { month: 'Abr', ventas: 2780, compras: 3908 },
  { month: 'May', ventas: 1890, compras: 4800 },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      {/* KPIs Superiores Financieros */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos Totales (Ventas)</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$12,450,000</div>
            <p className="text-xs text-muted-foreground">+15% vs mes anterior</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gastos Totales (Compras)</CardTitle>
            <AlertTriangle className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$8,120,000</div>
            <p className="text-xs text-muted-foreground">Incluye pagos a proveedores</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cotizaciones Pendientes</CardTitle>
            <LayoutGrid className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">12 por vencer esta semana</p>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico Comparativo Ventas vs Compras */}
      <Card>
        <CardHeader>
          <CardTitle>Balance de Operaciones</CardTitle>
          <CardDescription>Comparativa mensual entre ventas a clientes y compras a proveedores.</CardDescription>
        </CardHeader>
        <CardContent className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={financialData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
              <XAxis dataKey="month" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
              <Legend />
              <Bar dataKey="ventas" name="Ventas Clientes" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="compras" name="Compras Proveedores" fill="var(--color-accent)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Sección de Actividad Reciente */}
      <Card>
        <CardHeader>
          <CardTitle>Estado del Sistema</CardTitle>
          <CardDescription>Conexión en tiempo real con los microservicios de Dimade V2.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="space-y-4">
                <div className="flex items-center gap-4 p-3 rounded-lg border bg-accent/5">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <div className="flex-1">
                        <p className="text-sm font-medium">Catalog Service</p>
                        <p className="text-xs text-muted-foreground">Sincronización de productos activa y estable.</p>
                    </div>
                </div>
                <div className="flex items-center gap-4 p-3 rounded-lg border bg-accent/5">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <div className="flex-1">
                        <p className="text-sm font-medium">Auth Service</p>
                        <p className="text-xs text-muted-foreground">Sistema de roles y permisos verificado.</p>
                    </div>
                </div>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
