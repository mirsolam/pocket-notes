import GeneralInput from "../component/generalInput";
import PasswordInput from "../component/passwordInput";

export default function LoginHome() {

    return (
        <div className="flex h-dvh w-dvw justify-center items-center p-10">
            <div className="flex flex-col justify-center items-center text-center">
                <div className="flex justify-center items-center">
                    <div className="app-logo mb-10 w-[10rem]" />
                </div>
                <div className="font-bold title mb-10">Login</div>
                <div className="flex flex-col text-start mb-10">
                    <GeneralInput displayName="Email" id="email-login" type="email" />
                </div>
                <div className="flex flex-col text-start">
                    <PasswordInput displayName="Password" id="password-login" />
                </div>
                <div className="my-10">
                    <button className="btn-submit h-[3rem] w-[10rem]" type="button">Login</button>
                </div>
                <div>Don't have an account? <a href="/signup" className="text-blue-700 underline decoration-blue-700">Sign-up</a></div>
                <div><a href="/forgot-password" className="text-blue-700 underline decoration-blue-700">Forgot your password?</a></div>
            </div>
        </div>
    )
}