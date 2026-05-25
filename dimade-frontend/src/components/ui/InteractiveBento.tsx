import React, { useState, useEffect } from 'react';
import { Building2, Laptop, HardHat, Zap, ArrowUpRight, ShoppingCart } from "lucide-react";

interface Product {
  id: number;
  name: string;
  imageUrl: string;
}

interface Category {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  products: Product[];
}

// Datos de ejemplo con la estructura real
const mockData: Category[] = [
  {
    id: 1,
    name: "Construcción",
    description: "Materiales y herramientas de alto desempeño.",
    imageUrl: "https://images.unsplash.com/photo-1581244276891-83393a6b24f1?auto=format&fit=crop&q=80&w=800",
    products: [
      { id: 101, name: "Taladro Percutor Pro", imageUrl: "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&q=80&w=400" },
      { id: 102, name: "Hormigonera Eléctrica", imageUrl: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=400" },
      { id: 103, name: "Set de Herramientas", imageUrl: "https://images.unsplash.com/photo-1530124560612-3f92ca5ba93a?auto=format&fit=crop&q=80&w=400" }
    ]
  },
  {
    id: 2,
    name: "Oficina",
    description: "Elegancia y productividad para tu espacio.",
    imageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800",
    products: [
      { id: 201, name: "Silla Ergonómica", imageUrl: "https://images.unsplash.com/photo-1505797149-43b0ad766207?auto=format&fit=crop&q=80&w=400" },
      { id: 202, name: "Escritorio Minimalista", imageUrl: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=400" }
    ]
  },
  {
    id: 3,
    name: "Seguridad",
    description: "Protección certificada para tu equipo.",
    imageUrl: "https://images.unsplash.com/photo-1582559837648-460017b5e33a?auto=format&fit=crop&q=80&w=800",
    products: [
      { id: 301, name: "Casco de Seguridad", imageUrl: "https://plus.unsplash.com/premium_photo-1661893375334-e28328b9720b?auto=format&fit=crop&q=80&w=400" }
    ]
  },
  {
    id: 4,
    name: "Tecnología",
    description: "Conectividad y potencia industrial.",
    imageUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800",
    products: [
      { id: 401, name: "Router Industrial", imageUrl: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=400" }
    ]
  }
];

export default function InteractiveBento() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4 h-auto md:h-[650px]">
      <BentoCard category={mockData[0]} size="large" icon={<Building2 />} />
      <BentoCard category={mockData[1]} size="wide" icon={<Laptop />} />
      <BentoCard category={mockData[2]} size="small" icon={<HardHat />} color="bg-primary" />
      <BentoCard category={mockData[3]} size="small" icon={<Zap />} color="bg-white border border-slate-100" />
    </div>
  );
}

function BentoCard({ category, size, icon, color }: { category: Category, size: 'large' | 'wide' | 'small', icon: any, color?: string }) {
  const [isHovered, setIsHovered] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Lógica del Slideshow al hacer hover
  useEffect(() => {
    let interval: any;
    if (isHovered && category.products.length > 1) {
      interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % category.products.length);
      }, 2000); // Cambia cada 2 segundos
    } else if (!isHovered) {
      setCurrentIndex(0);
    }
    return () => clearInterval(interval);
  }, [isHovered, category.products.length]);

  const gridClass = {
    large: "md:col-span-2 md:row-span-2",
    wide: "md:col-span-2 md:row-span-1",
    small: "md:col-span-1 md:row-span-1"
  }[size];

  return (
    <div 
      className={`${gridClass} relative group overflow-hidden rounded-[2.5rem] transition-all duration-700 ease-in-out ${color || 'bg-slate-100'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Imagen de Fondo (Se desvanece al hacer hover si hay productos) */}
      <img 
        src={category.imageUrl} 
        alt={category.name}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${isHovered && category.products.length > 0 ? 'opacity-20 scale-110 blur-sm' : 'opacity-100'}`}
      />

      {/* Capa de Slideshow de Productos (Solo visible en Hover) */}
      {isHovered && category.products.length > 0 && (
        <div className="absolute inset-0 flex items-center justify-center animate-in fade-in zoom-in duration-500">
          <div className="text-center p-6">
            <div className="relative w-48 h-48 md:w-56 md:h-56 mx-auto mb-4 rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
              {category.products.map((product, idx) => (
                <img
                  key={product.id}
                  src={product.imageUrl}
                  alt={product.name}
                  className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${idx === currentIndex ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}
                />
              ))}
            </div>
            <h4 className="text-lg font-bold text-slate-800 animate-in slide-in-from-bottom-2">
              {category.products[currentIndex].name}
            </h4>
            <button className="mt-4 bg-primary text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 mx-auto hover:scale-105 transition-transform shadow-lg shadow-primary/20">
              <ShoppingCart size={14} /> Cotizar ahora
            </button>
          </div>
        </div>
      )}

      {/* Degradado para texto base */}
      <div className={`absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent transition-opacity duration-700 ${isHovered ? 'opacity-0' : 'opacity-100'}`}></div>

      {/* Información Base (Categoría) */}
      <div className={`absolute bottom-8 left-8 text-white transition-all duration-500 ${isHovered ? 'opacity-0 -translate-y-4' : 'opacity-100'}`}>
        <div className="h-10 w-10 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-4 border border-white/20">
          {React.cloneElement(icon as React.ReactElement, { className: "text-white w-6 h-6" })}
        </div>
        <h3 className={`${size === 'large' ? 'text-3xl' : 'text-xl'} font-bold mb-1`}>{category.name}</h3>
        <p className="text-white/70 text-xs max-w-[200px]">{category.description}</p>
      </div>

      {/* Botón "Más" esquina superior */}
      <div className={`absolute top-8 right-8 transition-all duration-700 ${isHovered ? 'scale-0' : 'scale-100'}`}>
        <div className="bg-white/20 backdrop-blur-md p-3 rounded-full text-white border border-white/10">
          <ArrowUpRight size={20} />
        </div>
      </div>
    </div>
  );
}
