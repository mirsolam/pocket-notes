import GeneralInput from "~/pages/component/generalInput";
import PasswordInput from "~/pages/component/passwordInput";
import { registerAccount } from "../api/accountAPI";
import { useNavigate } from "react-router";

export default function SignUpLanding() {
    const navigate = useNavigate();

    function onRegisterClick() {
        const name = document.getElementById("name-signup") as HTMLInputElement
        const email = document.getElementById("email-signup") as HTMLInputElement
        const password = document.getElementById("password-signup") as HTMLInputElement
        const confirmPassword = document.getElementById("confirmPassword-signup") as HTMLInputElement
        const passwordMatchError = document.getElementById("passwordMatch-signup-error") as HTMLSpanElement

        if (password.value !== confirmPassword.value) passwordMatchError.textContent = "Passwords do not match."
        else passwordMatchError.textContent = ""

        const res = registerAccount({ name: name.value, email: email.value, password: password.value })
        res.then(data => {
            navigate("/login")
        })

    }

    return (
        <div className="flex h-dvh w-dvw justify-center items-center p-10">
            <div className="flex flex-col justify-center items-center text-center">
                <div className="flex justify-center items-center">
                    <div className="app-logo mb-10 w-[10rem]" />
                </div>
                <div className="font-bold title mb-10">Sign-up</div>
                <div className="flex flex-col text-start mb-10">
                    <GeneralInput displayName="Name" id="name-signup" type="text" required={true} />
                </div>
                <div className="flex flex-col text-start mb-10">
                    <GeneralInput displayName="Email" id="email-signup" type="email" required={true} />
                </div>
                <div className="flex flex-col text-start mb-10">
                    <PasswordInput displayName="Password" id="password-signup" />
                </div>
                <div className="flex flex-col text-start">
                    <PasswordInput displayName="Confirm passowrd" id="confirmPassword-signup" />
                    <span className="text-red-500" id="passwordMatch-signup-error"></span>
                </div>
                <div className="my-10">
                    <button className="btn-submit h-[3rem] w-[10rem]" type="button" onClick={onRegisterClick}>Register</button>
                </div>
                <div>Already have an account? <a href="/login" className="text-blue-700 underline decoration-blue-700">Login</a></div>
            </div>
        </div>
    )
}