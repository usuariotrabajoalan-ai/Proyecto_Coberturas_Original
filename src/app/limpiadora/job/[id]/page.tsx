import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import ImageModal from "@/components/ImageModal";
import FinishJobForm from "./FinishJobForm";

export default async function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  const resolvedParams = await params;
  
  const job = await prisma.job.findUnique({
    where: { id: resolvedParams.id },
    include: { location: true }
  });

  if (!job || job.userId !== session?.user?.id || job.status === "COMPLETED") {
    redirect("/personal");
  }

  return (
    <div className="space-y-6 pb-8">
      <div className="flex items-center gap-2 mb-2">
        <Link href="/personal" className="flex items-center gap-1 text-slate-500 font-medium hover:text-blue-600 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
          Volver a mis trabajos
        </Link>
      </div>
      
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="font-extrabold text-2xl text-slate-800 tracking-tight">{job.location.name}</h2>
            <p className="text-slate-500 font-medium flex items-center gap-2 mt-1">
              <span className="text-blue-500">📍</span> {job.location.campus}
            </p>
          </div>
          <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-2xl font-bold shadow-inner">
            {job.startTime}
          </div>
        </div>
        
        <div className="pt-4 border-t border-slate-100">
          <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Fecha del Evento</p>
          <p className="text-slate-700 font-medium">{job.date.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
      </div>

      {job.imageUrl && (
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Datos Generales</p>
          <ImageModal src={job.imageUrl} alt="Evento" />
        </div>
      )}

      <div className="bg-white p-6 rounded-3xl shadow-lg shadow-slate-200/50 border border-slate-100">
        <FinishJobForm jobId={job.id} />
      </div>
    </div>
  );
}
