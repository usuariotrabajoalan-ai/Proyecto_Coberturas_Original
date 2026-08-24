import { prisma } from "@/lib/prisma";
import CompletedJobsTable from "./CompletedJobsTable";

export default async function ReportesPage() {
  const personals = await prisma.user.findMany({
    where: { role: "CLEANER" },
    orderBy: { name: 'asc' }
  });

  const completedJobs = await prisma.job.findMany({
    where: { status: 'COMPLETED' },
    orderBy: { endTime: 'desc' },
    take: 30, // Get the 30 most recently completed jobs
    include: {
      user: true,
      location: true
    }
  });

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-slate-200 flex items-center justify-center">
          <span className="text-xl">📊</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Reportes Mensuales</h1>
      </div>
      
      <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgba(234,88,12,0.04)] border border-orange-100 relative overflow-hidden">
        {/* Decoración de fondo */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-orange-50 rounded-full blur-3xl opacity-60 pointer-events-none"></div>

        <div className="relative z-10">
          <h2 className="text-xl font-bold text-stone-800 mb-6 flex items-center gap-2">
            Generar Reporte Excel
          </h2>
          
          <form action="/api/reports/excel" method="GET" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-bold text-stone-500 uppercase tracking-wider mb-2 ml-1">Mes</label>
                  <select 
                    name="month" 
                    required
                    defaultValue={new Date().getMonth() + 1}
                    className="w-full px-5 py-3.5 bg-[#FFFAF4] border border-orange-200/60 rounded-2xl focus:ring-4 focus:ring-red-800/20 focus:border-red-800 text-stone-700 font-bold transition-all shadow-sm appearance-none cursor-pointer"
                  >
                    <option value="1">Enero</option>
                    <option value="2">Febrero</option>
                    <option value="3">Marzo</option>
                    <option value="4">Abril</option>
                    <option value="5">Mayo</option>
                    <option value="6">Junio</option>
                    <option value="7">Julio</option>
                    <option value="8">Agosto</option>
                    <option value="9">Septiembre</option>
                    <option value="10">Octubre</option>
                    <option value="11">Noviembre</option>
                    <option value="12">Diciembre</option>
                  </select>
                </div>
                <div className="w-1/3">
                  <label className="block text-sm font-bold text-stone-500 uppercase tracking-wider mb-2 ml-1">Año</label>
                  <select 
                    name="year" 
                    required
                    defaultValue={new Date().getFullYear()}
                    className="w-full px-5 py-3.5 bg-[#FFFAF4] border border-orange-200/60 rounded-2xl focus:ring-4 focus:ring-red-800/20 focus:border-red-800 text-stone-700 font-bold transition-all shadow-sm appearance-none cursor-pointer"
                  >
                    <option value="2025">2025</option>
                    <option value="2026">2026</option>
                    <option value="2027">2027</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-stone-500 uppercase tracking-wider mb-2 ml-1">Personal</label>
                <select 
                  name="userId" 
                  required 
                  className="w-full px-5 py-3.5 bg-[#FFFAF4] border border-orange-200/60 rounded-2xl focus:ring-4 focus:ring-red-800/20 focus:border-red-800 text-stone-700 font-bold transition-all shadow-sm appearance-none cursor-pointer"
                >
                  <option value="all" className="font-bold">✨ Todo el personal (General)</option>
                  <optgroup label="Individuales">
                    {personals.map(emp => (
                      <option key={emp.id} value={emp.id}>{emp.name}</option>
                    ))}
                  </optgroup>
                </select>
              </div>
            </div>
            
            <div className="pt-4 flex justify-end">
              <button 
                type="submit" 
                className="px-8 py-3.5 bg-red-800 text-white rounded-2xl hover:bg-red-900 font-bold w-full md:w-auto shadow-lg shadow-red-900/20 hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
              >
                <span>Descargar Excel</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
              </button>
            </div>
          </form>
        </div>
      </div>

      <CompletedJobsTable jobs={completedJobs} personals={personals} />
    </div>
  );
}
