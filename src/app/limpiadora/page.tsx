import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Image from "next/image";
import Link from "next/link";

export default async function PersonalPage() {
  const session = await getServerSession(authOptions);
  
  const jobs = await prisma.job.findMany({
    where: { 
      userId: session?.user?.id,
      status: "PENDING"
    },
    orderBy: { date: 'asc' },
    include: { location: true }
  });

  return (
    <div className="space-y-5">
      {jobs.length === 0 ? (
        <div className="text-center p-10 bg-white rounded-3xl border border-slate-200 shadow-sm">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🎉</span>
          </div>
          <p className="text-slate-600 font-medium">No tienes trabajos pendientes en este momento.</p>
        </div>
      ) : (
        jobs.map((job) => (
          <div key={job.id} className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgba(234,88,12,0.06)] border border-orange-50 overflow-hidden group hover:shadow-[0_8px_30px_rgba(234,88,12,0.12)] transition-all">
            {/* Cabecera con Color Vibrante */}
            <div className="p-6 bg-gradient-to-br from-red-800 via-red-900 to-stone-900 text-white relative overflow-hidden">
              {/* Círculos decorativos de fondo */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-orange-400/20 rounded-full blur-xl -ml-5 -mb-5"></div>
              
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-extrabold text-2xl leading-tight drop-shadow-sm">{job.location.name}</h3>
                  <span className="text-sm font-black text-red-900 bg-orange-50 px-3 py-1.5 rounded-2xl shadow-md">
                    {job.startTime} {job.scheduledEndTime ? `- ${job.scheduledEndTime}` : ''}
                  </span>
                </div>
                <div className="space-y-2 mt-4">
                  <p className="text-sm font-medium text-orange-50 flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs backdrop-blur-md">📅</span> 
                    {job.date.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
                  </p>
                  <p className="text-sm font-medium text-orange-50 flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs backdrop-blur-md">📍</span> 
                    {job.location.campus}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Cuerpo del Evento */}
            {job.imageUrl && (
              <div className="p-6 bg-orange-50/30">
                <p className="text-xs font-black text-stone-400 uppercase tracking-widest mb-3">Datos del Evento</p>
                <div className="relative w-full h-56 bg-white rounded-2xl overflow-hidden border border-orange-100 shadow-inner">
                  <Image 
                    src={job.imageUrl} 
                    alt="Evento" 
                    fill 
                    className="object-contain p-2"
                  />
                </div>
              </div>
            )}
            
            {/* Botón de Acción */}
            <div className="p-6 bg-white border-t border-orange-50">
              <Link 
                href={`/personal/job/${job.id}`}
                className="flex items-center justify-center w-full py-4 bg-gradient-to-r from-red-800 to-orange-600 text-white rounded-2xl font-black text-lg hover:from-red-900 hover:to-orange-700 transition-all shadow-lg shadow-red-900/20 active:scale-[0.98]"
              >
                Atender Trabajo
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
              </Link>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
