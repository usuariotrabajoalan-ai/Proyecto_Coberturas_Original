import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import CopyCredentialsButton from "@/components/CopyCredentialsButton";

async function deleteEmployee(formData: FormData) {
  "use server";
  const id = formData.get("id") as string;
  await prisma.user.delete({ where: { id } });
  revalidatePath("/admin/empleados");
  redirect("/admin/empleados");
}

async function resetPassword(formData: FormData) {
  "use server";
  const id = formData.get("id") as string;
  const document = formData.get("document") as string;
  
  const hashedPassword = await bcrypt.hash(document, 10);
  await prisma.user.update({
    where: { id },
    data: { password: hashedPassword }
  });
  revalidatePath("/admin/empleados");
  revalidatePath(`/admin/empleados/${id}`);
}

async function updatePassword(formData: FormData) {
  "use server";
  const id = formData.get("id") as string;
  const newPassword = formData.get("newPassword") as string;
  
  if (newPassword.length < 4) return; // Basic validation

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({
    where: { id },
    data: { password: hashedPassword }
  });
  revalidatePath("/admin/empleados");
  revalidatePath(`/admin/empleados/${id}`);
}

async function updatePhone(formData: FormData) {
  "use server";
  const id = formData.get("id") as string;
  const phone = formData.get("phone") as string;
  
  await prisma.user.update({
    where: { id },
    data: { phone: phone || null }
  });
  revalidatePath("/admin/empleados");
  revalidatePath(`/admin/empleados/${id}`);
}

export default async function EmployeeDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const emp = await prisma.user.findUnique({
    where: { id: resolvedParams.id }
  });

  if (!emp || emp.role !== "CLEANER") {
    redirect("/admin/empleados");
  }

  // Count jobs for stats
  const totalJobs = await prisma.job.count({ where: { userId: emp.id } });
  const completedJobs = await prisma.job.count({ where: { userId: emp.id, status: "COMPLETED" } });

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/empleados" className="w-10 h-10 bg-white rounded-xl shadow-sm border border-slate-200 flex items-center justify-center text-slate-500 hover:text-blue-600 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
          </Link>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Gestionar Personal</h1>
        </div>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 relative">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-black text-2xl shadow-inner">
              {emp.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-800">{emp.name}</h2>
              <p className="text-slate-500 font-medium">Documento / C.I: <span className="font-mono bg-slate-100 px-2 py-1 rounded text-slate-700">{emp.document}</span></p>
              {emp.phone && <p className="text-slate-500 font-medium mt-1">Teléfono: <span className="font-mono bg-green-50 text-green-700 px-2 py-1 rounded border border-green-200">{emp.phone}</span></p>}
            </div>
          </div>
          <div className="flex gap-4">
            <div className="text-center bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100">
              <p className="text-2xl font-black text-slate-800">{totalJobs}</p>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Asignados</p>
            </div>
            <div className="text-center bg-green-50 px-4 py-2 rounded-2xl border border-green-100">
              <p className="text-2xl font-black text-green-700">{completedJobs}</p>
              <p className="text-xs font-bold text-green-600/70 uppercase tracking-widest">Finalizados</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
          {/* Columna Izquierda: Acceso */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">Compartir Accesos</h3>
              <p className="text-sm text-slate-500 mb-4">Copia los datos de este personal para enviarlos rápidamente por WhatsApp.</p>
              <CopyCredentialsButton name={emp.name} document={emp.document} />
            </div>

            <div className="pt-6 border-t border-slate-100">
              <h3 className="text-lg font-bold text-slate-800 mb-2">Teléfono WhatsApp</h3>
              <p className="text-sm text-slate-500 mb-4">Actualiza el número para notificaciones automáticas.</p>
              <form action={updatePhone} className="space-y-3">
                <input type="hidden" name="id" value={emp.id} />
                <input 
                  type="text" 
                  name="phone" 
                  defaultValue={emp.phone || ""}
                  placeholder="Ej. 0981123456"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 font-medium transition-all"
                />
                <button type="submit" className="px-5 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-all w-full shadow-sm">
                  Guardar Teléfono
                </button>
              </form>
            </div>

            <div className="pt-6 border-t border-slate-100">
              <h3 className="text-lg font-bold text-slate-800 mb-2">Cambiar Contraseña Manualmente</h3>
              <p className="text-sm text-slate-500 mb-4">Establece una contraseña nueva y personalizada para este personal.</p>
              <form action={updatePassword} className="space-y-3">
                <input type="hidden" name="id" value={emp.id} />
                <input 
                  type="text" 
                  name="newPassword" 
                  required
                  placeholder="Escribe la nueva contraseña..."
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 font-medium transition-all"
                />
                <button type="submit" className="px-5 py-3 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-900 transition-all w-full">
                  Guardar Nueva Contraseña
                </button>
              </form>
            </div>
          </div>

          {/* Columna Derecha: Peligro */}
          <div className="space-y-6">
            <div className="p-6 bg-amber-50 rounded-2xl border border-amber-100">
              <h3 className="text-lg font-bold text-amber-800 mb-2">Restaurar Contraseña</h3>
              <p className="text-sm text-amber-700/80 mb-4">Si el personal olvidó su clave, puedes restablecerla para que vuelva a ser su número de C.I.</p>
              <form action={resetPassword}>
                <input type="hidden" name="id" value={emp.id} />
                <input type="hidden" name="document" value={emp.document} />
                <button type="submit" className="px-5 py-3 bg-white text-amber-600 border border-amber-200 rounded-xl font-bold hover:bg-amber-100 transition-all w-full shadow-sm">
                  🔄 Resetear al C.I. original
                </button>
              </form>
            </div>

            <div className="p-6 bg-red-50 rounded-2xl border border-red-100">
              <h3 className="text-lg font-bold text-red-800 mb-2">Zona de Peligro</h3>
              <p className="text-sm text-red-700/80 mb-4">Eliminar este usuario es irreversible. Perderá el acceso inmediatamente, pero sus trabajos finalizados se mantendrán en el registro.</p>
              <form action={deleteEmployee}>
                <input type="hidden" name="id" value={emp.id} />
                <button type="submit" className="px-5 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all w-full shadow-sm shadow-red-500/20">
                  🗑️ Eliminar Usuario Definitivamente
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
