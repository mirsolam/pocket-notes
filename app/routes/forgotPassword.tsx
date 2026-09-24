import ForgotPasswordHome from "~/pages/home/forgotPasswordHome";
import type { Route } from "./+types/forgotPassword";

export function meta({ }: Route.MetaArgs) {
    return [
        { title: "Forgot Password" },
        { name: "description", content: "Forgot password page." },
    ];
}

export default function ForgotPassword() {
    return (<ForgotPasswordHome />)
}