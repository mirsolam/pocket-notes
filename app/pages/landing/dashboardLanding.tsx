import { useEffect, useRef, useState } from "react"
import { checkSessionValidity } from "../api/accountAPI"
import { useNavigate } from "react-router";
import { createNote } from "../api/noteAPI";
import NotePaper from "../component/notePaper";
import Logout from "../component/logout";
import { createNotebook } from "../api/notebookAPI";
import { getDashboardList } from "../api/dashboardAPI";
import NotebookCover from "../component/notebookCover";

export default function DashboardLanding() {
    const navigate = useNavigate();
    const [notes, setNotes] = useState(null as unknown as Array<{ _id: string, content: string }>)
    const [notebooks, setNotebookss] = useState(null as unknown as Array<{
        _id: string,
        userId: string,
        currentLeft: string,
        currentRight: string,
        title: string,
        content: Array<string>,
    }>)

    useEffect(() => {
        checkSessionValidity()
            .then(data => {
                if (data.status !== "success") navigate("/login")
                getDashboardList()
                    .then(res => {
                        setNotes(res.data.notes)
                        setNotebookss(res.data.notebooks)
                    })
            })
            .catch(error => {
                navigate("/login")
            })
    }, [])

    function createNoteOnClick() {
        createNote()
            .then(data => {
                if (data.status === "success")
                    navigate("/note", { state: { id: data.data.insertedId } })
            })
    }

    function createNotebookOnClick() {
        createNotebook()
            .then(data => {
                if (data.status === "success")
                    navigate("/notebook", { state: { id: data.data.insertedId } })
            })
    }

    return (
        <div className="flex h-dvh w-dvw p-10 flex-col">
            <Logout />
            <div className="flex items-center">
                <div>Notes</div>
                <hr className="hr-line w-dvw ml-5 mr-1" />
            </div>
            <div className="flex flex-wrap p-5 overflow-y-auto max-h-[50%]">
                {notes && notes.map((item) => {
                    return (
                        <NotePaper note={item} key={item._id} />
                    )
                })}
            </div>
            <div className="flex items-center mt-5">
                <div>Notebooks</div>
                <hr className="hr-line w-dvw ml-5 mr-1 overflow-y-auto" />
            </div>
            <div className="flex flex-wrap p-5 overflow-y-auto max-h-[50%]">
                {notebooks && notebooks.map((item) => {
                    return (
                        <NotebookCover notebook={item} key={item._id} />
                    )
                })}
            </div>

            <div className="flex flex-col fixed bottom-[5rem] right-[5rem]">
                <div className="note-icon cursor-pointer" onClick={createNoteOnClick}>Create new note</div>
                <div className="notebook-icon cursor-pointer" onClick={createNotebookOnClick}>Create new notebook</div>
            </div>

        </div>
    )
}