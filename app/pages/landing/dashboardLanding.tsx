import { Outlet } from "react-router";

export default function DashboardLanding() {

    return (
        <div>
            <a className="btn-submit" href="/note/new">Create new note</a>
            <a className="btn-submit">Create new notebook</a>
        </div>
    )
}