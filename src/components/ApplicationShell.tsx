import { UserButton } from "@clerk/nextjs";
import Link from "next/link";

export function ApplicationShell({ children, currentCompanyName }: { children: React.ReactNode, currentCompanyName?: string }) {
  return (
    <div
      className="min-h-screen text-slate-100 font-sans selection:bg-slate-700 selection:text-white"
      style={{
        backgroundColor: '#0a0f1e',
        backgroundImage: `
          radial-gradient(ellipse 80% 60% at 20% 0%, rgba(99,102,241,0.12) 0%, transparent 60%),
          radial-gradient(ellipse 60% 50% at 80% 100%, rgba(16,185,129,0.08) 0%, transparent 60%),
          url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32'%3E%3Ccircle cx='1' cy='1' r='1' fill='%23ffffff' fill-opacity='0.06'/%3E%3C/svg%3E")
        `,
        backgroundSize: 'auto, auto, 32px 32px',
      }}
    >
      <header className="bg-black/40 backdrop-blur-md border-b border-white/10 sticky top-0 z-50 px-6 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="font-playfair font-bold text-xl tracking-tight text-white flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-sm">W</span>
            Whitecarrot
          </Link>
          {currentCompanyName && (
            <>
              <span className="text-slate-600">/</span>
              <span className="text-sm font-medium text-slate-300 tracking-wide">{currentCompanyName}</span>
            </>
          )}
        </div>
        <div>
          <UserButton />
        </div>
      </header>
      <main>
        {children}
      </main>
    </div>
  );
}
