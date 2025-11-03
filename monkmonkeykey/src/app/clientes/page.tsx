import ClientsPageClient from "./page.client";

import { CLIENTS } from "@/content/clients";

export default function ClientsPage() {
  return <ClientsPageClient clients={CLIENTS} />;
}
