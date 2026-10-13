import { useNavigate } from "react-router";

export default function NotePaper({ note }: { note: { _id: string, content: string } }) {
    const navigate = useNavigate();

    function notePaperOnClick(e: React.MouseEvent<HTMLDivElement>) {
        const element = e.target as HTMLDivElement
        navigate("/note", { state: { id: element.id } })
    }
    return (
        <div className="dashboard-note h-[15rem] w-[15rem] mr-5 mb-5 cursor-pointer" id={note._id} onClick={notePaperOnClick}>
            {note.content}
        </div>
    )
}