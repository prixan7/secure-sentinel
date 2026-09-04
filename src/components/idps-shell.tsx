import { Link, useRouterState, type LinkProps } from "@tanstack/react-router";
import { Activity, BellRing, BookOpenCheck, ChevronRight, Database, LayoutDashboard, Menu, ShieldAlert, ShieldCheck, Table2 } from "lucide-react";
import { useIdps } from "@/lib/idps-context";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

const navigation = [
  { label: "Dashboard", to: "/", icon: LayoutDashboard, dot: "brand" },
  { label: "Traffic Simulator", to: "/traffic-simulator", icon: Activity, dot: "mint" },
  { label: "Detection & Classification", to: "/detection", icon: ShieldAlert, dot: "sunny" },
  { label: "Prevention & Response", to: "/prevention", icon: ShieldCheck, dot: "lilac" },
  { label: "Security Logs", to: "/logs", icon: Table2, dot: "ink" },
] as const;

const defaultPageMeta = { eyebrow: "Overview", title: "Security Dashboard", subtitle: "Simulated traffic analysis & prevention at a glance" };
const pageMeta: Record<string, { eyebrow: string; title: string; subtitle: string }> = {
  "/": { eyebrow: "Overview", title: "Security Dashboard", subtitle: "Simulated traffic analysis & prevention at a glance" },
  "/traffic-simulator": { eyebrow: "Module 1", title: "Network Traffic Simulator", subtitle: "Generate simulated network events for IDPS testing." },
  "/detection": { eyebrow: "Module 2", title: "Detection & Classification", subtitle: "Apply simple, explainable rules to simulated traffic." },
  "/prevention": { eyebrow: "Module 3", title: "Prevention & Response", subtitle: "Review threats and take safe, simulated response actions." },
  "/logs": { eyebrow: "Audit Trail", title: "Security Logs", subtitle: "Review every simulated detection and response event." },
};

function Dot({ color }: { color: string }) {
  return <span className={cn("size-2 rounded-full", color === "brand" && "bg-brand", color === "mint" && "bg-mint", color === "sunny" && "bg-sunny", color === "lilac" && "bg-lilac", color === "ink" && "bg-ink/40")} />;
}

export function IdpsShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const meta = pageMeta[pathname] ?? defaultPageMeta;
  const { runDemo, generateTraffic, toast } = useIdps();

  return (
    <div className="min-h-screen bg-surface font-body text-ink">
      <div className="mx-auto flex min-h-screen max-w-[1480px]">
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-white/70 bg-surface-elevated/70 p-5 lg:flex">
          <Brand />
          <nav className="space-y-1.5" aria-label="Main navigation">
            {navigation.map((item) => <NavItem key={item.to} item={item} pathname={pathname} />)}
          </nav>
          <div className="mt-auto rounded-2xl border border-brand/15 bg-surface-elevated p-4 text-center shadow-sm">
            <p className="font-display text-sm font-bold">IDPS Prototype</p>
            <p className="mt-1 text-[11px] text-ink/45">Academic Demonstration</p>
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          <header className="border-b border-white/70 bg-surface/90 px-5 py-4 backdrop-blur lg:px-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <Button variant="ghost" size="icon" className="mt-1 lg:hidden" aria-label="Open navigation"><Menu /></Button>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">{meta.eyebrow}</p>
                  <h1 className="mt-1 font-display text-3xl font-bold leading-none tracking-tight">{meta.title}</h1>
                  <p className="mt-2 text-sm text-ink/50">{meta.subtitle}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="hidden items-center gap-1.5 rounded-full border border-mint/25 bg-mint-soft px-3 py-1.5 text-[11px] font-semibold text-mint sm:inline-flex"><span className="size-1.5 rounded-full bg-mint" />Simulation Only</span>
                {pathname === "/" && <Button variant="outline" className="hidden rounded-2xl border-black/5 bg-surface-elevated text-ink/70 shadow-sm sm:inline-flex" onClick={() => generateTraffic("random")}><Activity />Generate Sample Traffic</Button>}
                {pathname === "/" && <Button className="rounded-2xl bg-brand font-bold text-brand-foreground shadow-[0_10px_24px_-8px] shadow-brand/70 hover:bg-brand/90" onClick={runDemo}><BellRing />Run Demo Simulation</Button>}
              </div>
            </div>
            <div className="mt-4 flex gap-2 overflow-x-auto pb-1 lg:hidden">
              {navigation.map((item) => <NavItem key={item.to} item={item} pathname={pathname} mobile />)}
            </div>
          </header>
          <div className="p-5 lg:p-8">{children}</div>
        </main>
      </div>
      {toast && <div role="status" className="pop-in fixed bottom-5 right-5 z-50 flex max-w-sm items-start gap-3 rounded-2xl border border-brand/20 bg-surface-elevated px-4 py-3 shadow-xl"><span className="grid size-8 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand"><BellRing size={16} /></span><div><p className="text-sm font-bold">Simulation update</p><p className="mt-0.5 text-xs text-ink/60">{toast}</p></div></div>}
    </div>
  );
}

function Brand() {
  return <Link to="/" className="mb-8 flex items-center gap-3"><span className="grid size-11 place-items-center rounded-2xl bg-brand text-lg font-bold text-brand-foreground shadow-[0_8px_20px_-6px] shadow-brand/60">i</span><span><span className="block font-display text-lg font-bold leading-none">IDPS<span className="text-brand">.</span></span><span className="mt-0.5 block text-[11px] font-medium tracking-wide text-ink/50">Intrusion Guard</span></span></Link>;
}

function NavItem({ item, pathname, mobile = false }: { item: typeof navigation[number]; pathname: string; mobile?: boolean }) {
  const Icon = item.icon;
  const active = pathname === item.to;
  return <Link to={item.to} className={cn("flex shrink-0 items-center gap-3 rounded-2xl px-3.5 py-2.5 text-sm font-medium transition-colors", active ? "bg-brand-soft text-brand" : "text-ink/70 hover:bg-surface-elevated hover:text-ink", mobile && "border border-black/5 bg-surface-elevated px-3 text-xs shadow-sm")}><Dot color={item.dot} /><Icon size={16} className="hidden sm:block" /><span>{item.label}</span>{active && <ChevronRight size={14} className="ml-auto hidden sm:block" />}</Link>;
}