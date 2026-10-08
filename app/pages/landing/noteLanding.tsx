import { useEffect } from "react";
import { useNavigate } from "react-router";
import { checkSessionValidity } from "../api/accountAPI";

export default function NoteLanding() {
    const navigate = useNavigate();

    useEffect(() => {
        try {
            checkSessionValidity()
                .then(data => {
                    if (data.status !== "success") navigate("/login")
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
            <a className="btn-cancel text-center content-center h-10 w-40" href="/">Back</a>
        </div>
    )
}