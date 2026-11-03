"use client";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useNarrow } from "@/hooks/use-media";
import { Modals } from "@/components/modals/modals";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";

export function OwnerShell({ children }: { children: React.ReactNode }) {
  const narrow = useNarrow(960);
  const pathname = usePathname();
  // the drawer remembers the route it was opened on, so navigating closes it
  const [drawerAt, setDrawerAt] = useState<string | null>(null);
  const drawer = narrow && drawerAt === pathname;
  const setDrawer = (open: boolean) => setDrawerAt(open ? pathname : null);

  return (
    <div className="flex min-h-screen bg-white">
      {narrow && drawer && <div onClick={() => setDrawer(false)} className="fixed inset-0 z-40 bg-[rgba(24,24,27,.35)]" />}
      <Sidebar narrow={narrow} open={drawer} onClose={() => setDrawer(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar narrow={narrow} onMenu={() => setDrawer(true)} />
        <main className="mx-auto flex w-full max-w-[1480px] flex-col gap-5 px-[clamp(16px,2.2vw,28px)] pt-6 pb-8">{children}</main>
      </div>
      <Modals />
    </div>
  );
}
