import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { checkSessionValidity } from "../api/accountAPI";
import { getNote, saveNote } from "../api/noteAPI";
import Loading from "../component/loading";
import ToastMessage from "../component/toastMessage";

export default function NoteLanding() {
    const navigate = useNavigate()
    const location = useLocation()
    const [loading, setIsLoading] = useState(false)
    const [alertMessage, setAlertMessage] = useState<string>()
    const [alertColor, setAlertColor] = useState("success")

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
                            .catch(error => {
                                setAlertColor("error")
                                setAlertMessage("Failed to load data. Please try again later.")
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
                .then(res => {
                    if (res.status === "success") {
                        setAlertColor("success")
                        setAlertMessage("Saved.")
                    }
                })
                .catch(error => {
                    setAlertColor("error")
                    setAlertMessage("Failed to save. Please try again later.")
                })
        }
    }

    return (
        <div className="flex flex-col h-dvh justify-center items-center" onKeyDownCapture={onKeyDownCapture}>
            <div className="note max-h-[70%] h-[70%] w-[70dvw] mb-10 p-3 overflow-y-auto" id="notecontent" contentEditable="true" />
            {/* <Toolbar /> */}
            <button type="button" className="btn-cancel text-center content-center h-10 w-40" onClick={backButtonOnClick}>Back</button>
            {loading && <Loading />}
            {alertMessage && <ToastMessage message={alertMessage} setMessage={setAlertMessage} color={alertColor} />}
        </div>
    )
}