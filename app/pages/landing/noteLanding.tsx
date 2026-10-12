import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { checkSessionValidity } from "../api/accountAPI";
import { getNoteById, saveNote } from "../api/noteAPI";

export default function NoteLanding() {
    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
        try {
            checkSessionValidity()
                .then(data => {
                    if (data.status !== "success") navigate("/login")

                    if (location.state.id)
                        getNoteById(location.state.id)
                            .then(res => {
                                const content = document.getElementById("notecontent") as HTMLDivElement

                                if (res.status === "success" && content)
                                    content.textContent = res.data.content

                            })
                })
                .catch(error => {
                    navigate("/login")
                })
        }
        catch (error) {
            console.log("failed to create note.")
            navigate("/login")
        }
    })

    function backButtonOnClick() {
        const id = location.state.id
        const content = document.getElementById("notecontent") as HTMLDivElement
        saveNote({ id: id, content: content.textContent })
            .then(res => {
                //console.log("save: ", res)
                navigate("/")
            })
    }

    return (
        <div className="flex flex-col h-dvh justify-center items-center">
            <div className="note max-h-[70%] h-[70%] w-[70dvw] mb-10 p-3 overflow-y-auto" id="notecontent" contentEditable="true" />
            <div className="flex text-toolbar h-[3rem] mb-10">
                <div className="checklist-icon" />
                <div className="textcolor-icon" />
                <div className="fontsize-icon" />
                <div className="highlight-icon" />
                <div className="bold-icon" />
                <div className="italic-icon" />
            </div>
            <button type="button" className="btn-cancel text-center content-center h-10 w-40" onClick={backButtonOnClick}>Back</button>
        </div>
    )
}