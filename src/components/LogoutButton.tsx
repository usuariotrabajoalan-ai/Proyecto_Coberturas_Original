"use client";

import { LogOut } from "lucide-react";

export default function LogoutButton({ className }: { className?: string }) {
  return (
    <button
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination
      onClick={() => window.location.href = "/api/auth/signout?callbackUrl=/login"}
      className={className || "flex items-center w-full px-4 py-3 rounded-2xl text-slate-500 hover:text-red-600 hover:bg-red-50 transition-all group font-bold"}
      title="Cerrar Sesión"
    >
      <LogOut size={22} className="group-hover:-translate-x-1 transition-transform" />
      <span className="ml-3">Cerrar Sesión / Salir</span>
    </button>
  );
}
