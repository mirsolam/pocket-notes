import NotebookLanding from "~/pages/landing/notebookLanding";
import type { Route } from "./+types/notebook";

export function meta({ }: Route.MetaArgs) {
    return [
        { title: "Notebook" },
        { name: "description", content: "Create or edit a notebook." },
    ];
}

export default function Note() {
    return (<NotebookLanding />)
}