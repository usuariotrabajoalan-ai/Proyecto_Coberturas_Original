"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [document, setDocument] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const result = await signIn("credentials", {
        document,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Credenciales inválidas");
        setLoading(false);
      } else {
        // eslint-disable-next-line @next/next/no-location-assign-relative-destination
        window.location.href = "/";
      }
    } catch {
      setError("Ocurrió un error inesperado");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFFAF4]">
      
      <div className="max-w-md w-full mx-4 p-10 bg-white border border-orange-100 rounded-3xl shadow-[0_20px_60px_-15px_rgba(234,88,12,0.1)]">
        <div>
          <div className="w-32 h-32 mx-auto flex items-center justify-center mb-4">
            <img 
              src="/logo.jpg" 
              alt="AFEMEC Logo" 
              className="w-full h-full object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                if (e.currentTarget.nextElementSibling) {
                  (e.currentTarget.nextElementSibling as HTMLElement).style.display = 'flex';
                }
              }}
            />
            <div className="hidden w-20 h-20 bg-red-800 rounded-2xl flex items-center justify-center shadow-lg shadow-red-900/30">
              <span className="text-white font-extrabold text-3xl">AF</span>
            </div>
          </div>
          <h2 className="text-center text-3xl font-black text-stone-800 tracking-tight">
            Acceso al Sistema
          </h2>
          <p className="mt-3 text-center text-stone-500 font-medium">
            Ingresa tu C.I. para continuar
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={onSubmit}>
          <div className="space-y-5">
            <div>
              <label htmlFor="document" className="block text-sm font-bold text-stone-600 mb-2 ml-1 uppercase tracking-wider">Usuario / Documento</label>
              <input
                id="document"
                type="text"
                required
                className="block w-full px-5 py-4 bg-[#FFFAF4] border border-orange-200/60 text-stone-900 rounded-2xl focus:outline-none focus:ring-4 focus:ring-red-800/20 focus:border-red-800 transition-all font-bold text-lg"
                placeholder="Ej. 1234567"
                value={document}
                onChange={(e) => setDocument(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-bold text-stone-600 mb-2 ml-1 uppercase tracking-wider">Contraseña</label>
              <input
                id="password"
                type="password"
                required
                className="block w-full px-5 py-4 bg-[#FFFAF4] border border-orange-200/60 text-stone-900 rounded-2xl focus:outline-none focus:ring-4 focus:ring-red-800/20 focus:border-red-800 transition-all font-bold text-lg tracking-widest"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="text-red-800 text-sm font-bold text-center bg-red-50 border border-red-200 p-4 rounded-2xl">
              {error}
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-4 px-4 text-lg font-bold rounded-2xl text-white bg-red-800 hover:bg-red-900 focus:outline-none focus:ring-4 focus:ring-red-800/30 shadow-lg shadow-red-900/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Verificando datos..." : "Iniciar Sesión"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
