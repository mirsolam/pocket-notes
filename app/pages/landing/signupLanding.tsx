import GeneralInput from "~/pages/component/generalInput";
import PasswordInput from "~/pages/component/passwordInput";

export default function SignUpLanding() {

    return (
        <div className="flex h-dvh w-dvw justify-center items-center p-10">
            <div className="flex flex-col justify-center items-center text-center">
                <div className="flex justify-center items-center">
                    <div className="app-logo mb-10 w-[10rem]" />
                </div>
                <div className="font-bold title mb-10">Sign-up</div>
                <div className="flex flex-col text-start mb-10">
                    <GeneralInput displayName="Name" id="name-signUp" type="text" />
                </div>
                <div className="flex flex-col text-start mb-10">
                    <GeneralInput displayName="Email" id="email-signUp" type="email" />
                </div>
                <div className="flex flex-col text-start mb-10">
                    <PasswordInput displayName="Password" id="password-signUp" />
                </div>
                <div className="flex flex-col text-start">
                    <PasswordInput displayName="Confirm passowrd" id="confirmPassword-signUp" />
                </div>
                <div className="my-10">
                    <button className="btn-submit h-[3rem] w-[10rem]" type="button">Register</button>
                </div>
                <div>Already have an account? <a href="/login" className="text-blue-700 underline decoration-blue-700">Login</a></div>
            </div>
        </div>
    )
}