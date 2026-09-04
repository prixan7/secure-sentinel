import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

export type TrafficKind = "normal" | "port-scan" | "brute-force" | "abnormal" | "random";
export type Severity = "NORMAL" | "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
export type EventStatus = "NORMAL" | "DETECTED" | "MONITORED" | "BLOCKED" | "DISMISSED";

export type TrafficRecord = {
  id: string;
  timestamp: string;
  sourceIp: string;
  destinationIp: string;
  sourcePort: string;
  destinationPort: string;
  protocol: string;
  packetSize: number;
  frequency: string;
  status: "Normal" | "Suspicious";
  threatType: string;
  severity: Severity;
  reason: string;
  eventStatus: EventStatus;
  preventionAction: string;
};

export type BlockedIp = {
  id: string;
  ip: string;
  threat: string;
  severity: Severity;
  blockedTime: string;
  status: "SIMULATED BLOCK";
};

type IdpsState = {
  traffic: TrafficRecord[];
  blockedIps: BlockedIp[];
  toast: string | null;
};

type IdpsContextValue = IdpsState & {
  events: TrafficRecord[];
  generateTraffic: (kind: TrafficKind) => void;
  runDemo: () => void;
  blockIp: (eventId: string) => void;
  monitorEvent: (eventId: string) => void;
  dismissEvent: (eventId: string) => void;
  clearSimulation: () => void;
  exportLogs: () => void;
};

const seedTraffic: TrafficRecord[] = [
  {
    id: "EVT-1042", timestamp: "14:32:08", sourceIp: "192.168.1.105", destinationIp: "192.168.1.1", sourcePort: "43120", destinationPort: "Multiple Ports", protocol: "TCP", packetSize: 128, frequency: "Very High", status: "Suspicious", threatType: "Port Scan", severity: "HIGH", reason: "Same source accessed multiple destination ports within a short simulated interval.", eventStatus: "BLOCKED", preventionAction: "IP Blocked",
  },
  {
    id: "EVT-1041", timestamp: "14:31:44", sourceIp: "192.168.1.120", destinationIp: "192.168.1.20", sourcePort: "44022", destinationPort: "22", protocol: "TCP", packetSize: 256, frequency: "High", status: "Suspicious", threatType: "Brute Force", severity: "CRITICAL", reason: "Repeated login attempts originated from the same source IP.", eventStatus: "DETECTED", preventionAction: "Monitor",
  },
  {
    id: "EVT-1040", timestamp: "14:30:12", sourceIp: "192.168.1.150", destinationIp: "192.168.1.1", sourcePort: "45110", destinationPort: "443", protocol: "TCP", packetSize: 1024, frequency: "Very High", status: "Suspicious", threatType: "Abnormal Traffic", severity: "MEDIUM", reason: "Connection frequency exceeded the simulated threshold.", eventStatus: "MONITORED", preventionAction: "Monitor",
  },
  {
    id: "EVT-1039", timestamp: "14:29:50", sourceIp: "192.168.1.10", destinationIp: "192.168.1.1", sourcePort: "51001", destinationPort: "80", protocol: "TCP", packetSize: 512, frequency: "Low", status: "Normal", threatType: "Normal Traffic", severity: "NORMAL", reason: "Traffic follows normal simulated HTTP request patterns.", eventStatus: "NORMAL", preventionAction: "Monitor",
  },
  {
    id: "EVT-1038", timestamp: "14:28:33", sourceIp: "192.168.1.25", destinationIp: "192.168.1.1", sourcePort: "52010", destinationPort: "53", protocol: "UDP", packetSize: 96, frequency: "Low", status: "Normal", threatType: "Normal Traffic", severity: "NORMAL", reason: "Traffic follows normal simulated DNS lookup patterns.", eventStatus: "NORMAL", preventionAction: "Monitor",
  },
];

const seedBlockedIps: BlockedIp[] = [{ id: "BLK-001", ip: "192.168.1.105", threat: "Port Scan", severity: "HIGH", blockedTime: "14:32:09", status: "SIMULATED BLOCK" }];

const makeRecord = (kind: Exclude<TrafficKind, "random">, number: number): TrafficRecord => {
  const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });
  const common = { id: `EVT-${Date.now()}-${number}`, timestamp, protocol: "TCP", eventStatus: "DETECTED" as EventStatus, preventionAction: "Monitor" };
  if (kind === "normal") return { ...common, sourceIp: "192.168.1.10", destinationIp: "192.168.1.1", sourcePort: "51001", destinationPort: "80", packetSize: 512, frequency: "Low", status: "Normal", threatType: "Normal Traffic", severity: "NORMAL", reason: "Traffic follows normal simulated HTTP request patterns." };
  if (kind === "port-scan") return { ...common, sourceIp: "192.168.1.105", destinationIp: "192.168.1.1", sourcePort: "43120", destinationPort: "Multiple Ports", packetSize: 128, frequency: "Very High", status: "Suspicious", threatType: "Port Scan", severity: "HIGH", reason: "Same source accessed multiple destination ports within a short simulated interval." };
  if (kind === "brute-force") return { ...common, sourceIp: "192.168.1.120", destinationIp: "192.168.1.20", sourcePort: "44022", destinationPort: "22", packetSize: 256, frequency: "High", status: "Suspicious", threatType: "Brute Force", severity: "CRITICAL", reason: "Repeated login attempts originated from the same source IP." };
  return { ...common, sourceIp: "192.168.1.150", destinationIp: "192.168.1.1", sourcePort: "45110", destinationPort: "443", packetSize: 1024, frequency: "Very High", status: "Suspicious", threatType: "Abnormal Traffic", severity: "MEDIUM", reason: "Connection frequency exceeded the simulated threshold." };
};

const isThreat = (event: TrafficRecord) => event.severity !== "NORMAL";

export function IdpsProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<IdpsState>({ traffic: seedTraffic, blockedIps: seedBlockedIps, toast: null });

  const showToast = useCallback((message: string) => {
    setState((current) => ({ ...current, toast: message }));
    window.setTimeout(() => setState((current) => ({ ...current, toast: null })), 3600);
  }, []);

  const append = useCallback((records: TrafficRecord[]) => {
    setState((current) => ({ ...current, traffic: [...records, ...current.traffic] }));
    const threat = records.find(isThreat);
    if (threat) showToast(`Threat Detected: ${threat.threatType}`);
  }, [showToast]);

  const generateTraffic = useCallback((kind: TrafficKind) => {
    const selected = kind === "random" ? ((["normal", "port-scan", "brute-force", "abnormal"] as const)[Math.floor(Math.random() * 4)] ?? "normal") : kind;
    append([makeRecord(selected, 1)]);
  }, [append]);

  const runDemo = useCallback(() => {
    append([makeRecord("normal", 1), makeRecord("normal", 2), makeRecord("port-scan", 3), makeRecord("brute-force", 4), makeRecord("abnormal", 5)]);
  }, [append]);

  const updateEvent = useCallback((eventId: string, eventStatus: EventStatus, preventionAction: string) => {
    setState((current) => ({ ...current, traffic: current.traffic.map((event) => event.id === eventId ? { ...event, eventStatus, preventionAction } : event) }));
  }, []);

  const blockIp = useCallback((eventId: string) => {
    setState((current) => {
      const event = current.traffic.find((item) => item.id === eventId);
      if (!event) return current;
      const alreadyBlocked = current.blockedIps.some((item) => item.ip === event.sourceIp);
      return {
        ...current,
        traffic: current.traffic.map((item) => item.id === eventId ? { ...item, eventStatus: "BLOCKED", preventionAction: "IP Blocked" } : item),
        blockedIps: alreadyBlocked ? current.blockedIps : [{ id: `BLK-${Date.now()}`, ip: event.sourceIp, threat: event.threatType, severity: event.severity, blockedTime: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }), status: "SIMULATED BLOCK" }, ...current.blockedIps],
        toast: `IP ${event.sourceIp} has been blocked in the IDPS simulation.`,
      };
    });
  }, []);

  const clearSimulation = useCallback(() => setState({ traffic: [], blockedIps: [], toast: "Simulation cleared" }), []);
  const exportLogs = useCallback(() => {
    const headers = ["Timestamp", "Event ID", "Source IP", "Event Type", "Severity", "Detection Result", "Prevention Action", "Status"];
    const rows = state.traffic.map((event) => [event.timestamp, event.id, event.sourceIp, event.threatType, event.severity, event.reason, event.preventionAction, event.eventStatus]);
    const csv = [headers, ...rows].map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "idps-simulated-security-logs.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  }, [state.traffic]);

  const value = useMemo(() => ({ ...state, events: state.traffic, generateTraffic, runDemo, blockIp, monitorEvent: (id: string) => updateEvent(id, "MONITORED", "Monitor"), dismissEvent: (id: string) => updateEvent(id, "DISMISSED", "Dismissed"), clearSimulation, exportLogs }), [state, generateTraffic, runDemo, blockIp, updateEvent, clearSimulation, exportLogs]);
  return <IdpsContext.Provider value={value}>{children}</IdpsContext.Provider>;
}

const IdpsContext = createContext<IdpsContextValue | null>(null);

export function useIdps() {
  const context = useContext(IdpsContext);
  if (!context) throw new Error("useIdps must be used inside IdpsProvider");
  return context;
}