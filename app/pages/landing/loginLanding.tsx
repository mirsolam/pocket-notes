import GeneralInput from "~/pages/component/generalInput";
import PasswordInput from "~/pages/component/passwordInput";
import { login } from "../api/accountAPI";
import { useNavigate } from "react-router";

export default function LoginLanding() {
    const navigate = useNavigate();

    function onLoginClick() {
        const email = document.getElementById("email-login") as HTMLInputElement
        const password = document.getElementById("password-login") as HTMLInputElement

        const res = login({ email: email.value, password: password.value })
        res.then(data => {
            navigate("/")
        })
    }

    return (
        <div className="flex h-dvh w-dvw justify-center items-center p-10">
            <div className="flex flex-col justify-center items-center text-center">
                <div className="flex justify-center items-center">
                    <div className="app-logo mb-10 w-[10rem]" />
                </div>
                <div className="font-bold title mb-10">Login</div>
                <div className="flex flex-col text-start mb-10">
                    <GeneralInput displayName="Email" id="email-login" type="email" required={true} />
                </div>
                <div className="flex flex-col text-start">
                    <PasswordInput displayName="Password" id="password-login" />
                </div>
                <div className="my-10">
                    <button className="btn-submit h-[3rem] w-[10rem]" type="button" onClick={onLoginClick}>Login</button>
                </div>
                <div>Don't have an account? <a href="/signup" className="text-blue-700 underline decoration-blue-700">Sign-up</a></div>
                <div><a href="/forgot-password" className="text-blue-700 underline decoration-blue-700">Forgot your password?</a></div>
            </div>
        </div>
    )
}