import { useNavigate } from "react-router";
import { logout } from "../api/accountAPI"
import { useState } from "react";
import Loading from "./loading";

export default function Logout() {
    const navigate = useNavigate();
    const [loading, setIsLoading] = useState(false)


    function logoutOnClick() {
        setIsLoading(true)
        logout()
            .then(res => {
                if (res.status === "success") navigate("/login")
            })
            .finally(() => setIsLoading(false))
    }

    return (
        <div className="flex justify-end">
            <div className="logout logout-icon mb-5" onClick={logoutOnClick}></div>
            {loading && <Loading />}
        </div>
    )
}