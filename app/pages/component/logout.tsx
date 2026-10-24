import { useNavigate } from "react-router";
import { logout } from "../api/accountAPI"

export default function Logout() {
    const navigate = useNavigate();

    function logoutOnClick() {
        logout()
            .then(res => {
                if (res.status === "success") navigate("/login")
            })
    }

    return (
        <div className="flex justify-end">
            <div className="logout logout-icon mb-5" onClick={logoutOnClick}></div>
        </div>
    )
}