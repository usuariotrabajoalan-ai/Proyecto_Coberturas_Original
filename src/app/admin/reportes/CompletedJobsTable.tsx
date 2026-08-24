"use client";

import { useState } from "react";
import Link from "next/link";

type Job = {
  id: string;
  endTime: Date | null;
  location: { name: string };
  user: { name: string };
};

export default function CompletedJobsTable({ jobs, personals }: { jobs: Job[], personals: {id: string, name: string}[] }) {
  const [filterUserId, setFilterUserId] = useState("all");

  const filteredJobs = filterUserId === "all" ? jobs : jobs.filter(j => j.user.name === personals.find(l => l.id === filterUserId)?.name);

  return (
    <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgba(234,88,12,0.04)] border border-orange-100 overflow-hidden">
      <div className="p-8 border-b border-orange-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-stone-800 flex items-center gap-2">
            <span className="text-2xl">✅</span> Coberturas Finalizadas
          </h2>
          <p className="text-sm text-stone-500 mt-1">
            Historial en tiempo real de los trabajos que ya han concluido.
          </p>
        </div>
        <select 
          value={filterUserId}
          onChange={(e) => setFilterUserId(e.target.value)}
          className="px-4 py-2 bg-[#FFFAF4] border border-orange-200/60 rounded-xl focus:ring-4 focus:ring-red-800/20 focus:border-red-800 text-stone-700 font-bold transition-all shadow-sm outline-none"
        >
          <option value="all">Todo el personal</option>
          {personals.map(emp => (
            <option key={emp.id} value={emp.id}>{emp.name}</option>
          ))}
        </select>
      </div>

      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-[#FFFAF4] border-b border-orange-50">
            <th className="px-8 py-4 font-bold text-xs uppercase tracking-wider text-stone-400">Finalización</th>
            <th className="px-8 py-4 font-bold text-xs uppercase tracking-wider text-stone-400">Lugar</th>
            <th className="px-8 py-4 font-bold text-xs uppercase tracking-wider text-stone-400">Personal</th>
            <th className="px-8 py-4 font-bold text-xs uppercase tracking-wider text-stone-400 text-right">Acción</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-orange-50 text-stone-700">
          {filteredJobs.length === 0 ? (
            <tr>
              <td colSpan={4} className="px-8 py-10 text-center text-stone-400 font-medium">No hay coberturas finalizadas para este filtro.</td>
            </tr>
          ) : (
            filteredJobs.map((job) => (
              <tr key={job.id} className="hover:bg-orange-50/30 transition-colors group">
                <td className="px-8 py-5">
                  <div className="font-bold text-stone-800">{job.endTime ? new Date(job.endTime).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }) : '-'}</div>
                  <div className="text-sm text-stone-500 font-medium">{job.endTime ? new Date(job.endTime).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) : '-'} hs</div>
                </td>
                <td className="px-8 py-5 font-bold text-stone-700">{job.location.name}</td>
                <td className="px-8 py-5">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-xs font-bold text-red-800">{job.user.name.charAt(0)}</div>
                    <span className="font-medium">{job.user.name}</span>
                  </div>
                </td>
                <td className="px-8 py-5 text-right">
                  <Link href={`/admin/trabajos/${job.id}`} className="inline-flex items-center justify-center px-4 py-2 bg-white border border-orange-200 rounded-xl text-sm font-bold text-stone-600 hover:text-red-700 hover:border-red-200 hover:bg-orange-50 transition-all shadow-sm group-hover:shadow">
                    Ver Detalles y Firma
                  </Link>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
