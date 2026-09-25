
export default function GeneralInput(
    {
        displayName,
        id,
        type,
    }
        :
        {
            displayName: string;
            id: string;
            type: "text" | "email";
        }
) {
    return (
        <>
            <label htmlFor={id}>{displayName}</label>
            <input id={id} type={type} className="input h-[2.3rem]" />
        </>

    )
}