"use client";

import { useState } from "react";

export default function CopyCredentialsButton({ name, document }: { name: string, document: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const text = `Hola ${name}, tus accesos al Sistema de Cobertura son:\n🔗 Enlace: https://afemec-limpieza.com\n👤 Usuario: ${document}\n🔑 Contraseña: ${document}\n(Ingresa con tu C.I.)`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button 
      onClick={handleCopy}
      className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm ${copied ? 'bg-green-100 text-green-700 border-green-200' : 'bg-white border-slate-200 text-slate-600 hover:text-green-600 hover:border-green-200 hover:bg-green-50'} border`}
      title="Copiar datos para enviar por WhatsApp"
    >
      {copied ? "✅ Copiado!" : "💬 Copiar para WhatsApp"}
    </button>
  );
}
