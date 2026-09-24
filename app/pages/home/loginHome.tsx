
export default function LoginHome() {


    return (
        <div className="flex h-dvh w-dvw justify-center align-content-center p-10">
            <div className="flex flex-col justify-center align-content-center text-center">
                <div className="app-logo mb-10" />
                <div className="font-bold title mb-10">Login</div>
                <input className="input mb-10" placeholder="Email" />
                <input className="input" placeholder="Password" />
                <button type="button">Login</button>
            </div>
        </div>
    )
}