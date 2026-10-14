import { useNavigate } from "react-router";

export default function NotebookCover(
    { notebook }
        : {
            notebook: {
                _id: string;
                userId: string;
                currentLeft: string;
                currentRight: string;
                title: string;
                content: Array<string>;
            }
        }
) {
    const navigate = useNavigate();

    function notebookCoverOnClick(e: React.MouseEvent<HTMLDivElement>) {
        const element = e.target as HTMLDivElement
        navigate("/notebook", { state: { id: element.id } })
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