import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { writeFile } from "fs/promises";
import { join } from "path";

async function addJob(formData: FormData) {
  "use server";
  
  const userId = formData.get("userId") as string;
  const locationId = formData.get("locationId") as string;
  const dateStr = formData.get("date") as string;
  const startTime = formData.get("startTime") as string;
  const scheduledEndTime = formData.get("scheduledEndTime") as string;
  const image = formData.get("image") as File;
  
  if (!userId || !locationId || !dateStr || !startTime) return;

  let imageUrl = null;

  if (image && image.size > 0) {
    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Store image directly in the database as base64 to avoid Vercel filesystem errors
    const base64Image = `data:${image.type || 'image/png'};base64,${buffer.toString('base64')}`;
    imageUrl = base64Image;
  }

  // Create Date object
  const date = new Date(dateStr);

  await prisma.job.create({
    data: {
      userId,
      locationId,
      date,
      startTime,
      scheduledEndTime: scheduledEndTime || null,
      imageUrl,
      status: "PENDING"
    }
  });

  // SEND WHATSAPP NOTIFICATION
  try {
    const assignedUser = await prisma.user.findUnique({ where: { id: userId } });
    const loc = await prisma.location.findUnique({ where: { id: locationId } });
    
    if (assignedUser?.phone && process.env.WHATSAPP_BOT_URL) {
      const formattedDate = date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
      const msg = `🔔 *NUEVO TRABAJO ASIGNADO*\n\nHola *${assignedUser.name}*, tienes una nueva cobertura programada:\n\n📍 *Lugar:* ${loc?.name} - ${loc?.campus}\n📅 *Fecha:* ${formattedDate}\n⏰ *Hora:* ${startTime}${scheduledEndTime ? ` a ${scheduledEndTime}` : ''}\n\nPor favor, ingresa al sistema de coberturas para más detalles.`;
      
      fetch(`${process.env.WHATSAPP_BOT_URL}/api/whatsapp/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: assignedUser.phone, message: msg })
      }).catch(err => console.error("Error en fetch de WhatsApp:", err));
    }
  } catch (err) {
    console.error("Error preparando notificación de WhatsApp:", err);
  }
  
  revalidatePath("/admin/trabajos");
}

import Link from "next/link";

export default async function TrabajosPage() {
  const empleados = await prisma.user.findMany({ where: { role: "CLEANER" } });
  const lugares = await prisma.location.findMany();
  
  const trabajos = await prisma.job.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      user: true,
      location: true
    }
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-orange-200 flex items-center justify-center">
          <span className="text-xl">💼</span>
        </div>
        <h1 className="text-3xl font-extrabold text-stone-800 tracking-tight">Asignación de Trabajos</h1>
      </div>
      
      <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgba(234,88,12,0.04)] border border-orange-100 relative overflow-hidden">
        <h2 className="text-xl font-bold text-stone-800 mb-6">Crear Nuevo Trabajo</h2>
        <form action={addJob} className="space-y-6 text-stone-700 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
            <div className="lg:col-span-3">
              <label className="block text-sm font-bold text-stone-500 uppercase tracking-wider mb-2 ml-1">Personal Asignado</label>
              <select name="userId" required className="w-full px-5 py-3.5 bg-[#FFFAF4] border border-orange-200/60 rounded-2xl focus:ring-4 focus:ring-red-800/20 focus:border-red-800 font-bold transition-all appearance-none cursor-pointer" style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2364748b' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: `right 1rem center`, backgroundRepeat: `no-repeat`, backgroundSize: `1.5em 1.5em` }}>
                <option value="">Seleccione una personal...</option>
                {empleados.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
              </select>
            </div>
            <div className="lg:col-span-3">
              <label className="block text-sm font-bold text-stone-500 uppercase tracking-wider mb-2 ml-1">Lugar (Quincho/Salón)</label>
              <select name="locationId" required className="w-full px-5 py-3.5 bg-[#FFFAF4] border border-orange-200/60 rounded-2xl focus:ring-4 focus:ring-red-800/20 focus:border-red-800 font-bold transition-all appearance-none cursor-pointer" style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2364748b' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: `right 1rem center`, backgroundRepeat: `no-repeat`, backgroundSize: `1.5em 1.5em` }}>
                <option value="">Seleccione un lugar...</option>
                {lugares.map(l => <option key={l.id} value={l.id}>{l.name} - {l.campus}</option>)}
              </select>
            </div>
            <div className="lg:col-span-2">
              <label className="block text-sm font-bold text-stone-500 uppercase tracking-wider mb-2 ml-1">Fecha del Evento</label>
              <input type="date" name="date" required className="w-full px-5 py-3.5 bg-[#FFFAF4] border border-orange-200/60 rounded-2xl focus:ring-4 focus:ring-red-800/20 focus:border-red-800 font-bold transition-all" />
            </div>
            <div className="lg:col-span-1">
              <label className="block text-sm font-bold text-stone-500 uppercase tracking-wider mb-2 ml-1">Hora Inicio</label>
              <input type="time" name="startTime" required className="w-full px-5 py-3.5 bg-[#FFFAF4] border border-orange-200/60 rounded-2xl focus:ring-4 focus:ring-red-800/20 focus:border-red-800 font-bold transition-all" />
            </div>
            <div className="lg:col-span-1">
              <label className="block text-sm font-bold text-stone-500 uppercase tracking-wider mb-2 ml-1">Hora Fin</label>
              <input type="time" name="scheduledEndTime" className="w-full px-5 py-3.5 bg-[#FFFAF4] border border-orange-200/60 rounded-2xl focus:ring-4 focus:ring-red-800/20 focus:border-red-800 font-bold transition-all" />
            </div>
            <div className="lg:col-span-2">
              <label className="block text-sm font-bold text-stone-500 uppercase tracking-wider mb-2 ml-1">Imagen (Datos del Evento)</label>
              <input type="file" name="image" accept="image/*" className="w-full px-5 py-3 bg-[#FFFAF4] border border-orange-200/60 rounded-2xl focus:ring-4 focus:ring-red-800/20 focus:border-red-800 font-bold transition-all file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-orange-100 file:text-red-900 hover:file:bg-orange-200" />
            </div>
          </div>
          
          <div className="pt-2 flex justify-end">
            <button type="submit" className="px-8 py-3.5 bg-red-800 text-white rounded-2xl hover:bg-red-900 font-bold w-full md:w-auto shadow-lg shadow-red-900/20 hover:shadow-xl hover:-translate-y-0.5 transition-all">
              + Asignar Trabajo
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgba(234,88,12,0.04)] border border-orange-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#FFFAF4] border-b border-orange-100">
              <th className="px-8 py-4 font-bold text-xs uppercase tracking-wider text-stone-400">Fecha y Hora</th>
              <th className="px-8 py-4 font-bold text-xs uppercase tracking-wider text-stone-400">Lugar</th>
              <th className="px-8 py-4 font-bold text-xs uppercase tracking-wider text-stone-400">Asignado a</th>
              <th className="px-8 py-4 font-bold text-xs uppercase tracking-wider text-stone-400">Estado</th>
              <th className="px-8 py-4 font-bold text-xs uppercase tracking-wider text-stone-400 text-right">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-orange-50 text-stone-700">
            {trabajos.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-8 py-10 text-center text-stone-400 font-medium">No hay trabajos asignados todavía.</td>
              </tr>
            ) : (
              trabajos.map((job) => (
                <tr key={job.id} className="hover:bg-orange-50/30 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="font-bold text-stone-800">{job.date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
                    <div className="text-sm text-stone-500 font-medium">{job.startTime} {job.scheduledEndTime ? `- ${job.scheduledEndTime}` : ''} hs</div>
                  </td>
                  <td className="px-8 py-5 font-bold text-stone-700">{job.location.name}</td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-xs font-bold text-red-800">{job.user.name.charAt(0)}</div>
                      <span className="font-medium">{job.user.name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`px-3 py-1 text-xs rounded-full font-bold uppercase tracking-wider shadow-sm ${job.status === 'COMPLETED' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-orange-100 text-orange-700 border border-orange-200'}`}>
                      {job.status === 'COMPLETED' ? 'Finalizado' : 'Pendiente'}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <Link href={`/admin/trabajos/${job.id}`} className="inline-flex items-center justify-center px-4 py-2 bg-white border border-orange-200 rounded-xl text-sm font-bold text-stone-600 hover:text-red-700 hover:border-red-200 hover:bg-orange-50 transition-all shadow-sm group-hover:shadow">
                      Ver Detalles
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
