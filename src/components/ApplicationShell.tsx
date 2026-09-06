import { UserButton } from "@clerk/nextjs";
import Link from "next/link";

export function ApplicationShell({ children, currentCompanyName }: { children: React.ReactNode, currentCompanyName?: string }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-black to-slate-800 text-slate-100 font-sans selection:bg-slate-700 selection:text-white">
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
