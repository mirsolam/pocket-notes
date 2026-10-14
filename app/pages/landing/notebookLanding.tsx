import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { checkSessionValidity } from "../api/accountAPI";
import { getNotebook, saveNotebook } from "../api/notebookAPI";
import GeneralInput from "../component/generalInput";

export default function NotebookLanding() {
    const navigate = useNavigate();
    const location = useLocation()
    const pageNumberOrderRef = useRef({ currentLeft: 0, currentRight: 1 })
    const pageContentOrderRef = useRef(["", ""])

    useEffect(() => {
        checkSessionValidity()
            .then(data => {
                if (data.status !== "success") navigate("/login")

                if (location.state.id)
                    getNotebook(location.state.id)
                        .then(res => {
                            const notebookTitle = document.getElementById("notebook-title") as HTMLInputElement
                            const leftSidePage: HTMLDivElement = document.getElementById("page-leftside") as HTMLDivElement
                            const rightSidePage: HTMLDivElement = document.getElementById("page-rightside") as HTMLDivElement

                            if (res.status === "success") {
                                pageContentOrderRef.current = res.data.content
                                pageNumberOrderRef.current.currentLeft = res.data.currentLeft
                                pageNumberOrderRef.current.currentRight = res.data.currentRight

                                if (notebookTitle) notebookTitle.value = res.data.title ?? ""
                                if (leftSidePage) leftSidePage.textContent = pageContentOrderRef.current[pageNumberOrderRef.current.currentLeft]
                                if (rightSidePage) rightSidePage.textContent = pageContentOrderRef.current[pageNumberOrderRef.current.currentRight]
                            }
                        })
            })
            .catch(error => {
                navigate("/login")
            })
    })

    function flipPage(e: React.MouseEvent<HTMLDivElement>, otherChevron: string) {
        const chevron: HTMLDivElement = e.target as HTMLDivElement
        const flipDirection = chevron.id
        const leftSide: HTMLDivElement = document.getElementById("page-leftside")! as HTMLDivElement
        const rightSidePage: HTMLDivElement = document.getElementById("page-rightside")! as HTMLDivElement

        document.getElementById(otherChevron)?.classList.add("div-disabled")
        chevron.classList.add("div-disabled")

        saveContent()

        if (flipDirection === "flip-left") {
            pageNumberOrderRef.current.currentRight += 2
            pageNumberOrderRef.current.currentLeft += 2

            pageContentOrderRef.current.push("")
            pageContentOrderRef.current.push("")

            rightSidePage.contentEditable = "false"
            !rightSidePage.className.includes("flip-left") ? rightSidePage.classList.add("flip-left") : ""
        }
        else if (flipDirection === "flip-right") {
            if (pageNumberOrderRef.current.currentLeft === 0) {
                document.getElementById(otherChevron)?.classList.remove("div-disabled")
                chevron.classList.remove("div-disabled")
                return
            }
            pageNumberOrderRef.current.currentRight -= 2
            pageNumberOrderRef.current.currentLeft -= 2

            leftSide.contentEditable = "false"
            !leftSide.className.includes("flip-right") ? leftSide.classList.add("flip-right") : ""
        }

        rightSidePage.textContent = ""
        leftSide.textContent = ""
    }

    function replacePage() {
        const leftSide: HTMLDivElement = document.getElementById("page-leftside")! as HTMLDivElement
        const rightSidePage: HTMLDivElement = document.getElementById("page-rightside")! as HTMLDivElement

        leftSide.replaceWith(createNewPage("left"))
        rightSidePage.replaceWith(createNewPage("right"))

        document.getElementById("flip-left")?.classList.remove("div-disabled")
        document.getElementById("flip-right")?.classList.remove("div-disabled")


    }

    function createNewPage(side: "left" | "right"): HTMLDivElement {
        const newPage = document.createElement("div")
        newPage.contentEditable = "true"

        if (side === "right") {
            newPage.id = "page-rightside"
            newPage.className = "note left max-h-[80%] h-[80%] max-w-[50%] w-[50%] p-3 overflow-y-auto"
            newPage.textContent = pageContentOrderRef.current[pageNumberOrderRef.current.currentRight]
            newPage.addEventListener("transitionend", replacePage)

        }
        else if (side === "left") {
            newPage.id = "page-leftside"
            newPage.className = "note right max-h-[80%] h-[80%] max-w-[50%] w-[50%] p-3 overflow-y-auto"
            newPage.textContent = pageContentOrderRef.current[pageNumberOrderRef.current.currentLeft]
            newPage.addEventListener("transitionend", replacePage)

        }

        return newPage
    }

    function saveContent() {
        const leftSide: HTMLDivElement = document.getElementById("page-leftside")! as HTMLDivElement
        const rightSidePage: HTMLDivElement = document.getElementById("page-rightside")! as HTMLDivElement
        pageContentOrderRef.current[pageNumberOrderRef.current.currentLeft] = leftSide.textContent
        pageContentOrderRef.current[pageNumberOrderRef.current.currentRight] = rightSidePage.textContent
    }

    function backButtonOnClick() {
        const id = location.state.id
        const title = document.getElementById("notebook-title") as HTMLInputElement
        saveContent()
        saveNotebook({ id: id, title: title.value, currentLeft: pageNumberOrderRef.current.currentLeft, currentRight: pageNumberOrderRef.current.currentRight, content: pageContentOrderRef.current })
            .then(res => {
                navigate("/")
            })
    }

    return (
        <div className="flex flex-col h-dvh justify-center items-center py-5">
            <GeneralInput displayName="Title" id="notebook-title" required={false} type="text" />
            <div className="flex h-full w-full justify-center items-center" id="notebook-parent">
                <div className="flex h-full w-full justify-end items-center relative">
                    <div className="chevronleft-icon size-7 cursor-pointer" id="flip-right" onClick={(e) => flipPage(e, "flip-left")} />
                    <div className="note right max-h-[80%] h-[80%] max-w-[50%] w-[50%] p-3 overflow-y-auto" contentEditable="true" id="page-leftside" onTransitionEnd={replacePage} />
                    <div className="note prop right max-h-[80%] h-[80%] max-w-[50%] w-[50%] p-3 overflow-y-auto absolute" />
                </div>
                <div className="flex h-full w-full justify-start items-center relative">
                    <div className="note left max-h-[80%] h-[80%] max-w-[50%] w-[50%] p-3 overflow-y-auto" contentEditable="true" id="page-rightside" onTransitionEnd={replacePage} />
                    <div className="note prop left max-h-[80%] h-[80%] max-w-[50%] w-[50%] p-3 overflow-y-auto absolute" />
                    <div className="chevronright-icon size-7 cursor-pointer" id="flip-left" onClick={(e) => flipPage(e, "flip-right")} />
                </div>
            </div>
            <div className="flex text-toolbar h-[3rem] mb-10">
                <div className="checklist-icon" />
                <div className="textcolor-icon" />
                <div className="fontsize-icon" />
                <div className="highlight-icon" />
                <div className="bold-icon" />
                <div className="italic-icon" />
            </div>
            <button type="button" className="btn-cancel text-center content-center h-10 w-40" onClick={backButtonOnClick}>Back</button>
        </div>
    )
}