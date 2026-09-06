import { SignIn } from "@clerk/nextjs";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-black to-slate-800 text-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="h-12 w-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.1)]">
             <span className="text-white font-bold text-2xl font-playfair">W</span>
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extralight text-slate-50 font-playfair tracking-tight">
          Whitecarrot
        </h2>
        <p className="mt-2 text-center text-sm font-mono text-slate-400 tracking-wider uppercase">
          Sign in to your account
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-black/40 backdrop-blur-md py-8 px-4 shadow-[0_0_30px_rgba(0,0,0,0.5)] sm:rounded-2xl sm:px-10 flex justify-center border border-white/10">
          <SignIn 
            routing="path" 
            path="/login" 
            appearance={{
              elements: {
                footerAction: { display: "none" }
              }
            }}
          />
        </div>
        <p className="mt-6 text-center text-xs text-slate-500 font-mono tracking-wider">
          STILLNESS SPEAKS. OBSERVE, ACCEPT, LET GO.
        </p>
      </div>
    </div>
  );
}
