import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

async function addLocation(formData: FormData) {
  "use server";
  const name = formData.get("name") as string;
  if (!name) return;
  
  await prisma.location.create({
    data: { name, campus: "Sede Social" }
  });
  revalidatePath("/admin/lugares");
}

async function deleteLocation(formData: FormData) {
  "use server";
  const id = formData.get("id") as string;
  await prisma.location.delete({ where: { id } });
  revalidatePath("/admin/lugares");
}

export default async function LugaresPage() {
  const lugares = await prisma.location.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Gestión de Quinchos y Salones</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-lg font-semibold mb-4">Agregar Nuevo Lugar</h2>
        <form action={addLocation} className="flex gap-4">
          <input 
            type="text" 
            name="name" 
            required
            placeholder="Ej. Quincho 10, Salón Galas" 
            className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          />
          <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Guardar
          </button>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="px-6 py-3 font-medium text-gray-600">Nombre</th>
              <th className="px-6 py-3 font-medium text-gray-600">Sede</th>
              <th className="px-6 py-3 font-medium text-gray-600 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y text-black">
            {lugares.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-4 text-center text-gray-500">No hay lugares registrados.</td>
              </tr>
            ) : (
              lugares.map((lugar) => (
                <tr key={lugar.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">{lugar.name}</td>
                  <td className="px-6 py-4 text-gray-500">{lugar.campus}</td>
                  <td className="px-6 py-4 text-right">
                    <form action={deleteLocation}>
                      <input type="hidden" name="id" value={lugar.id} />
                      <button type="submit" className="text-red-500 hover:text-red-700">Eliminar</button>
                    </form>
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
