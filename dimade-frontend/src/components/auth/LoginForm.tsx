import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { Loader2, KeyRound, Mail } from "lucide-react";
import { authApi } from "@/lib/api";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await authApi.login({ email, password });
      
      // Guardar tokens y estado (Corregido: coinciden con el camelCase del backend)
      if (response.accessToken) {
        localStorage.setItem('dimade_token', response.accessToken);
        localStorage.setItem('dimade_refresh_token', response.refreshToken);
        
        // Guardar en COOKIE para soporte SSR (Servidor)
        document.cookie = `dimade_token=${response.accessToken}; path=/; max-age=86400; SameSite=Lax`;
        
        toast.success("¡Bienvenido al sistema!");
        
        // Redirigir después de un breve delay
        setTimeout(() => {
          window.location.href = "/admin";
        }, 800);
      } else {
        throw new Error("Respuesta de servidor inválida");
      }
      
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(`Error: ${error.message || "Credenciales inválidas"}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 overflow-hidden px-4">
      <Toaster position="top-right" richColors />
      
      <Card className="w-full max-w-[380px] shadow-2xl border-none bg-white p-10 flex flex-col items-center">
        
        <img src="/logo_dimade.png" alt="Dimade" className="h-16 w-auto mb-8" />
        
        <div className="text-center mb-8">
            <h1 className="text-xl font-black text-slate-800 uppercase tracking-tighter">Backoffice</h1>
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Panel de Administración</p>
        </div>

        <form onSubmit={handleLogin} className="w-full space-y-5">
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1 flex items-center gap-1">
                <Mail size={10} /> Email
            </Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="admin@dimade.cl"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
              className="h-11 px-4 border-slate-200 bg-slate-50/30 focus-visible:ring-primary/30 font-medium"
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
              className="h-11 px-4 border-slate-200 bg-slate-50/30 focus-visible:ring-primary/30 font-medium"
            />
          </div>

          <Button 
            className="w-full h-11 font-bold text-xs uppercase tracking-[0.2em] mt-2 shadow-lg shadow-primary/20" 
            type="submit" 
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Iniciar Sesión'}
          </Button>

          <div className="text-center mt-4">
            <a href="/auth/register" className="text-[10px] font-bold text-primary uppercase tracking-widest hover:underline">
                ¿No tienes cuenta? Regístrate aquí
            </a>
          </div>
        </form>
        
        <div className="pt-10 border-t w-full mt-10 text-center">
          <span className="text-[9px] text-slate-300 font-bold uppercase tracking-[0.4em]">
              Dimade V2 &bull; Sistema Seguro
          </span>
        </div>
        
      </Card>
    </div>
  );
}
