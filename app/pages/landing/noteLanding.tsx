import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { checkSessionValidity } from "../api/accountAPI";
import { getNote, saveNote } from "../api/noteAPI";
import Toolbar from "../component/toolbar";
import Loading from "../component/loading";

export default function NoteLanding() {
    const navigate = useNavigate()
    const location = useLocation()
    const [loading, setIsLoading] = useState(false)


    useEffect(() => {
        setIsLoading(true)
        try {
            checkSessionValidity()
                .then(data => {
                    if (data.status !== "success") navigate("/login")
                    if (location.state._id) {
                        getNote(location.state._id)
                            .then(res => {
                                const content = document.getElementById("notecontent") as HTMLDivElement

                                if (res.status === "success" && content)
                                    content.innerText = res.data.content

                            })
                            .finally(() => setIsLoading(false))
                    }
                })
                .catch(error => {
                    navigate("/login")
                })
                .finally(() => setIsLoading(false))
        }
        catch (error) {
            console.log("failed to create note.")
            navigate("/login")
        }
    }, [])

    function backButtonOnClick() {
        const id = location.state._id
        const content = document.getElementById("notecontent") as HTMLDivElement
        setIsLoading(true)
        saveNote({ _id: id, content: content.innerText })
            .then(res => {
                navigate("/")
            })
            .finally(() => setIsLoading(false))
    }

    function onKeyDownCapture(e: React.KeyboardEvent<HTMLDivElement>) {
        if (((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') || e.key.toLowerCase() === "enter") {
            const id = location.state._id
            const content = document.getElementById("notecontent") as HTMLDivElement
            if (e.key.toLowerCase() !== "enter") e.preventDefault()
            saveNote({ _id: id, content: content.innerText })
        }
    }

    return (
        <div className="flex flex-col h-dvh justify-center items-center" onKeyDownCapture={onKeyDownCapture}>
            <div className="note max-h-[70%] h-[70%] w-[70dvw] mb-10 p-3 overflow-y-auto" id="notecontent" contentEditable="true" />
            {/* <Toolbar /> */}
            <button type="button" className="btn-cancel text-center content-center h-10 w-40" onClick={backButtonOnClick}>Back</button>
            {loading && <Loading />}
        </div>
    )
}