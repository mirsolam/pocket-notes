import { useNavigate } from "react-router";
import type { Note } from "../types/types";
import { deleteNote } from "../api/noteAPI";

export default function NotePaper({ note, triggerRerender }: { note: Note; triggerRerender: React.Dispatch<React.SetStateAction<boolean>> }) {
    const navigate = useNavigate();

    function notePaperOnClick(e: React.MouseEvent<HTMLDivElement>) {
        const element = e.target as HTMLDivElement

        if (element.id === "delete-note") return
        navigate("/note", { state: { _id: element.id } })
    }

    function noteDeleteOnClick(e: React.MouseEvent<HTMLDivElement>) {
        deleteNote(note._id)
            .then(res => {
                if (res.status === "success") triggerRerender(true)
            })
    }
    return (
        <div className="dashboard-note h-[15rem] w-[15rem] mr-5 mb-5 cursor-pointer relative" id={note._id} onClick={notePaperOnClick}>
            {note.content}
            <div className="flex justify-end items-center dashboard-delete-overlay absolute h-[3rem] w-full bottom-0 left-0" id={note._id}>
                <div className="delete-icon w-7" id="delete-note" onClick={noteDeleteOnClick} />
            </div>
        </div>
    )
}