import { createFileRoute } from "@tanstack/react-router";
import { DetectionPage } from "@/components/idps-pages";

export const Route = createFileRoute("/detection")({
  head: () => ({ meta: [{ title: "Detection & Classification | IDPS Prototype" }, { name: "description", content: "Review explainable simulated intrusion detection rules and classifications." }, { property: "og:title", content: "Detection & Classification | IDPS Prototype" }, { property: "og:description", content: "Review explainable simulated intrusion detection rules and classifications." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: DetectionPage,
});