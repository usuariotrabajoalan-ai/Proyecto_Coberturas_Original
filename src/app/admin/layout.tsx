import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Users, MapPin, Briefcase, FileSpreadsheet } from "lucide-react";
import LogoutButton from "@/components/LogoutButton";
import Logo from "@/components/Logo";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-[#FFFAF4] flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-stone-900 border-r border-stone-800 shadow-2xl relative z-20">
        <div className="h-full flex flex-col">
          <div className="h-24 flex items-center px-6 border-b border-stone-800">
            <div className="flex items-center justify-center w-full bg-white py-2 px-4 rounded-xl shadow-inner">
              <Logo />
            </div>
          </div>
          
          <nav className="flex-1 px-4 py-8 space-y-2">
            <Link href="/admin/empleados" className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-stone-300 hover:text-white hover:bg-stone-800 transition-all font-bold group">
              <Users size={20} className="text-stone-500 group-hover:text-red-400 transition-colors" /> 
              <span>Personal</span>
            </Link>
            <Link href="/admin/lugares" className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-stone-300 hover:text-white hover:bg-stone-800 transition-all font-bold group">
              <MapPin size={20} className="text-stone-500 group-hover:text-red-400 transition-colors" /> 
              <span>Espacios</span>
            </Link>
            <Link href="/admin/trabajos" className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-stone-300 hover:text-white hover:bg-stone-800 transition-all font-bold group">
              <Briefcase size={20} className="text-stone-500 group-hover:text-red-400 transition-colors" /> 
              <span>Trabajos</span>
            </Link>
            <Link href="/admin/reportes" className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-stone-300 hover:text-white hover:bg-stone-800 transition-all font-bold group">
              <FileSpreadsheet size={20} className="text-stone-500 group-hover:text-red-400 transition-colors" /> 
              <span>Reportes</span>
            </Link>
          </nav>
          <div className="p-4 border-t border-stone-800">
            <LogoutButton className="flex items-center w-full px-4 py-3.5 rounded-xl text-stone-400 hover:text-red-400 hover:bg-red-950/50 transition-all group font-bold" />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden relative">
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-orange-100 flex items-center px-10 justify-between sticky top-0 z-10">
          <h2 className="text-lg font-semibold text-stone-800">Panel de Control</h2>
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end">
              <span className="text-sm font-bold text-stone-800 leading-tight">{session.user.name}</span>
              <span className="text-xs font-medium text-stone-500">Administrador</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-orange-100 to-orange-50 border-2 border-white shadow-sm flex items-center justify-center text-red-800 font-bold">
              {session.user.name?.charAt(0) || "A"}
            </div>
          </div>
        </header>
        <div className="flex-1 overflow-auto p-10">
          {children}
        </div>
      </main>
    </div>
  );
}
