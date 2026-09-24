import DashboardHome from "~/pages/home/dashboardHome";
import type { Route } from "./+types/dashboard";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Pocket Notes" },
    { name: "description", content: "Welcome to Pocket Notes!" },
  ];
}

export default function Dashboard() {
  return <DashboardHome />
}
