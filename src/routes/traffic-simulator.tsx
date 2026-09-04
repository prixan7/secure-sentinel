import { createFileRoute } from "@tanstack/react-router";
import { TrafficSimulatorPage } from "@/components/idps-pages";

export const Route = createFileRoute("/traffic-simulator")({
  head: () => ({ meta: [{ title: "Traffic Simulator | IDPS Prototype" }, { name: "description", content: "Generate and preprocess simulated network traffic for the IDPS capstone prototype." }, { property: "og:title", content: "Traffic Simulator | IDPS Prototype" }, { property: "og:description", content: "Generate and preprocess simulated network traffic for the IDPS capstone prototype." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: TrafficSimulatorPage,
});