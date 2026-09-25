
export default function PasswordInput({
    displayName,
    id
}
    :
    {
        displayName: string;
        id: string;
    }
) {

    function onShowPasswordClick() {
        const passwordElement: HTMLInputElement = document.getElementById(id) as HTMLInputElement
        passwordElement.type = passwordElement.type === "password" ? "text" : "password"
    }

    return (
        <>
            <label htmlFor={id}>{displayName}</label>
            <div className="flex relative justify-end items-center">
                <div className="show-password-icon w-[1.7rem] absolute pr-2" onClick={onShowPasswordClick} />
                <input id={id} type="password" className="input h-[2.3rem]" />
            </div>
        </>
    )
}