import { useNavigate } from "react-router";
import type { Note } from "../types/types";

export default function NotePaper({ note }: { note: Note }) {
    const navigate = useNavigate();

    function notePaperOnClick(e: React.MouseEvent<HTMLDivElement>) {
        const element = e.target as HTMLDivElement
        navigate("/note", { state: { _id: element.id } })
    }
    return (
        <div className="dashboard-note h-[15rem] w-[15rem] mr-5 mb-5 cursor-pointer" id={note._id} onClick={notePaperOnClick}>
            {note.content}
        </div>
    )
}