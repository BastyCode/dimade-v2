import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { authApi } from "@/lib/api";
import { toast } from "sonner";
import { UserPlus, Trash2, ShieldCheck, ShieldAlert, Key, UserCheck, Clock } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  enabled: boolean;
  status: string; // PENDING, APPROVED, REJECTED
  needsPasswordChange: boolean;
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);
  const [tempPassword, setTempPassword] = useState("");
  const [selectedUserEmail, setSelectedUserEmail] = useState("");

  const fetchUsers = async () => {
    try {
      const data = await authApi.getUsers();
      setUsers(data);
    } catch (error) {
      toast.error("Error al cargar usuarios");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleApprove = async (id: number, email: string) => {
    try {
      const response = await authApi.approveUser(id);
      setTempPassword(response.temporaryPassword);
      setSelectedUserEmail(email);
      setShowApprovalDialog(true);
      fetchUsers();
      toast.success("Usuario aprobado correctamente");
    } catch (error) {
      toast.error("Error al aprobar usuario");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Estás seguro de eliminar este usuario?")) return;
    try {
      await authApi.deleteUser(id);
      toast.success("Usuario eliminado");
      fetchUsers();
    } catch (error) {
      toast.error("Error al eliminar usuario");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Gestión de Usuarios</h1>
          <p className="text-muted-foreground text-sm">Administra el personal con acceso al Backoffice.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Personal del Sistema</CardTitle>
          <CardDescription>Solo los usuarios aprobados pueden acceder a los módulos de gestión.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b text-left text-xs uppercase text-muted-foreground font-black tracking-widest bg-slate-50">
                  <th className="p-4">Usuario</th>
                  <th className="p-4 text-center">Estado de Acceso</th>
                  <th className="p-4 text-center">Seguridad</th>
                  <th className="p-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr><td colSpan={4} className="p-10 text-center italic text-slate-400">Cargando personal...</td></tr>
                ) : users.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-slate-50/50 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-slate-700">{user.firstName} {user.lastName}</div>
                      <div className="text-xs text-muted-foreground font-mono">{user.email}</div>
                    </td>
                    <td className="p-4 text-center">
                      {user.status === 'APPROVED' ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-100 text-green-700 text-[10px] font-black uppercase">
                          <UserCheck size={12} /> Aprobado
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-[10px] font-black uppercase">
                          <Clock size={12} /> Pendiente
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      {user.needsPasswordChange ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-[10px] font-black uppercase" title="Debe cambiar clave en el primer login">
                          <Key size={12} /> Cambio Pendiente
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-[10px] font-black uppercase">
                          <ShieldCheck size={12} /> Protegido
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        {user.status === 'PENDING' && (
                          <Button 
                            onClick={() => handleApprove(user.id, user.email)} 
                            size="sm" 
                            className="bg-primary hover:bg-primary/90 gap-1.5 h-8 text-[10px] font-bold uppercase tracking-wider"
                          >
                            <UserCheck size={14} /> Aprobar Acceso
                          </Button>
                        )}
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleDelete(user.id)}
                          className="text-slate-400 hover:text-red-600 h-8 w-8 p-0"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Dialogo de Clave Temporal */}
      <Dialog open={showApprovalDialog} onOpenChange={setShowApprovalDialog}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-green-600">
              <ShieldCheck /> Acceso Concedido
            </DialogTitle>
            <DialogDescription>
              El trabajador <strong>{selectedUserEmail}</strong> ha sido aprobado.
            </DialogDescription>
          </DialogHeader>
          <div className="bg-slate-900 p-6 rounded-2xl my-4 text-center border-2 border-primary/20">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-2">Clave Temporal Generada</p>
            <div className="text-3xl font-black text-white tracking-widest font-mono">
              {tempPassword}
            </div>
            <p className="text-[9px] text-slate-400 mt-4 italic">
              * El usuario deberá cambiar esta clave al iniciar sesión.
            </p>
          </div>
          <DialogFooter>
            <Button className="w-full rounded-xl py-6 font-bold" onClick={() => setShowApprovalDialog(false)}>
              Entendido, ya copié la clave
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
