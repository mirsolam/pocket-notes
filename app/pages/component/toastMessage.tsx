import { useEffect, useState } from "react";

export default function ToastMessage({ message, setMessage, color }: { message: string; setMessage: React.Dispatch<React.SetStateAction<string | undefined>>; color: string; }) {
    useEffect(() => {
        if (message) {
            let progress = 100
            const progressBar = document.getElementById("toast-progress")
            progressBar!.style.width = progress + '%'
            setTimeout(() => {
                setMessage(undefined)
            }, 3000)
            const intervalId = setInterval(() => {
                progress -= 100
                progressBar!.style.width = progress + '%'

                if (progress <= 0) clearInterval(intervalId)
            }, 1000)
        }
    }, [message])

    return (
        message &&
        <div className={`${color === "success" ? "bg-green-500 text-black" : "bg-red-500 text-white"} flex flex-col fixed top-5 right-0 w-full h-[4rem] pt-5 justify-center items-center`}>
            {message}
            <div className="flex w-full h-full justify-end items-end">
                <div className="progress w-[100%] h-2 bg-white" id="toast-progress" />
            </div>
        </div>
    )
}