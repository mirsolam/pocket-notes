import { useEffect } from "react"
import { checkSessionValidity } from "../api/accountAPI"
import { useNavigate } from "react-router";
import { createNote } from "../api/noteAPI";

export default function DashboardLanding() {
    const navigate = useNavigate();

    useEffect(() => {
        checkSessionValidity()
            .then(data => {
                if (data.status !== "success") navigate("/login")
            })
            .catch(error => {
                navigate("/login")
            })
    })

    function createNoteOnClick() {
        createNote()
    }

    return (
        <div>
            <a className="btn-submit" href="/note/new" onClick={createNoteOnClick}>Create new note</a>
            <a className="btn-submit" href="/notebook/new">Create new notebook</a>
        </div>
    )
}