import { useState } from "react";
import GeneralInput from "../component/generalInput";
import PasswordInput from "../component/passwordInput";

export default function ForgotPasswordHome() {
    const [showChangePassword, setShowChangePassword] = useState(false)

    function onEmailSubmit() {
        /*--Back-end logic--
        .
        .
        .
        */

        toggleShowChangePassword()
    }

    function toggleShowChangePassword() {
        setShowChangePassword(prevState => !prevState)
    }
    return (
        <div className="flex h-dvh w-dvw justify-center items-center p-10">
            {!showChangePassword &&
                <div className="flex flex-col justify-center items-center text-center">
                    <div className="font-bold title mb-10">Forgot your password?</div>
                    <div className="flex flex-col text-start">
                        <GeneralInput displayName="Enter your email" id="email-forgotPassword" type="email" />
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
                    </div>
                    <div className="mb-5">
                        <button className="btn-submit h-[3rem] w-[10rem]" type="button">Submit</button>
                    </div>
                    <div>
                        <button className="btn-cancel h-[3rem] w-[10rem]" type="button" onClick={toggleShowChangePassword}>Back</button>
                    </div>
                </div>
            }
        </div>
    )
}