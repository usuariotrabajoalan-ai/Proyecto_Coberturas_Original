"use client";

import { useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";
import { finishJobAction } from "./actions";

export default function FinishJobForm({ jobId }: { jobId: string }) {
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState("");
  const sigCanvas = useRef<SignatureCanvas | null>(null);

  const handleClear = (e: React.MouseEvent) => {
    e.preventDefault();
    sigCanvas.current?.clear();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sigCanvas.current && sigCanvas.current.isEmpty()) {
      alert("Por favor, firme el trabajo antes de concluir.");
      return;
    }

    setLoading(true);
    const signatureData = sigCanvas.current ? sigCanvas.current.getTrimmedCanvas().toDataURL("image/png") : "";
    
    await finishJobAction({
      jobId,
      notes,
      signatureUrl: signatureData
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Observaciones</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 transition-all resize-none shadow-inner placeholder:text-slate-400"
          rows={3}
          placeholder="Escribe aquí cualquier detalle, problema o estado final de la limpieza..."
        ></textarea>
      </div>
      
      <div>
        <div className="flex justify-between items-center mb-3">
          <label className="block text-sm font-bold text-slate-400 uppercase tracking-wider">Firma Electrónica</label>
          <button 
            type="button" 
            onClick={handleClear} 
            className="text-xs font-bold text-red-500 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-full transition-colors"
          >
            Limpiar Firma
          </button>
        </div>
        <div className="border border-slate-200 rounded-2xl bg-white overflow-hidden shadow-inner focus-within:ring-4 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all">
          <SignatureCanvas 
            ref={sigCanvas}
            canvasProps={{
              className: 'signature-canvas w-full h-48 cursor-crosshair'
            }}
          />
        </div>
        <p className="text-xs text-slate-400 mt-2 text-center">Dibuja tu firma en el recuadro superior</p>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-2xl font-bold shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:hover:translate-y-0 active:scale-[0.98]"
      >
        {loading ? "Procesando y Guardando..." : "✅ Confirmar Finalización"}
      </button>
    </form>
  );
}
