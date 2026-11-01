import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { checkSessionValidity } from "../api/accountAPI";
import { getNotebook, saveNotebook } from "../api/notebookAPI";
import GeneralInput from "../component/generalInput";
import Toolbar from "../component/toolbar";

export default function NotebookLanding() {
    const navigate = useNavigate();
    const location = useLocation()
    const pageNumberOrderRef = useRef({ currentLeft: 0, currentRight: 1 })
    const pageContentOrderRef = useRef(["", ""])
    const MAXHEIGHT = 683
    const MAXCHARCOUNT = 1447

    useEffect(() => {
        checkSessionValidity()
            .then(data => {
                if (data.status !== "success") navigate("/login")

                if (location.state._id)
                    getNotebook(location.state._id)
                        .then(res => {
                            const notebookTitle = document.getElementById("notebook-title") as HTMLInputElement
                            const leftSidePage: HTMLDivElement = document.getElementById("page-leftside") as HTMLDivElement
                            const rightSidePage: HTMLDivElement = document.getElementById("page-rightside") as HTMLDivElement

                            if (res.status === "success") {
                                pageContentOrderRef.current = res.data.content
                                pageNumberOrderRef.current.currentLeft = res.data.currentLeft
                                pageNumberOrderRef.current.currentRight = res.data.currentRight

                                if (notebookTitle) notebookTitle.value = res.data.title ?? ""
                                if (leftSidePage) leftSidePage.innerText = pageContentOrderRef.current[pageNumberOrderRef.current.currentLeft]
                                if (rightSidePage) rightSidePage.innerText = pageContentOrderRef.current[pageNumberOrderRef.current.currentRight]
                            }
                        })
            })
            .catch(error => {
                navigate("/login")
            })
    }, [])

    function lgBreakpointCheck() {
        const LGBREAKPOINT = 1024
        return window.innerWidth >= LGBREAKPOINT
    }

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
            if (lgBreakpointCheck())
                !rightSidePage.className.includes("flip-left") ? rightSidePage.classList.add("flip-left") : ""
            else if (!lgBreakpointCheck())
                !rightSidePage.className.includes("no-flip") ? rightSidePage.classList.add("no-flip") : ""
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
            if (lgBreakpointCheck())
                !leftSide.className.includes("flip-right") ? leftSide.classList.add("flip-right") : ""
            else if (!lgBreakpointCheck())
                !leftSide.className.includes("no-flip") ? leftSide.classList.add("no-flip") : ""
        }

        rightSidePage.innerText = ""
        leftSide.innerText = ""
    }

    function replacePage(sideToFocus: string) {
        const leftSide: HTMLDivElement = document.getElementById("page-leftside")! as HTMLDivElement
        const rightSidePage: HTMLDivElement = document.getElementById("page-rightside")! as HTMLDivElement

        leftSide.replaceWith(createNewPage("left"))
        rightSidePage.replaceWith(createNewPage("right"))

        document.getElementById(sideToFocus)?.focus()

        document.getElementById("flip-left")?.classList.remove("div-disabled")
        document.getElementById("flip-right")?.classList.remove("div-disabled")

    }

    function createNewPage(side: "left" | "right"): HTMLDivElement {
        const newPage = document.createElement("div")
        newPage.contentEditable = "true"
        newPage.addEventListener("beforeinput", (e) => {
            const event = e as unknown as React.InputEvent<HTMLDivElement>
            limitInputLength(event)
        })
        newPage.addEventListener("paste", (e) => {
            const event = e as unknown as React.ClipboardEvent<HTMLDivElement>
            notebookOnPasteCapture(event)
        }, { capture: true })

        if (side === "right") {
            newPage.id = "page-rightside"
            newPage.className = "note notebook-a4 left p-3 overflow-y-auto"
            newPage.innerText = pageContentOrderRef.current[pageNumberOrderRef.current.currentRight]
            newPage.addEventListener("transitionend", () => replacePage("page-leftside"))
        }
        else if (side === "left") {
            newPage.id = "page-leftside"
            newPage.className = "note notebook-a4 right p-3 overflow-y-auto"
            newPage.innerText = pageContentOrderRef.current[pageNumberOrderRef.current.currentLeft]
            newPage.addEventListener("transitionend", () => replacePage("page-rightside"))
        }
        return newPage
    }

    function saveContent(text?: string, side?: string, position?: number) {
        if (text && side && (position || position === 0)) {
            if (side === "page-leftside") {
                const beforeCaret = pageContentOrderRef.current[pageNumberOrderRef.current.currentLeft].slice(0, position)
                const afterCaret = pageContentOrderRef.current[pageNumberOrderRef.current.currentLeft].slice(position)
                pageContentOrderRef.current[pageNumberOrderRef.current.currentLeft] = beforeCaret + text + afterCaret
            }
            else if (side === "page-rightside") {
                const beforeCaret = pageContentOrderRef.current[pageNumberOrderRef.current.currentRight].slice(0, position) ?? ""
                const afterCaret = pageContentOrderRef.current[pageNumberOrderRef.current.currentRight].slice(position)
                pageContentOrderRef.current[pageNumberOrderRef.current.currentRight] = beforeCaret + text + afterCaret
            }
        }
        else if (!text && !side && !position) {
            const leftSide: HTMLDivElement = document.getElementById("page-leftside")! as HTMLDivElement
            const rightSidePage: HTMLDivElement = document.getElementById("page-rightside")! as HTMLDivElement
            pageContentOrderRef.current[pageNumberOrderRef.current.currentLeft] = leftSide.innerText
            pageContentOrderRef.current[pageNumberOrderRef.current.currentRight] = rightSidePage.innerText
        }
    }

    function backButtonOnClick() {
        const id = location.state._id
        const title = document.getElementById("notebook-title") as HTMLInputElement
        saveContent()
        saveNotebook({ _id: id, title: title.value, currentLeft: pageNumberOrderRef.current.currentLeft, currentRight: pageNumberOrderRef.current.currentRight, content: pageContentOrderRef.current })
            .then(res => {
                navigate("/")
            })
    }

    function limitPageContent(side: string) {
        let index = 0;

        if (side === "page-leftside") index = pageNumberOrderRef.current.currentLeft
        else if (side === "page-rightside") index = pageNumberOrderRef.current.currentRight

        const noteFormatter = document.getElementById("note-formatter")

        for (index; index < pageContentOrderRef.current.length; index += 1) {
            if (pageContentOrderRef.current[index].trim().length < 1) break
            noteFormatter!.innerText = pageContentOrderRef.current[index]

            if (noteFormatter!.offsetHeight > MAXHEIGHT) {
                const codePointText = Array.from(noteFormatter!.innerText)
                let start = 0, end = codePointText.length

                while (start < end) {
                    const mid = Math.floor((start + end + 1) / 2);
                    noteFormatter!.innerText = codePointText.slice(0, mid).join("");
                    if (noteFormatter!.offsetHeight <= MAXHEIGHT) {
                        start = mid;
                    } else {
                        end = mid - 1;
                    }
                }
                pageContentOrderRef.current[index] = codePointText.slice(0, start).join("")
                pageContentOrderRef.current[index + 1] = codePointText.slice(start).join("") + pageContentOrderRef.current[index + 1]
            }
        }
        const leftSide: HTMLDivElement = document.getElementById("page-leftside")! as HTMLDivElement
        const rightSidePage: HTMLDivElement = document.getElementById("page-rightside")! as HTMLDivElement

        leftSide.innerText = pageContentOrderRef.current[pageNumberOrderRef.current.currentLeft]
        rightSidePage.innerText = pageContentOrderRef.current[pageNumberOrderRef.current.currentRight]
    }

    function limitInputLength(e: React.InputEvent<HTMLDivElement>) {
        const element = e.target as HTMLDivElement
        const noteFormatter = document.getElementById("note-formatter")
        noteFormatter!.innerText = element.innerText + e.data

        if (noteFormatter!.scrollHeight > element.clientHeight) {
            if (element.id === "page-leftside") {
                const rightSidePage: HTMLDivElement = document.getElementById("page-rightside")! as HTMLDivElement
                rightSidePage.focus()
            }
            else if (element.id === "page-rightside") {
                const chevron = document.getElementById("flip-left") as HTMLDivElement
                chevron.click()
            }
        }
    }

    function notebookOnPasteCapture(e: React.ClipboardEvent<HTMLDivElement>) {
        e.preventDefault()
        const element = e.target as HTMLDivElement
        const pasteContent = e.clipboardData.getData("text/plain")
        const position = getCaretPosition(element)
        saveContent(pasteContent, element.id, position)
        limitPageContent(element.id)
    }

    function onKeyDownCapture(e: React.KeyboardEvent<HTMLDivElement>) {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
            const id = location.state._id
            const title = document.getElementById("notebook-title") as HTMLInputElement
            e.preventDefault()
            saveContent()
            saveNotebook({
                _id: id,
                title: title.value,
                currentLeft: pageNumberOrderRef.current.currentLeft,
                currentRight: pageNumberOrderRef.current.currentRight,
                content: pageContentOrderRef.current
            })
        }
    }

    function getCaretPosition(element: HTMLDivElement) {
        const selection = window.getSelection();

        if (!selection?.rangeCount) return 0;

        const range = selection.getRangeAt(0);
        const preCaretRange = range.cloneRange();

        preCaretRange.selectNodeContents(element);
        preCaretRange.setEnd(range.endContainer, range.endOffset);

        return preCaretRange.toString().length;
    }

    return (
        <div className="flex flex-col h-dvh md:justify-center-safe xs:justify-center items-center py-5 xl:scale-100 lg:scale-95 md:scale-100 xs:scale-50" onKeyDownCapture={onKeyDownCapture}>
            <GeneralInput displayName="Title" id="notebook-title" required={false} type="text" />
            <div className="flex lg:flex-row xs:flex-col notebook-a4 justify-center items-center my-5" id="notebook-parent">
                <div className="flex h-full w-full justify-end items-center relative">
                    <div className="note notebook-a4 right p-3 overflow-y-auto" contentEditable="true" id="page-leftside" onTransitionEnd={() => replacePage("page-rightside")} onBeforeInput={limitInputLength} onPasteCapture={notebookOnPasteCapture} />
                    <div className="note notebook-a4 prop right p-3 absolute" />
                </div>
                <div className="flex h-full w-full justify-start items-center relative">
                    <div className="note notebook-a4 left p-3 overflow-y-auto" contentEditable="true" id="page-rightside" onTransitionEnd={() => replacePage("page-leftside")} onBeforeInput={limitInputLength} onPasteCapture={notebookOnPasteCapture} />
                    <div className="note notebook-a4 prop left overflow-hidden p-3 absolute" />
                </div>
            </div>
            <div className="flex justify-center items-center">
                <div className="chevronleft-icon size-10 cursor-pointer" id="flip-right" onClick={(e) => flipPage(e, "flip-left")} />
                <button type="button" className="btn-cancel text-center content-center h-10 w-40 mx-5" onClick={backButtonOnClick}>Back</button>
                <div className="chevronright-icon size-10 cursor-pointer" id="flip-left" onClick={(e) => flipPage(e, "flip-right")} />
            </div>
            <div className="note notebook-a4 formatter right p-3" id="note-formatter" >Sup</div>

        </div>
    )
}