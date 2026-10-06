
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

    function onBlur(e: React.FocusEvent<HTMLInputElement>) {
        const element = e.currentTarget as HTMLInputElement
        const error = document.getElementById(`${element.id}-error`) as HTMLSpanElement

        if (element.value.trim() === '' || element.value.length < 6) {
            element.ariaInvalid = "true"
            error!.textContent = "Please enter a valid password."
        }
        else {
            element.ariaInvalid = "false"
            error!.textContent = ""
        }
    }


    return (
        <>
            <label htmlFor={id}>{displayName}</label>
            <div className="flex relative justify-end items-center">
                <div className="show-password-icon w-[1.7rem] absolute pr-2" onClick={onShowPasswordClick} />
                <input id={id} type="password" className="input h-[2.3rem]" onBlur={onBlur} />
            </div>
            <span className="text-red-500" id={`${id}-error`} aria-live="polite"></span>
        </>
    )
}