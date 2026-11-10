import { useEffect, useRef, useState } from "react"
import { checkSessionValidity } from "../api/accountAPI"
import { useNavigate } from "react-router";
import { createNote } from "../api/noteAPI";
import NotePaper from "../component/notePaper";
import Logout from "../component/logout";
import { createNotebook } from "../api/notebookAPI";
import { getDashboardList } from "../api/dashboardAPI";
import NotebookCover from "../component/notebookCover";
import type { Note, Notebook } from "../types/types";
import Loading from "../component/loading";
import ToastMessage from "../component/toastMessage";

export default function DashboardLanding() {
    const navigate = useNavigate();
    const [notes, setNotes] = useState(null as unknown as Array<Note>)
    const [notebooks, setNotebookss] = useState(null as unknown as Array<Notebook>)
    const [rerenderFlag, setRerenderFlag] = useState(false)
    const [loading, setIsLoading] = useState(false)
    const [alertMessage, setAlertMessage] = useState<string>()
    const [alertColor, setAlertColor] = useState<string>("success")

    useEffect(() => {
        setIsLoading(true)
        checkSessionValidity()
            .then(data => {
                if (data.status !== "success") navigate("/login")
                loadDashboard()
            })
            .catch(error => {
                navigate("/login")
            })
    }, [])

    useEffect(() => {
        if (rerenderFlag) {
            loadDashboard()
            setRerenderFlag(false)
        }
    }, [rerenderFlag])

    function loadDashboard() {
        getDashboardList()
            .then(res => {
                setNotes(res.data.notes)
                setNotebookss(res.data.notebooks)
            })
            .catch(error => {
                setAlertColor("error")
                setAlertMessage("Failed to load data. Please try again later.")
            })
            .finally(() => setIsLoading(false))
    }

    function createNoteOnClick() {
        setIsLoading(true)
        createNote()
            .then(data => {
                if (data.status === "success")
                    navigate("/note", { state: { _id: data.data._id } })
            })
            .finally(() => setIsLoading(false))
    }

    function createNotebookOnClick() {
        setIsLoading(true)
        createNotebook()
            .then(data => {
                if (data.status === "success")
                    navigate("/notebook", { state: { _id: data.data._id } })
            })
            .finally(() => setIsLoading(false))
    }

    return (
        <div className="flex h-dvh w-dvw p-10 flex-col">
            <Logout setAlertMessage={setAlertMessage} setAlertColor={setAlertColor} />
            <div className="flex items-center">
                <div>Notes</div>
                <hr className="hr-line w-dvw ml-5 mr-1" />
            </div>
            <div className="flex flex-wrap p-5 dashboard-list-scroll max-h-[40%]">
                {notes && notes.map((item) => {
                    return (
                        <NotePaper note={item} key={item._id} triggerRerender={setRerenderFlag} setAlertMessage={setAlertMessage} setAlertColor={setAlertColor} />
                    )
                })}
            </div>
            <div className="flex items-center mt-5">
                <div>Notebooks</div>
                <hr className="hr-line w-dvw ml-5 mr-1 overflow-y-auto" />
            </div>
            <div className="flex flex-wrap p-5 dashboard-list-scroll max-h-[60%]">
                {notebooks && notebooks.map((item) => {
                    return (
                        <NotebookCover notebook={item} key={item._id} triggerRerender={setRerenderFlag} setAlertMessage={setAlertMessage} setAlertColor={setAlertColor} />
                    )
                })}
            </div>

            <div className="flex flex-col fixed bottom-[5rem] right-[5rem]">
                <div className="note-icon cursor-pointer" onClick={createNoteOnClick}>Create new note</div>
                <div className="notebook-icon cursor-pointer" onClick={createNotebookOnClick}>Create new notebook</div>
            </div>
            {loading && <Loading />}
            {alertMessage && <ToastMessage message={alertMessage} setMessage={setAlertMessage} color={alertColor} />}
        </div>
    )
}