"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Users, MapPin, Briefcase, FileSpreadsheet, Menu, X } from "lucide-react";
import LogoutButton from "@/components/LogoutButton";
import Logo from "@/components/Logo";

export default function MobileAdminSidebar({ userName, initial }: { userName: string, initial: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const links = [
    { href: "/admin/empleados", icon: Users, label: "Personal" },
    { href: "/admin/lugares", icon: MapPin, label: "Espacios" },
    { href: "/admin/trabajos", icon: Briefcase, label: "Trabajos" },
    { href: "/admin/reportes", icon: FileSpreadsheet, label: "Informes" },
  ];

  return (
    <>
      {/* Mobile Topbar */}
      <div className="md:hidden bg-white border-b border-stone-200 p-4 flex items-center justify-between sticky top-0 z-40 shadow-sm">
        <div className="h-8 w-24 relative">
          <Logo className="h-full object-contain" />
        </div>
        <button onClick={() => setIsOpen(true)} className="p-2 bg-stone-100 rounded-lg text-stone-600">
          <Menu size={24} />
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 bg-stone-900/50 z-50 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
      )}

      {/* Sidebar (Desktop & Mobile) */}
      <aside className={`fixed inset-y-0 left-0 w-72 bg-stone-900 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"} flex flex-col`}>
        <div className="h-24 flex items-center justify-between px-6 border-b border-stone-800">
          <div className="flex items-center justify-center w-full bg-white py-3 px-4 rounded-xl shadow-inner h-14">
            <Logo className="h-10 object-contain" />
          </div>
          <button onClick={() => setIsOpen(false)} className="md:hidden ml-4 text-stone-400 hover:text-white">
            <X size={24} />
          </button>
        </div>
        
        <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
          {links.map((link) => {
            const isActive = pathname.startsWith(link.href);
            return (
              <Link 
                key={link.href} 
                href={link.href} 
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all font-bold group ${isActive ? 'bg-orange-600 text-white shadow-md shadow-orange-500/20' : 'text-stone-300 hover:text-white hover:bg-stone-800'}`}
              >
                <link.icon size={20} className={isActive ? 'text-orange-200' : 'text-stone-500 group-hover:text-red-400 transition-colors'} /> 
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-stone-800">
          <div className="bg-stone-950 rounded-2xl p-4 flex flex-col gap-4 border border-stone-800">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-sm font-bold text-white leading-tight truncate w-32">{userName}</span>
                <span className="text-xs font-medium text-stone-500">Administrador</span>
              </div>
              <div className="w-10 h-10 shrink-0 rounded-full bg-gradient-to-tr from-orange-500 to-red-500 border-2 border-stone-800 shadow-sm flex items-center justify-center text-white font-bold">
                {initial}
              </div>
            </div>
            <LogoutButton />
          </div>
        </div>
      </aside>
    </>
  );
}
