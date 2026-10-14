import type { GeneralInput } from "../types/types"

export default function GeneralInput(
    {
        displayName,
        id,
        type,
        required,
    }
        : GeneralInput
) {

    function onBlur(e: React.FocusEvent<HTMLInputElement>) {
        const element = e.currentTarget as HTMLInputElement
        const error = document.getElementById(`${element.id}-error`) as HTMLSpanElement

        if (element.value.trim() === '' && required) {
            element.ariaInvalid = "true"
            error!.textContent = `Please enter a valid ${displayName.toLowerCase()}.`
        }
        else {
            element.ariaInvalid = "false"
            error!.textContent = ""
        }
    }

    return (
        <>
            <label htmlFor={id}>{displayName}</label>
            <input id={id} type={type} className="input h-[2.3rem]" required={required} onBlur={onBlur} aria-invalid="false" aria-describedby="value-error" />
            <span className="text-red-500" id={`${id}-error`} aria-live="polite"></span>
        </>

    )
}