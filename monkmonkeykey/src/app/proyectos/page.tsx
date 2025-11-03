import ProjectsPageClient from "./page.client";

import { PROJECTS, PROJECT_CATEGORY_LABELS } from "@/content/projects";

export default function ProjectsPage() {
  return (
    <ProjectsPageClient
      projects={PROJECTS}
      categoryLabels={PROJECT_CATEGORY_LABELS}
    />
  );
}
