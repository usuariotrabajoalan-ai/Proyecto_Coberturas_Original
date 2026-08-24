import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import Link from "next/link";

async function addEmployee(formData: FormData) {
  "use server";
  const name = formData.get("name") as string;
  const document = formData.get("document") as string;
  if (!name || !document) return;
  
  const hashedPassword = await bcrypt.hash(document, 10);
  try {
    await prisma.user.create({
      data: { name, document, password: hashedPassword, role: "CLEANER" }
    });
    revalidatePath("/admin/empleados");
  } catch (e) {
    console.error("Error creating user:", e);
  }
}

export default async function EmpleadosPage() {
  const empleados = await prisma.user.findMany({
    where: { role: "CLEANER" },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-slate-200 flex items-center justify-center">
            <span className="text-xl">👩‍🔧</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Personal de Cobertura</h1>
        </div>
      </div>
      
      <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 relative overflow-hidden">
        <h2 className="text-xl font-bold text-slate-800 mb-6">Alta de Nuevo Personal</h2>
        <form action={addEmployee} className="relative z-10 flex flex-col md:flex-row gap-6 items-start md:items-end">
          <div className="flex-1 w-full">
            <label className="block text-sm font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Nombre Completo</label>
            <input 
              type="text" 
              name="name" 
              required
              placeholder="Ej. Juan Pérez o Teresa Rolón" 
              className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 font-medium transition-all"
            />
          </div>
          <div className="flex-1 w-full">
            <label className="block text-sm font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Nro. de Documento (C.I.)</label>
            <input 
              type="text" 
              name="document" 
              required
              placeholder="Ej. 1234567" 
              className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 font-medium transition-all"
            />
          </div>
          <button type="submit" className="w-full md:w-auto px-8 py-3.5 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 font-bold shadow-lg shadow-blue-600/30 hover:shadow-xl hover:-translate-y-0.5 transition-all whitespace-nowrap">
            + Crear Usuario
          </button>
        </form>
        <div className="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-2xl text-blue-700 text-sm font-medium flex items-start gap-3">
          <span className="text-lg">💡</span>
          <p>Al crear al personal, el sistema automáticamente usará su <b>C.I. como usuario y como contraseña</b> inicial para que sea fácil ingresar.</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="px-8 py-4 font-bold text-xs uppercase tracking-wider text-slate-400">Personal</th>
              <th className="px-8 py-4 font-bold text-xs uppercase tracking-wider text-slate-400">Documento / Usuario</th>
              <th className="px-8 py-4 font-bold text-xs uppercase tracking-wider text-slate-400 text-right">Opciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {empleados.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-8 py-10 text-center text-slate-400 font-medium">No hay personal registrado en el sistema.</td>
              </tr>
            ) : (
              empleados.map((emp) => (
                <tr key={emp.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">{emp.name.charAt(0)}</div>
                      <span className="font-bold text-slate-800">{emp.name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="font-mono bg-slate-100 text-slate-600 px-3 py-1.5 rounded-xl inline-block text-sm font-bold border border-slate-200 shadow-sm">
                      {emp.document}
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <Link href={`/admin/empleados/${emp.id}`} className="inline-flex items-center justify-center px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-all shadow-sm group-hover:shadow">
                      ⚙️ Gestionar
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
