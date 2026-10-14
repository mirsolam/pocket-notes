import { useNavigate } from "react-router";
import type { Notebook } from "../types/types";

export default function NotebookCover({ notebook }: { notebook: Notebook }) {
    const navigate = useNavigate();

    function notebookCoverOnClick(e: React.MouseEvent<HTMLDivElement>) {
        const element = e.target as HTMLDivElement
        navigate("/notebook", { state: { _id: element.id } })
    }

    return (
        <div className="flex">
            <div className="flex dashboard-notebook h-[25rem] w-[15rem] mr-5 mb-5 cursor-pointer justify-center items-center" id={notebook._id} onClick={notebookCoverOnClick}>
                <div className="flex dashboard-notebook-title h-[10rem] w-[10rem] justify-center items-center text-center" id={notebook._id}>
                    {notebook.title}
                </div>
            </div>
        </div>
    )
}