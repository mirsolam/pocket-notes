import { useNavigate } from "react-router";
import type { Notebook } from "../types/types";
import { deleteNotebook } from "../api/notebookAPI";

export default function NotebookCover({ notebook, triggerRerender }: { notebook: Notebook; triggerRerender: React.Dispatch<React.SetStateAction<boolean>>; }) {
    const navigate = useNavigate();

    function notebookCoverOnClick(e: React.MouseEvent<HTMLDivElement>) {
        const element = e.target as HTMLDivElement
        if (element.id === "delete-notebook") return
        navigate("/notebook", { state: { _id: element.id } })
    }

    function noteDeleteOnClick(e: React.MouseEvent<HTMLDivElement>) {
        deleteNotebook(notebook._id)
            .then(res => {
                if (res.status === "success") triggerRerender(true)
            })
    }
    return (
        <div className="flex">
            <div className="flex dashboard-notebook h-[25rem] w-[15rem] mr-5 mb-5 cursor-pointer justify-center items-center relative" id={notebook._id} onClick={notebookCoverOnClick}>
                <div className="flex dashboard-notebook-title h-[10rem] w-[10rem] justify-center items-center text-center" id={notebook._id}>
                    {notebook.title}
                </div>
                <div className="flex justify-end items-center dashboard-delete-overlay absolute h-[3rem] w-full bottom-0 left-0" id={notebook._id}>
                    <div className="delete-icon w-7" id="delete-notebook" onClick={noteDeleteOnClick} />
                </div>
            </div>
        </div>
    )
}