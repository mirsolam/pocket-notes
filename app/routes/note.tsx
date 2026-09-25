import NoteLanding from "~/pages/landing/noteLanding";
import type { Route } from "./+types/note";

export function meta({ }: Route.MetaArgs) {
    return [
        { title: "Note" },
        { name: "description", content: "Create or edit a note." },
    ];
}

export default function Note() {
    return (<NoteLanding />)
}