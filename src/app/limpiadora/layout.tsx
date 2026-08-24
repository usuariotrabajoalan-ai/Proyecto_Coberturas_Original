import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import LogoutButton from "@/components/LogoutButton";

export default async function PersonalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "CLEANER") {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-[#FFFAF4] flex flex-col max-w-md mx-auto shadow-[0_0_40px_rgba(234,88,12,0.1)] relative font-sans overflow-hidden">
      <header className="bg-white/80 backdrop-blur-xl border-b border-orange-100 px-6 py-5 sticky top-0 z-30">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="font-extrabold text-2xl text-stone-800 tracking-tight">Mis Trabajos</h1>
            <p className="text-sm font-medium text-red-800">Hola, {session.user.name}</p>
          </div>
          <LogoutButton />
        </div>
      </header>
      
      <main className="flex-1 overflow-auto p-6 bg-[#FFFAF4]">
        {children}
      </main>
    </div>
  );
}
