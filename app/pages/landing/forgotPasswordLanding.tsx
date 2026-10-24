import { useRef, useState } from "react";
import GeneralInput from "../component/generalInput";
import PasswordInput from "../component/passwordInput";
import { forgotPassword, isEmailValid } from "../api/accountAPI";
import { useNavigate } from "react-router";

export default function ForgotPasswordLanding() {
    const [showChangePassword, setShowChangePassword] = useState(false)
    const navigate = useNavigate();
    const emailRef = useRef(null as unknown as string)

    function onEmailSubmit() {
        const email = document.getElementById("email-forgotPassword") as HTMLInputElement
        isEmailValid(email.value.trim())
            .then(res => {
                if (res.status === "success") {
                    emailRef.current = email.value.trim()
                    toggleShowChangePassword()
                }
            })
            .catch(error => {
                console.log("Error")
            })
    }

    function toggleShowChangePassword() {
        setShowChangePassword(prevState => !prevState)
    }

    function onPasswordChangeSubmit() {
        const password = document.getElementById("newPassword-forgotPassword") as HTMLInputElement
        const confirmPassword = document.getElementById("confirmNewPassword-forgotPassword") as HTMLInputElement
        const passwordMatchError = document.getElementById("passwordMatch-forgotpassword-error") as HTMLSpanElement

        if (password.value !== confirmPassword.value) { passwordMatchError.textContent = "Passwords do not match."; return }
        else passwordMatchError.textContent = ""

        forgotPassword({ email: emailRef.current, password: password.value })
            .then(res => {
                if (res.status === "success") navigate("/login")
            })
            .catch(error => {
                console.log("Error")
            })
    }

    return (
        <div className="flex h-dvh w-dvw justify-center items-center p-10">
            {!showChangePassword &&
                <div className="flex flex-col justify-center items-center text-center">
                    <div className="font-bold title mb-10">Forgot your password?</div>
                    <div className="flex flex-col text-start">
                        <GeneralInput displayName="Enter your email" id="email-forgotPassword" type="email" required />
                    </div>
                    <div className="my-10">
                        <button className="btn-submit h-[3rem] w-[10rem]" type="button" onClick={onEmailSubmit}>Submit</button>
                    </div>
                    <div className="flex text-center"> <a href="/login" className="back-arrow-icon"></a>Back to login</div>
                </div>
            }
            {showChangePassword &&
                <div className="flex flex-col justify-center items-center text-center">
                    <div className="font-bold title mb-10">Reset your password</div>
                    <div className="flex flex-col text-start mb-10">
                        <PasswordInput displayName="Enter your new password" id="newPassword-forgotPassword" />
                    </div>
                    <div className="flex flex-col text-start mb-10">
                        <PasswordInput displayName="Confirm your new password" id="confirmNewPassword-forgotPassword" />
                        <span className="text-red-500" id="passwordMatch-forgotpassword-error"></span>
                    </div>
                    <div className="mb-5">
                        <button className="btn-submit h-[3rem] w-[10rem]" type="button" onClick={onPasswordChangeSubmit}>Submit</button>
                    </div>
                    <div>
                        <button className="btn-cancel h-[3rem] w-[10rem]" type="button" onClick={toggleShowChangePassword}>Back</button>
                    </div>
                </div>
            }
        </div>
    )
}