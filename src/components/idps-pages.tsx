import { useMemo, useState } from "react";
import { ArrowDownToLine, CheckCircle2, CircleAlert, Database, Filter, Gauge, RefreshCw, Search, Shield, ShieldAlert, Sparkles, Trash2, WandSparkles, AreaChart as AreaIcon, BarChart3 } from "lucide-react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useIdps, type EventStatus, type Severity, type TrafficKind, type TrafficRecord } from "@/lib/idps-context";
import { cn } from "@/lib/utils";

const severityOrder: Severity[] = ["NORMAL", "LOW", "MEDIUM", "HIGH", "CRITICAL"];

function Panel({ children, className }: { children: React.ReactNode; className?: string }) {
  return <section className={cn("rounded-3xl border border-black/5 bg-surface-elevated p-5 shadow-sm lg:p-6", className)}>{children}</section>;
}

function StatusBadge({ value }: { value: Severity | EventStatus | string }) {
  const tone = value === "NORMAL" ? "bg-mint-soft text-mint" : value === "LOW" || value === "MEDIUM" || value === "MONITORED" ? "bg-sunny-soft text-sunny" : value === "BLOCKED" ? "bg-lilac-soft text-lilac" : value === "DETECTED" ? "bg-brand-soft text-brand" : value === "DISMISSED" ? "bg-secondary text-ink/55" : "bg-brand-soft text-brand";
  return <span className={cn("inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-[10px] font-bold tracking-wide", tone)}>{value}</span>;
}

function SectionHeading({ eyebrow, title, description, action }: { eyebrow?: string; title: string; description?: string; action?: React.ReactNode }) {
  return <div className="mb-5 flex flex-wrap items-start justify-between gap-3"><div>{eyebrow && <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.16em] text-brand">{eyebrow}</p>}<h2 className="font-display text-xl font-bold">{title}</h2>{description && <p className="mt-1 text-xs text-ink/45">{description}</p>}</div>{action}</div>;
}

function MetricCard({ label, value, note, icon, tone = "accent" }: { label: string; value: string | number; note: string; icon: string; tone?: "accent" | "mint" | "sunny" | "brand" | "lilac" }) {
  const iconTone = { accent: "bg-accent/10 text-accent", mint: "bg-mint-soft text-mint", sunny: "bg-sunny-soft text-sunny", brand: "bg-brand-soft text-brand", lilac: "bg-lilac-soft text-lilac" }[tone];
  return <div className="pop-in rounded-3xl border border-black/5 bg-surface-elevated p-5 shadow-sm"><div className="flex items-center justify-between"><span className="text-xs font-semibold text-ink/50">{label}</span><span className={cn("grid size-8 place-items-center rounded-xl font-display font-bold", iconTone)}>{icon}</span></div><p className="mt-2 font-display text-3xl font-bold">{value}</p><p className="mt-1 text-xs font-semibold text-ink/45">{note}</p></div>;
}

function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-2xl border border-black/5 bg-surface-elevated/95 p-3.5 shadow-xl backdrop-blur-md text-xs space-y-2">
        <p className="font-display font-bold text-sm text-ink border-b border-black/5 pb-1">
          Time: {label}
        </p>
        <div className="space-y-1.5">
          {payload.map((entry: any) => (
            <div key={entry.name} className="flex items-center justify-between gap-4 font-medium">
              <span className="flex items-center gap-1.5">
                <span className="size-2 rounded-full" style={{ backgroundColor: entry.color }} />
                <span className="text-ink/70">{entry.name}:</span>
              </span>
              <span className="font-mono font-bold text-ink">{entry.value.toLocaleString()} reqs</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
}

function TrafficChart({ traffic }: { traffic: TrafficRecord[] }) {
  const [chartMode, setChartMode] = useState<"area" | "bar">("area");
  const [visibleSeries, setVisibleSeries] = useState({
    normal: true,
    suspicious: true,
    blocked: true,
  });

  const chartData = useMemo(() => {
    const timeBuckets = [
      "00:00", "02:00", "04:00", "06:00", "08:00", "10:00",
      "12:00", "14:00", "16:00", "18:00", "20:00", "22:00"
    ];
    
    const baseNormal = [420, 380, 290, 310, 540, 780, 890, 820, 750, 680, 590, 480];
    const baseSuspicious = [12, 8, 15, 6, 28, 45, 62, 58, 40, 32, 22, 18];
    const baseBlocked = [3, 1, 4, 2, 8, 12, 18, 15, 10, 7, 5, 4];

    let normalAdd = 0;
    let suspiciousAdd = 0;
    let blockedAdd = 0;

    traffic.forEach((event) => {
      if (event.eventStatus === "BLOCKED" || event.preventionAction === "IP Blocked") {
        blockedAdd += 1;
      } else if (event.status === "Suspicious" || event.severity !== "NORMAL") {
        suspiciousAdd += 1;
      } else {
        normalAdd += 1;
      }
    });

    return timeBuckets.map((time, idx) => {
      const isPeakSlot = idx >= 6 && idx <= 8;
      const slotNormal = (baseNormal[idx] ?? 400) + (isPeakSlot ? normalAdd * 8 : normalAdd * 2);
      const slotSuspicious = (baseSuspicious[idx] ?? 20) + (isPeakSlot ? suspiciousAdd * 6 : suspiciousAdd);
      const slotBlocked = (baseBlocked[idx] ?? 5) + (isPeakSlot ? blockedAdd * 5 : blockedAdd);
      const total = slotNormal + slotSuspicious + slotBlocked;

      return {
        time,
        Normal: slotNormal,
        Suspicious: slotSuspicious,
        Blocked: slotBlocked,
        Total: total,
      };
    });
  }, [traffic]);

  const toggleSeries = (key: "normal" | "suspicious" | "blocked") => {
    setVisibleSeries((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <Panel className="lg:col-span-2 flex flex-col justify-between">
      <SectionHeading
        title="Traffic Overview"
        description="Last 24 hours · simulated network flow"
        action={
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 rounded-2xl border border-black/5 bg-surface p-1 text-xs">
              <button
                type="button"
                onClick={() => toggleSeries("normal")}
                className={cn(
                  "flex items-center gap-1.5 rounded-xl px-2.5 py-1 text-[11px] font-semibold transition-all cursor-pointer",
                  visibleSeries.normal ? "bg-mint-soft text-mint shadow-xs" : "text-ink/40 line-through opacity-50"
                )}
              >
                <span className="size-2 rounded-full bg-mint" />
                Normal
              </button>
              <button
                type="button"
                onClick={() => toggleSeries("suspicious")}
                className={cn(
                  "flex items-center gap-1.5 rounded-xl px-2.5 py-1 text-[11px] font-semibold transition-all cursor-pointer",
                  visibleSeries.suspicious ? "bg-sunny-soft text-sunny shadow-xs" : "text-ink/40 line-through opacity-50"
                )}
              >
                <span className="size-2 rounded-full bg-sunny" />
                Suspicious
              </button>
              <button
                type="button"
                onClick={() => toggleSeries("blocked")}
                className={cn(
                  "flex items-center gap-1.5 rounded-xl px-2.5 py-1 text-[11px] font-semibold transition-all cursor-pointer",
                  visibleSeries.blocked ? "bg-brand-soft text-brand shadow-xs" : "text-ink/40 line-through opacity-50"
                )}
              >
                <span className="size-2 rounded-full bg-brand" />
                Blocked
              </button>
            </div>

            <div className="flex items-center rounded-2xl border border-black/5 bg-surface p-1 text-xs">
              <button
                type="button"
                onClick={() => setChartMode("area")}
                className={cn(
                  "flex items-center gap-1 rounded-xl px-2 py-1 text-[11px] font-medium transition-all cursor-pointer",
                  chartMode === "area" ? "bg-surface-elevated text-ink font-bold shadow-xs" : "text-ink/50 hover:text-ink"
                )}
                title="Area Chart View"
              >
                <AreaIcon size={13} /> Area
              </button>
              <button
                type="button"
                onClick={() => setChartMode("bar")}
                className={cn(
                  "flex items-center gap-1 rounded-xl px-2 py-1 text-[11px] font-medium transition-all cursor-pointer",
                  chartMode === "bar" ? "bg-surface-elevated text-ink font-bold shadow-xs" : "text-ink/50 hover:text-ink"
                )}
                title="Bar Chart View"
              >
                <BarChart3 size={13} /> Bar
              </button>
            </div>
          </div>
        }
      />

      <div className="h-56 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          {chartMode === "area" ? (
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="normalGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="suspiciousGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="blockedGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0, 0, 0, 0.06)" />
              <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "rgba(0, 0, 0, 0.4)" }} dy={8} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "rgba(0, 0, 0, 0.4)" }} />
              <Tooltip content={<CustomTooltip />} />
              {visibleSeries.normal && (
                <Area type="monotone" dataKey="Normal" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#normalGrad)" />
              )}
              {visibleSeries.suspicious && (
                <Area type="monotone" dataKey="Suspicious" stroke="#f59e0b" strokeWidth={2.5} fillOpacity={1} fill="url(#suspiciousGrad)" />
              )}
              {visibleSeries.blocked && (
                <Area type="monotone" dataKey="Blocked" stroke="#f43f5e" strokeWidth={2.5} fillOpacity={1} fill="url(#blockedGrad)" />
              )}
            </AreaChart>
          ) : (
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0, 0, 0, 0.06)" />
              <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "rgba(0, 0, 0, 0.4)" }} dy={8} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "rgba(0, 0, 0, 0.4)" }} />
              <Tooltip content={<CustomTooltip />} />
              {visibleSeries.normal && <Bar dataKey="Normal" fill="#10b981" radius={[4, 4, 0, 0]} />}
              {visibleSeries.suspicious && <Bar dataKey="Suspicious" fill="#f59e0b" radius={[4, 4, 0, 0]} />}
              {visibleSeries.blocked && <Bar dataKey="Blocked" fill="#f43f5e" radius={[4, 4, 0, 0]} />}
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </Panel>
  );
}

function RecentEvents({ events }: { events: TrafficRecord[] }) {
  return <Panel><SectionHeading title="Recent Security Events" action={<span className="text-xs font-semibold text-accent">Live · simulated feed</span>} /><div className="overflow-x-auto"><table className="w-full min-w-[720px] text-left text-sm"><thead><tr className="border-b border-black/5 text-[10px] uppercase tracking-wide text-ink/40"><th className="py-2.5 pr-4">Time</th><th className="py-2.5 pr-4">Source IP</th><th className="py-2.5 pr-4">Threat</th><th className="py-2.5 pr-4">Severity</th><th className="py-2.5 pr-4">Action</th><th className="py-2.5">Status</th></tr></thead><tbody className="divide-y divide-black/5">{events.slice(0, 6).map((event) => <tr key={event.id}><td className="py-3 pr-4 text-ink/60">{event.timestamp}</td><td className="py-3 pr-4 font-mono text-xs">{event.sourceIp}</td><td className="py-3 pr-4 font-medium">{event.threatType}</td><td className="py-3 pr-4"><StatusBadge value={event.severity} /></td><td className="py-3 pr-4 text-ink/60">{event.preventionAction}</td><td className="py-3"><StatusBadge value={event.eventStatus} /></td></tr>)}</tbody></table></div></Panel>;
}

export function DashboardPage() {
  const { events, blockedIps, generateTraffic, runDemo } = useIdps();
  const normal = events.filter((event) => event.severity === "NORMAL").length;
  const suspicious = events.filter((event) => event.status === "Suspicious").length;
  const threats = events.filter((event) => event.severity !== "NORMAL").length;
  return <div className="space-y-4"><div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5"><MetricCard label="Total Traffic" value={events.length.toLocaleString()} note="simulated records" icon="T" /><MetricCard label="Normal Traffic" value={normal} note={`${events.length ? Math.round((normal / events.length) * 100) : 0}% of flow`} icon="N" tone="mint" /><MetricCard label="Suspicious" value={suspicious} note="flagged for review" icon="S" tone="sunny" /><MetricCard label="Threats Detected" value={threats} note="rule matches" icon="!" tone="brand" /><MetricCard label="Blocked IPs" value={blockedIps.length} note="simulated blocks" icon="B" tone="lilac" /></div><div className="grid gap-4 lg:grid-cols-3"><TrafficChart traffic={events} /><Panel className="flex flex-col"><SectionHeading title="Live Alerts" description="Auto-generated from detection rules" /><div className="space-y-3">{events.filter((event) => event.severity !== "NORMAL").slice(0, 3).map((event) => <div key={event.id} className={cn("flex items-start gap-3 rounded-2xl p-3", event.severity === "CRITICAL" ? "bg-brand-soft" : "bg-sunny-soft")}><span className={cn("mt-1.5 size-2.5 shrink-0 rounded-full", event.severity === "CRITICAL" ? "bg-brand" : "bg-sunny")} /><div><p className="text-sm font-semibold">{event.threatType} detected</p><p className="text-xs text-ink/50">{event.sourceIp} · {event.severity}</p></div></div>)}{events.every((event) => event.severity === "NORMAL") && <p className="rounded-2xl bg-mint-soft p-3 text-sm font-semibold text-mint">No active simulated threats.</p>}</div><Button className="mt-auto w-full rounded-2xl bg-accent font-bold text-accent-foreground shadow-[0_10px_24px_-8px] shadow-accent/60 hover:bg-accent/90" onClick={() => generateTraffic("random")}><WandSparkles />Generate Sample Traffic</Button></Panel></div><RecentEvents events={events} /><p className="text-center text-[11px] text-ink/35">A Web-Based IDPS Prototype for Simulated Network Traffic Analysis and Prevention · No real network changes are made.</p></div>;
}

const simulatorActions: { kind: TrafficKind; label: string; icon: React.ReactNode }[] = [
  { kind: "normal", label: "Generate Normal Traffic", icon: <CheckCircle2 /> },
  { kind: "port-scan", label: "Simulate Port Scan", icon: <ShieldAlert /> },
  { kind: "brute-force", label: "Simulate Brute Force", icon: <Shield /> },
  { kind: "abnormal", label: "Simulate Abnormal Traffic", icon: <Gauge /> },
  { kind: "random", label: "Generate Random Traffic", icon: <Sparkles /> },
];

export function TrafficSimulatorPage() {
  const { events, generateTraffic } = useIdps();
  return <div className="space-y-4"><Panel><SectionHeading eyebrow="Data Collection & Preprocessing" title="Generate a test event" description="Every record stays inside this browser-based academic simulation." /><div className="flex flex-wrap gap-2">{simulatorActions.map((action) => <Button key={action.kind} variant={action.kind === "port-scan" || action.kind === "brute-force" ? "secondary" : "outline"} className="rounded-2xl border-black/5 bg-surface text-ink/75" onClick={() => generateTraffic(action.kind)}>{action.icon}{action.label}</Button>)}</div></Panel><Panel><SectionHeading title="Preprocessing Status" description="Simulated data quality checks for the current collection" /><div className="grid grid-cols-2 gap-3 md:grid-cols-5">{[["Records Collected", events.length], ["Duplicate Records Removed", Math.min(3, events.length)], ["Missing Values", 0], ["Normalized Records", events.length], ["Processed Records", events.length]].map(([label, value]) => <div key={label} className="rounded-2xl bg-surface p-4"><p className="text-[10px] font-bold uppercase tracking-wide text-ink/45">{label}</p><p className="mt-2 font-display text-2xl font-bold">{value}</p></div>)}</div></Panel><Panel><SectionHeading title="Processed Traffic" description="Normalized simulated connection records" /><TrafficTable events={events} /></Panel></div>;
}

function TrafficTable({ events }: { events: TrafficRecord[] }) {
  return <div className="overflow-x-auto"><table className="w-full min-w-[950px] text-left text-sm"><thead><tr className="border-b border-black/5 text-[10px] uppercase tracking-wide text-ink/40"><th className="py-2.5 pr-4">Timestamp</th><th className="py-2.5 pr-4">Source IP</th><th className="py-2.5 pr-4">Destination</th><th className="py-2.5 pr-4">Port</th><th className="py-2.5 pr-4">Protocol</th><th className="py-2.5 pr-4">Packet</th><th className="py-2.5 pr-4">Frequency</th><th className="py-2.5">Status</th></tr></thead><tbody className="divide-y divide-black/5">{events.map((event) => <tr key={event.id}><td className="py-3 pr-4 text-ink/60">{event.timestamp}</td><td className="py-3 pr-4 font-mono text-xs">{event.sourceIp}</td><td className="py-3 pr-4 font-mono text-xs">{event.destinationIp}</td><td className="py-3 pr-4 font-mono text-xs">{event.destinationPort}</td><td className="py-3 pr-4">{event.protocol}</td><td className="py-3 pr-4">{event.packetSize} bytes</td><td className="py-3 pr-4">{event.frequency}</td><td className="py-3"><StatusBadge value={event.status === "Normal" ? "NORMAL" : event.severity} /></td></tr>)}</tbody></table></div>;
}

export function DetectionPage() {
  const { events } = useIdps();
  const threats = events.filter((event) => event.severity !== "NORMAL");
  return <div className="space-y-4"><Panel><SectionHeading eyebrow="Explainable Rules" title="Detection rules" description="Simple rules keep each classification easy to explain during a demonstration." /><div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">{[["Port Scan", "Multiple destination ports from one source in a short interval."], ["Brute Force", "Repeated login attempts originate from the same IP."], ["High-Frequency Traffic", "Connection frequency crosses the simulated threshold."], ["Normal Traffic", "Traffic follows a normal simulated pattern."]].map(([title, body], index) => <div key={title} className="rounded-2xl bg-surface p-4"><div className="flex items-center gap-2"><span className={cn("grid size-7 place-items-center rounded-lg text-xs font-bold", index === 3 ? "bg-mint-soft text-mint" : "bg-sunny-soft text-sunny")}>{index + 1}</span><p className="text-sm font-bold">{title}</p></div><p className="mt-3 text-xs leading-relaxed text-ink/55">{body}</p></div>)}</div></Panel><Panel><SectionHeading title="Detected Events" description={`${threats.length} suspicious event${threats.length === 1 ? "" : "s"} identified by the simulated rules.`} /><div className="overflow-x-auto"><table className="w-full min-w-[1050px] text-left text-sm"><thead><tr className="border-b border-black/5 text-[10px] uppercase tracking-wide text-ink/40"><th className="py-2.5 pr-4">Event ID</th><th className="py-2.5 pr-4">Source IP</th><th className="py-2.5 pr-4">Destination</th><th className="py-2.5 pr-4">Protocol</th><th className="py-2.5 pr-4">Threat Type</th><th className="py-2.5 pr-4">Severity</th><th className="py-2.5 pr-4">Detection Reason</th><th className="py-2.5">Status</th></tr></thead><tbody className="divide-y divide-black/5">{threats.map((event) => <tr key={event.id}><td className="py-3 pr-4 font-mono text-xs text-ink/60">{event.id}</td><td className="py-3 pr-4 font-mono text-xs">{event.sourceIp}</td><td className="py-3 pr-4 font-mono text-xs">{event.destinationIp}</td><td className="py-3 pr-4">{event.protocol}</td><td className="py-3 pr-4 font-medium">{event.threatType}</td><td className="py-3 pr-4"><StatusBadge value={event.severity} /></td><td className="max-w-sm py-3 pr-4 text-xs leading-relaxed text-ink/55">{event.reason}</td><td className="py-3"><StatusBadge value={event.eventStatus} /></td></tr>)}</tbody></table>{threats.length === 0 && <EmptyState title="No threats detected" description="Use the Traffic Simulator to generate suspicious activity." />}</div></Panel></div>;
}

export function PreventionPage() {
  const { events, blockedIps, blockIp, monitorEvent, dismissEvent } = useIdps();
  const threats = events.filter((event) => event.severity !== "NORMAL");
  return <div className="space-y-4"><Panel><SectionHeading eyebrow="Simulated Prevention" title="Threat Response Center" description="These actions change only the simulated state inside this application." /><div className="space-y-3">{threats.map((event) => <div key={event.id} className="flex flex-col gap-4 rounded-2xl border border-black/5 bg-surface p-4 lg:flex-row lg:items-center lg:justify-between"><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5 lg:flex-1"><div><p className="text-[10px] font-bold uppercase text-ink/40">Source IP</p><p className="mt-1 font-mono text-sm">{event.sourceIp}</p></div><div><p className="text-[10px] font-bold uppercase text-ink/40">Threat</p><p className="mt-1 text-sm font-semibold">{event.threatType}</p></div><div><p className="text-[10px] font-bold uppercase text-ink/40">Severity</p><div className="mt-1"><StatusBadge value={event.severity} /></div></div><div><p className="text-[10px] font-bold uppercase text-ink/40">Detection Time</p><p className="mt-1 text-sm text-ink/60">{event.timestamp}</p></div><div><p className="text-[10px] font-bold uppercase text-ink/40">Current Status</p><div className="mt-1"><StatusBadge value={event.eventStatus} /></div></div></div><div className="flex flex-wrap gap-2"><Button size="sm" className="rounded-xl bg-brand font-bold text-brand-foreground hover:bg-brand/90" disabled={event.eventStatus === "BLOCKED"} onClick={() => blockIp(event.id)}><Shield />Block IP</Button><Button size="sm" variant="outline" className="rounded-xl border-black/5" disabled={event.eventStatus === "BLOCKED"} onClick={() => monitorEvent(event.id)}>Monitor</Button><Button size="sm" variant="ghost" className="rounded-xl" onClick={() => dismissEvent(event.id)}>Dismiss</Button></div></div>)}</div>{threats.length === 0 && <EmptyState title="Response queue is clear" description="Suspicious simulated events will appear here after detection." />}</Panel><Panel><SectionHeading title="Blocked IP Addresses" description="Simulated blocks only — no firewall or network setting is changed." /><div className="overflow-x-auto"><table className="w-full min-w-[650px] text-left text-sm"><thead><tr className="border-b border-black/5 text-[10px] uppercase tracking-wide text-ink/40"><th className="py-2.5 pr-4">IP Address</th><th className="py-2.5 pr-4">Threat</th><th className="py-2.5 pr-4">Severity</th><th className="py-2.5 pr-4">Blocked Time</th><th className="py-2.5">Status</th></tr></thead><tbody className="divide-y divide-black/5">{blockedIps.map((item) => <tr key={item.id}><td className="py-3 pr-4 font-mono text-xs">{item.ip}</td><td className="py-3 pr-4">{item.threat}</td><td className="py-3 pr-4"><StatusBadge value={item.severity} /></td><td className="py-3 pr-4 text-ink/60">{item.blockedTime}</td><td className="py-3"><StatusBadge value="BLOCKED" /></td></tr>)}</tbody></table>{blockedIps.length === 0 && <EmptyState title="No simulated blocks yet" description="Choose Block IP on a detected threat to add one." />}</div></Panel></div>;
}

export function LogsPage() {
  const { events, exportLogs, clearSimulation } = useIdps();
  const [query, setQuery] = useState("");
  const [severity, setSeverity] = useState("ALL");
  const [status, setStatus] = useState("ALL");
  const [threat, setThreat] = useState("ALL");
  const threatTypes = Array.from(new Set(events.map((event) => event.threatType)));
  const filtered = useMemo(() => events.filter((event) => [event.sourceIp, event.id, event.threatType, event.reason].join(" ").toLowerCase().includes(query.toLowerCase())).filter((event) => severity === "ALL" || event.severity === severity).filter((event) => status === "ALL" || event.eventStatus === status).filter((event) => threat === "ALL" || event.threatType === threat), [events, query, severity, status, threat]);
  return <div className="space-y-4"><Panel><SectionHeading eyebrow="Audit Trail" title="Security Logs" description="Search and filter the complete simulated activity history." action={<div className="flex gap-2"><Button variant="outline" className="rounded-xl border-black/5" onClick={exportLogs}><ArrowDownToLine />Export Logs</Button><Button variant="ghost" className="rounded-xl text-brand" onClick={clearSimulation}><Trash2 />Clear Simulation</Button></div>} /><div className="grid gap-2 md:grid-cols-4"><div className="relative md:col-span-2"><Search className="absolute left-3 top-2.5 size-4 text-ink/35" /><Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search IP, event ID, or threat..." className="rounded-xl border-black/5 bg-surface pl-9" /></div><SelectFilter label="Severity" value={severity} values={severityOrder} onChange={setSeverity} /><SelectFilter label="Status" value={status} values={["ALL", "NORMAL", "DETECTED", "MONITORED", "BLOCKED", "DISMISSED"]} onChange={setStatus} /></div><div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-ink/50"><Filter size={14} /><span>Threat type:</span><button className={cn("rounded-full px-2.5 py-1", threat === "ALL" ? "bg-accent text-accent-foreground" : "bg-surface")} onClick={() => setThreat("ALL")}>All</button>{threatTypes.map((type) => <button key={type} className={cn("rounded-full px-2.5 py-1", threat === type ? "bg-accent text-accent-foreground" : "bg-surface")} onClick={() => setThreat(type)}>{type}</button>)}</div></Panel><Panel><div className="overflow-x-auto"><table className="w-full min-w-[1050px] text-left text-sm"><thead><tr className="border-b border-black/5 text-[10px] uppercase tracking-wide text-ink/40"><th className="py-2.5 pr-4">Timestamp</th><th className="py-2.5 pr-4">Event ID</th><th className="py-2.5 pr-4">Source IP</th><th className="py-2.5 pr-4">Event Type</th><th className="py-2.5 pr-4">Severity</th><th className="py-2.5 pr-4">Detection Result</th><th className="py-2.5 pr-4">Prevention Action</th><th className="py-2.5">Status</th></tr></thead><tbody className="divide-y divide-black/5">{filtered.map((event) => <tr key={event.id}><td className="py-3 pr-4 text-ink/60">{event.timestamp}</td><td className="py-3 pr-4 font-mono text-xs text-ink/60">{event.id}</td><td className="py-3 pr-4 font-mono text-xs">{event.sourceIp}</td><td className="py-3 pr-4 font-medium">{event.threatType}</td><td className="py-3 pr-4"><StatusBadge value={event.severity} /></td><td className="max-w-sm py-3 pr-4 text-xs text-ink/55">{event.reason}</td><td className="py-3 pr-4 text-xs text-ink/60">{event.preventionAction}</td><td className="py-3"><StatusBadge value={event.eventStatus} /></td></tr>)}</tbody></table>{filtered.length === 0 && <EmptyState title="No matching logs" description="Try a different search or filter." />}</div></Panel></div>;
}

function SelectFilter({ label, value, values, onChange }: { label: string; value: string; values: string[]; onChange: (value: string) => void }) {
  return <label className="flex items-center gap-2 rounded-xl border border-black/5 bg-surface px-3 text-xs text-ink/50">{label}<select value={value} onChange={(event) => onChange(event.target.value)} className="min-w-0 flex-1 bg-transparent py-2 font-semibold text-ink outline-none">{values.map((option) => <option key={option} value={option}>{option}</option>)}</select></label>;
}

function EmptyState({ title, description }: { title: string; description: string }) {
  return <div className="flex flex-col items-center justify-center rounded-2xl bg-surface px-4 py-10 text-center"><Database className="size-8 text-ink/25" /><p className="mt-3 text-sm font-bold">{title}</p><p className="mt-1 text-xs text-ink/50">{description}</p></div>;
}