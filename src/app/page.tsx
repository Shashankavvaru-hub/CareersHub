import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import DigitalSerenity from "@/components/ui/digital-serenity-animated-landing-page";

import { HoverFooter } from "@/components/ui/hover-footer";

export default async function Home() {
  const { userId } = await auth();

  // If the user is authenticated, redirect them directly to the main app dashboard.
  if (userId) {
    redirect('/dashboard');
  }

  return (
    <div className="bg-[#0A0F1E] min-h-screen">
      <DigitalSerenity />
      <HoverFooter />
    </div>
  );
}
