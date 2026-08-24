"use client";

export default function Logo({ className = "h-10 object-contain" }: { className?: string }) {
  return (
    <>
      <img 
        src="/logo.jpg" 
        alt="AFEMEC Logo" 
        className={className}
        onError={(e) => {
          e.currentTarget.style.display = 'none';
          if (e.currentTarget.nextElementSibling) {
            (e.currentTarget.nextElementSibling as HTMLElement).style.display = 'flex';
          }
        }}
      />
      <div className="hidden items-center gap-3 w-full" style={{ display: 'none' }}>
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-md shadow-blue-500/20">
          <span className="text-white font-bold text-lg leading-none">A</span>
        </div>
        <span className="font-extrabold text-xl text-slate-800 tracking-tight">AFEMEC</span>
      </div>
    </>
  );
}
