import { createFileRoute } from "@tanstack/react-router";
import { LogsPage } from "@/components/idps-pages";

export const Route = createFileRoute("/logs")({
  head: () => ({ meta: [{ title: "Security Logs | IDPS Prototype" }, { name: "description", content: "Search, filter, and export the simulated IDPS security event history." }, { property: "og:title", content: "Security Logs | IDPS Prototype" }, { property: "og:description", content: "Search, filter, and export the simulated IDPS security event history." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: LogsPage,
});