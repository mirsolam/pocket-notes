import SignUpHome from "~/pages/home/signupHome";
import type { Route } from "./+types/signup";

export function meta({ }: Route.MetaArgs) {
    return [
        { title: "Sign-up" },
        { name: "description", content: "Sign-up to Pocket Notes." },
    ];
}

export default function SignUp() {
    return (<SignUpHome />)
}