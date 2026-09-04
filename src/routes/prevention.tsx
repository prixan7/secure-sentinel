import { createFileRoute } from "@tanstack/react-router";
import { PreventionPage } from "@/components/idps-pages";

export const Route = createFileRoute("/prevention")({
  head: () => ({ meta: [{ title: "Prevention & Response | IDPS Prototype" }, { name: "description", content: "Review simulated threats and apply safe in-app prevention actions." }, { property: "og:title", content: "Prevention & Response | IDPS Prototype" }, { property: "og:description", content: "Review simulated threats and apply safe in-app prevention actions." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: PreventionPage,
});