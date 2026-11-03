"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/icon";
import { Avatar, StatusChip } from "@/components/ui-collecto/primitives";
import { NAV, NAV_GROUPS, navFromPath } from "@/lib/nav";
import { matchCustomer } from "@/lib/selectors";
import { cn } from "@/lib/utils";
import { useAppStore, useDerived } from "@/store/app-store";

export function Sidebar({ narrow, open, onClose }: { narrow: boolean; open: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const { page } = navFromPath(pathname);
  const { data, D } = useDerived();
  const logout = useAppStore((s) => s.logout);
  const overdue = D.custs.filter((c) => c.status === "OVERDUE").length;

  return (
    <aside
      className={cn(
        "top-0 left-0 z-50 flex h-screen w-[252px] flex-none flex-col border-r border-line bg-subtle transition-transform duration-200 ease-out",
        narrow ? "fixed" : "sticky",
        narrow && !open && "-translate-x-full",
      )}
      aria-label="Main navigation"
    >
      <div className="flex items-center gap-2.5 px-4 pt-[18px] pb-3.5">
        <span className="grid size-[34px] flex-none place-items-center rounded-[10px] bg-ink shadow-[0_1px_2px_rgba(24,24,27,.25)]">
          <span className="size-[13px] rounded-[4px] border-[2.5px] border-white" />
        </span>
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="text-[17px] leading-[1.2] font-bold tracking-[.01em] text-ink">COLLECTO</span>
          <span className="truncate text-meta text-muted-ink">{data.shop.name}</span>
        </div>
      </div>

      <GlobalSearch onNavigate={onClose} />

      <nav className="flex flex-1 flex-col gap-px overflow-auto px-3 pt-1 pb-3">
        {NAV_GROUPS.map((g, gi) => (
          <div key={g.key} className="flex flex-col gap-px">
            {gi > 0 && <div className="mx-1.5 mt-3 h-px bg-line" />}
            <span className="flex-none px-2.5 pt-3.5 pb-1.5 text-meta font-medium text-muted-ink">{g.label}</span>
            {g.pages.map((k) => {
              const on = k === page;
              return (
                <Link
                  key={k}
                  href={NAV[k].href}
                  onClick={onClose}
                  aria-current={on ? "page" : undefined}
                  className={cn(
                    "navb flex h-[34px] flex-none items-center gap-2.5 rounded-lg px-2.5 text-13_5 font-medium hover:no-underline",
                    on ? "on bg-nav-active text-ink" : "text-nav-ink",
                  )}
                >
                  <Icon name={NAV[k].icon} size={17} style={{ color: on ? "#18181B" : "#71717A" }} />
                  <span className="min-w-0 flex-1">{NAV[k].label}</span>
                  {k === "customers" && overdue > 0 && (
                    <span className="grid h-5 min-w-5 place-items-center rounded-full bg-[#F43F5E] px-1.5 text-[11px] font-semibold text-white">{overdue}</span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="flex flex-col gap-px border-t border-line px-3 pt-2.5 pb-3.5">
        <span className="flex h-[34px] items-center gap-2.5 px-2.5 text-13 text-muted-ink">
          <Icon name="ic-sparkles" size={16} />
          Sell. Collect. Control.
        </span>
        <button
          onClick={logout}
          className="flex h-[34px] items-center gap-2.5 rounded-lg border-0 bg-transparent px-2.5 text-left text-13 font-medium text-muted-ink hover:bg-[#EEEEF0] hover:text-ink"
        >
          <Icon name="ic-logout" size={16} />
          Log out
        </button>
      </div>
    </aside>
  );
}

function GlobalSearch({ onNavigate }: { onNavigate: () => void }) {
  const router = useRouter();
  const { D } = useDerived();
  const [q, setQ] = useState("");
  const ref = useRef<HTMLInputElement>(null);
  const results = q.trim() ? D.custs.filter((c) => matchCustomer(c, q)).slice(0, 6) : [];

  // "/" focuses the search box (as in the prototype)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = document.activeElement;
      if (e.key === "/" && !(t && /INPUT|TEXTAREA|SELECT/.test(t.tagName))) {
        e.preventDefault();
        ref.current?.focus();
      }
      if (e.key === "Escape" && t === ref.current) setQ("");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="relative px-3 pt-0.5 pb-1.5">
      <div className="relative">
        <Icon name="ic-search" size={16} className="pointer-events-none absolute top-1/2 left-2.5 -translate-y-1/2 text-faint" />
        <input
          ref={ref}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search anything"
          aria-label="Search customers"
          className="h-9 w-full rounded-[9px] border border-line-input bg-white pr-[34px] pl-[33px] text-13_5 text-ink shadow-card"
        />
        <span className="pointer-events-none absolute top-1/2 right-2 grid h-5 min-w-5 -translate-y-1/2 place-items-center rounded-[5px] border border-line-input bg-subtle px-[5px] text-[11px] text-muted-ink">
          /
        </span>
      </div>
      {q.trim() && (
        <div className="absolute top-11 left-3 z-60 flex w-[min(340px,calc(100vw-24px))] flex-col rounded-xl border border-line-card bg-white p-1.5 shadow-pop">
          {results.map((c) => (
            <button
              key={c.id}
              onClick={() => {
                setQ("");
                onNavigate();
                router.push(`/customers/${c.id}`);
              }}
              className="flex items-center gap-2.5 rounded-lg border-0 bg-white p-2 text-left hover:bg-hover"
            >
              <Avatar id={c.id} name={c.name} photo={c.photo} size={30} />
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="text-13_5 font-semibold text-ink">{c.name}</span>
                <span className="text-meta text-muted-ink">
                  {c.nic} · {c.phone}
                </span>
              </span>
              <StatusChip status={c.status} />
            </button>
          ))}
          {!results.length && <div className="p-3 text-13 text-muted-ink">No customers match this search.</div>}
        </div>
      )}
    </div>
  );
}
