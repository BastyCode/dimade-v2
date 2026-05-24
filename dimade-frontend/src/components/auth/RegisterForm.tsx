import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { Loader2, UserPlus, Mail, KeyRound, User } from "lucide-react";
import { authApi } from "@/lib/api";

export default function RegisterForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('dimade_token')) {
      window.location.href = "/admin";
    }
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await authApi.register({ 
        firstName, 
        lastName, 
        email, 
        password 
      });
      
      if (response.accessToken) {
        localStorage.setItem('dimade_token', response.accessToken);
        localStorage.setItem('dimade_refresh_token', response.refreshToken);
        
        toast.success("¡Bienvenido! Cuenta de administrador creada.");
        
        setTimeout(() => {
          window.location.href = "/admin";
        }, 800);
      } else {
        // Cuenta registrada pero pendiente de aprobación
        toast.info("¡Registro exitoso! Tu cuenta está pendiente de aprobación por un administrador.", {
          duration: 6000
        });
        
        setTimeout(() => {
          window.location.href = "/auth/login";
        }, 3000);
      }
      
    } catch (error: any) {
      console.error("Register error:", error);
      toast.error(`Error: ${error.message || "No se pudo crear la cuenta"}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 overflow-hidden px-4 py-10">
      <Toaster position="top-right" richColors />
      
      <Card className="w-full max-w-[420px] shadow-2xl border-none bg-white p-10 flex flex-col items-center">
        
        <img src="/logo_dimade.png" alt="Dimade" className="h-16 w-auto mb-8" />
        
        <div className="text-center mb-8">
            <h1 className="text-xl font-black text-slate-800 uppercase tracking-tighter">Crear Cuenta</h1>
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Únete a Dimade V2</p>
        </div>

        <form onSubmit={handleRegister} className="w-full space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="firstName" className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1 flex items-center gap-1">
                  <User size={10} /> Nombre
              </Label>
              <Input 
                id="firstName" 
                placeholder="Juan"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required 
                className="h-11 px-4 border-slate-200 bg-slate-50/30 font-medium"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="lastName" className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1 flex items-center gap-1">
                   Apellido
              </Label>
              <Input 
                id="lastName" 
                placeholder="Pérez"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required 
                className="h-11 px-4 border-slate-200 bg-slate-50/30 font-medium"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1 flex items-center gap-1">
                <Mail size={10} /> Email
            </Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="usuario@dimade.cl"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
              className="h-11 px-4 border-slate-200 bg-slate-50/30 font-medium"
            />
          </div>
          
          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1 flex items-center gap-1">
                <KeyRound size={10} /> Contraseña
            </Label>
            <Input 
              id="password" 
              type="password" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
              className="h-11 px-4 border-slate-200 bg-slate-50/30 font-medium"
            />
          </div>

          <Button 
            className="w-full h-11 font-bold text-xs uppercase tracking-[0.2em] mt-2 shadow-lg shadow-primary/20" 
            type="submit" 
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Registrarse'}
          </Button>

          <div className="text-center mt-4">
            <a href="/auth/login" className="text-[10px] font-bold text-primary uppercase tracking-widest hover:underline">
                ¿Ya tienes cuenta? Inicia sesión
            </a>
          </div>
        </form>
        
        <div className="pt-10 border-t w-full mt-10 text-center">
          <span className="text-[9px] text-slate-300 font-bold uppercase tracking-[0.4em]">
              Dimade V2 &bull; Registro Seguro
          </span>
        </div>
        
      </Card>
    </div>
  );
}
