import { useEffect } from "react"
import { checkSessionValidity } from "../api/accountAPI"
import { useNavigate } from "react-router";

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

    return (
        <div>
            <a className="btn-submit" href="/note/new">Create new note</a>
            <a className="btn-submit" href="/notebook/new">Create new notebook</a>
        </div>
    )
}