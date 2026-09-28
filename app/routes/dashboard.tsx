import DashboardLanding from "~/pages/landing/dashboardLanding";
import type { Route } from "./+types/dashboard";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Pocket Notes" },
    { name: "description", content: "Welcome to Pocket Notes!" },
  ];
}

export default function Dashboard() {
  return <DashboardLanding />
}
