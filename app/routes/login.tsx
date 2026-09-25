import LoginLanding from "~/pages/landing/loginLanding";
import type { Route } from "./+types/login";


export function meta({ }: Route.MetaArgs) {
    return [
        { title: "Login" },
        { name: "description", content: "Login to Pocket Notes." },
    ];
}

export default function Dashboard() {
    return <LoginLanding />
}
