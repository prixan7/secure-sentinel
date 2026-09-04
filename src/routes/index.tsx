import { createFileRoute } from "@tanstack/react-router";
import { DashboardPage } from "@/components/idps-pages";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "Security Dashboard | IDPS Prototype" }, { name: "description", content: "A web-based IDPS prototype for simulated network traffic analysis and prevention." }, { property: "og:title", content: "Security Dashboard | IDPS Prototype" }, { property: "og:description", content: "A web-based IDPS prototype for simulated network traffic analysis and prevention." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: DashboardPage,
});