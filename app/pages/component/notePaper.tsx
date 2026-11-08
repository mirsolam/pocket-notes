import { useNavigate } from "react-router";
import type { Note } from "../types/types";
import { deleteNote } from "../api/noteAPI";
import { useEffect, useState } from "react";
import Loading from "./loading";

export default function NotePaper({ note, triggerRerender }: { note: Note; triggerRerender: React.Dispatch<React.SetStateAction<boolean>> }) {
    const navigate = useNavigate();
    const [loading, setIsLoading] = useState(false)


    useEffect(() => {
        if (document.getElementById(`scroll-${note._id}`)) document.getElementById(`scroll-${note._id}`)!.innerText = note.content
    }, [])

    function notePaperOnClick(e: React.MouseEvent<HTMLDivElement>) {
        const element = e.target as HTMLDivElement

        if (element.id === "delete-note") return
        navigate("/note", { state: { _id: note._id } })
    }

    function noteDeleteOnClick(e: React.MouseEvent<HTMLDivElement>) {
        setIsLoading(true)
        deleteNote(note._id)
            .then(res => {
                if (res.status === "success") triggerRerender(true)
            })
            .finally(() => setIsLoading(false))
    }

    function toggleOverlay(e: React.TouchEvent<HTMLDivElement>) {
        if (document.getElementsByName("overlay-active").length > 0) {
            document.getElementsByName("overlay-active").forEach((item) => {
                item.style.visibility = "hidden"
                item.removeAttribute("name")
            })
        }
        const overlay = document.getElementById(`overlay-${note._id}`)
        overlay!.style.visibility = "visible"
        overlay!.setAttribute("name", "overlay-active")
    }

    return (
        <div className="dashboard-note h-[15rem] w-[15rem] mr-5 mb-5 cursor-pointer relative" id={note._id} onClick={notePaperOnClick} onTouchStart={toggleOverlay}>
            <div className="dashboard-item-scroll" id={`scroll-${note._id}`}>
            </div>
            <div className="flex justify-end items-center dashboard-delete-overlay absolute h-[3rem] w-full bottom-0 left-0" id={`overlay-${note._id}`}>
                <div className="delete-icon w-7" id="delete-note" onClick={noteDeleteOnClick} />
            </div>
            {loading && <Loading />}
        </div>
    )
}