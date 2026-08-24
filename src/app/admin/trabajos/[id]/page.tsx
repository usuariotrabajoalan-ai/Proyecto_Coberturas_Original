import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { revalidatePath } from "next/cache";
import ImageModal from "@/components/ImageModal";

async function deleteJob(formData: FormData) {
  "use server";
  const id = formData.get("id") as string;
  await prisma.job.delete({ where: { id } });
  revalidatePath("/admin/trabajos");
  redirect("/admin/trabajos");
}

async function updateJob(formData: FormData) {
  "use server";
  const id = formData.get("id") as string;
  const userId = formData.get("userId") as string;
  const locationId = formData.get("locationId") as string;
  const dateStr = formData.get("date") as string;
  const startTime = formData.get("startTime") as string;
  
  await prisma.job.update({
    where: { id },
    data: {
      userId,
      locationId,
      date: new Date(dateStr),
      startTime
    }
  });
  revalidatePath("/admin/trabajos");
  revalidatePath(`/admin/trabajos/${id}`);
}

export default async function AdminJobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const job = await prisma.job.findUnique({
    where: { id: resolvedParams.id },
    include: {
      user: true,
      location: true
    }
  });

  if (!job) {
    redirect("/admin/trabajos");
  }

  const empleados = await prisma.user.findMany({ where: { role: "CLEANER" } });
  const lugares = await prisma.location.findMany();

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/trabajos" className="w-10 h-10 bg-white rounded-xl shadow-sm border border-slate-200 flex items-center justify-center text-slate-500 hover:text-blue-600 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
          </Link>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Detalles del Trabajo</h1>
        </div>
        
        <form action={deleteJob}>
          <input type="hidden" name="id" value={job.id} />
          <button type="submit" className="px-5 py-2.5 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 rounded-xl font-bold transition-colors flex items-center gap-2 border border-red-100">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
            Eliminar Trabajo
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Formulario de Modificación */}
        <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 relative">
          <h2 className="text-xl font-bold text-slate-800 mb-6 border-b border-slate-100 pb-4">Modificar Asignación</h2>
          <form action={updateJob} className="space-y-6">
            <input type="hidden" name="id" value={job.id} />
            
            <div>
              <label className="block text-sm font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Personal Asignado</label>
              <select name="userId" defaultValue={job.userId} disabled={job.status === 'COMPLETED'} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 font-medium transition-all appearance-none disabled:opacity-50">
                {empleados.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Lugar</label>
              <select name="locationId" defaultValue={job.locationId} disabled={job.status === 'COMPLETED'} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 font-medium transition-all appearance-none disabled:opacity-50">
                {lugares.map(l => <option key={l.id} value={l.id}>{l.name} - {l.campus}</option>)}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Fecha</label>
                <input type="date" name="date" defaultValue={job.date.toISOString().split('T')[0]} disabled={job.status === 'COMPLETED'} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 font-medium transition-all disabled:opacity-50" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Hora Inicio</label>
                <input type="time" name="startTime" defaultValue={job.startTime} disabled={job.status === 'COMPLETED'} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 font-medium transition-all disabled:opacity-50" />
              </div>
            </div>

            {job.status === 'COMPLETED' ? (
              <div className="p-4 bg-green-50 border border-green-100 rounded-2xl text-green-700 text-sm font-medium flex items-start gap-3">
                <span className="text-xl">✅</span>
                <p>Este trabajo ya fue finalizado por la personal y no se puede modificar. Si hubo un error, por favor elimínelo y cree uno nuevo.</p>
              </div>
            ) : (
              <button type="submit" className="w-full py-3.5 bg-slate-900 text-white rounded-2xl hover:bg-slate-800 font-bold shadow-lg shadow-slate-900/20 hover:shadow-xl hover:-translate-y-0.5 transition-all">
                Guardar Cambios
              </button>
            )}
          </form>
        </div>

        {/* Visor de Imágenes e Info */}
        <div className="space-y-8">
          <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
            <h2 className="text-xl font-bold text-slate-800 mb-6 border-b border-slate-100 pb-4 flex justify-between items-center">
              <span>Estado de Finalización</span>
              <span className={`px-3 py-1 text-xs rounded-full font-bold uppercase tracking-wider shadow-sm ${job.status === 'COMPLETED' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-amber-100 text-amber-700 border border-amber-200'}`}>
                {job.status === 'COMPLETED' ? 'Finalizado' : 'Pendiente'}
              </span>
            </h2>
            
            {job.status === 'COMPLETED' ? (
              <div className="space-y-6">
                <div>
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Observaciones de la Personal</p>
                  <p className="text-slate-700 p-4 bg-slate-50 rounded-2xl border border-slate-100 font-medium">{job.notes || "No dejó observaciones."}</p>
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Firma</p>
                  {job.signatureUrl ? (
                    <div className="bg-white border-2 border-slate-100 rounded-2xl p-2 inline-block">
                      <img src={job.signatureUrl} alt="Firma" className="h-24 object-contain" />
                    </div>
                  ) : (
                    <p className="text-slate-500 italic">No hay firma registrada.</p>
                  )}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Hora Exacta de Finalización</p>
                  <p className="text-slate-700 font-bold">{job.endTime?.toLocaleString('es-ES')}</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <span className="text-4xl mb-4 block">⏳</span>
                <p className="text-slate-500 font-medium">La personal aún no ha finalizado este trabajo. La firma y observaciones aparecerán aquí cuando lo haga.</p>
              </div>
            )}
          </div>

          {job.imageUrl && (
            <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
              <h2 className="text-xl font-bold text-slate-800 mb-6 border-b border-slate-100 pb-4">Foto / Datos del Evento</h2>
              <ImageModal src={job.imageUrl} alt="Evento" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
