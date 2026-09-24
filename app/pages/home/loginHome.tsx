
export default function LoginHome() {

    function onShowPasswordClick() {
        const passwordElement: HTMLInputElement = document.getElementById("password") as HTMLInputElement
        passwordElement.type = passwordElement.type === "password" ? "text" : "password"
    }

    return (
        <div className="flex h-dvh w-dvw justify-center items-center p-10">
            <div className="flex flex-col justify-center items-center text-center">
                <div className="flex justify-center items-center">
                    <div className="app-logo mb-10 w-[10rem]" />
                </div>
                <div className="font-bold title mb-10">Login</div>
                <div className="flex flex-col text-start">
                    <label htmlFor="login">Email</label>
                    <input id="login" type="email" className="input mb-10 h-[2.3rem]" />
                </div>
                <div className="flex flex-col text-start">
                    <label htmlFor="password">Password</label>
                    <div className="flex relative justify-end items-center">
                        <div className="show-password-icon w-[1.7rem] fixed pr-2" onClick={onShowPasswordClick} />
                        <input id="password" type="password" className="input h-[2.3rem]" />
                    </div>
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