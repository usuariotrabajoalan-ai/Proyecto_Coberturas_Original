import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import MobileAdminSidebar from "@/components/MobileAdminSidebar";
import WakeBot from "@/components/WakeBot";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  const userName = session.user.name || "Usuario";
  const initial = userName.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-[#FFFAF4] flex flex-col md:flex-row font-sans">
      <WakeBot botUrl={process.env.WHATSAPP_BOT_URL} />
      <MobileAdminSidebar userName={userName} initial={initial} />

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden relative">
        <header className="hidden md:flex h-20 bg-white/80 backdrop-blur-md border-b border-orange-100 items-center px-10 justify-between sticky top-0 z-10">
          <h2 className="text-lg font-semibold text-stone-800">Panel de Control</h2>
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end">
              <span className="text-sm font-bold text-stone-800 leading-tight">{userName}</span>
              <span className="text-xs font-medium text-stone-500">Administrador</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-orange-100 to-orange-50 border-2 border-white shadow-sm flex items-center justify-center text-red-800 font-bold">
              {initial}
            </div>
          </div>
        </header>
        <div className="flex-1 overflow-auto p-4 md:p-10">
          {children}
        </div>
      </main>
    </div>
  );
}
