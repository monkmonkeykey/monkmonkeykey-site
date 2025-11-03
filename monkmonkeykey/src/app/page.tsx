import HomePageClient from "./page.client";

import { CLIENTS } from "@/content/clients";
import { PROJECTS, PROJECT_CATEGORY_LABELS } from "@/content/projects";
import { SERVICES } from "@/content/services";

export default function HomePage() {
  return (
    <HomePageClient
      projects={PROJECTS}
      clients={CLIENTS}
      services={SERVICES}
      categoryLabels={PROJECT_CATEGORY_LABELS}
    />
  );
}
