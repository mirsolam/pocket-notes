
export default function NotebookLanding() {

    function flipPage(e: React.MouseEvent<HTMLDivElement>) {
        const chevron: HTMLDivElement = e.target as HTMLDivElement
        const flipDirection = chevron.id
        const lefSidePage: HTMLDivElement = document.getElementById("page-leftside")! as HTMLDivElement
        const rightSidePage: HTMLDivElement = document.getElementById("page-rightside")! as HTMLDivElement

        if (flipDirection === "flip-left") {
            rightSidePage.contentEditable = "false"

            !rightSidePage.className.includes("flip-left") ? rightSidePage.classList.add("flip-left") : ""
        }
        else if (flipDirection === "flip-right") {
            lefSidePage.contentEditable = "false"
            !lefSidePage.className.includes("flip-right") ? lefSidePage.classList.add("flip-right") : ""
        }

        rightSidePage.textContent = ""
        lefSidePage.textContent = ""
    }

    function replacePage(e: React.TransitionEvent<HTMLDivElement> | TransitionEvent) {
        const oldPage: HTMLDivElement = e.target as HTMLDivElement
        if (oldPage.id === "page-rightside")
            oldPage.replaceWith(createNewPage("right"))
        else if (oldPage.id === "page-leftside")
            oldPage.replaceWith(createNewPage("left"))
    }

    function createNewPage(side: "left" | "right"): HTMLDivElement {
        const newPage = document.createElement("div")
        newPage.contentEditable = "true"
        newPage.addEventListener("transitionend", (e) => replacePage(e))

        if (side === "right") {
            newPage.id = "page-rightside"
            newPage.className = "note left max-h-[80%] h-[80%] max-w-[50%] w-[50%] p-3 overflow-y-auto"
        }
        else if (side === "left") {
            newPage.id = "page-leftside"
            newPage.className = "note right max-h-[80%] h-[80%] max-w-[50%] w-[50%] p-3 overflow-y-auto"
        }

        return newPage
    }

    return (
        <div className="flex flex-col h-dvh justify-center items-center">
            <div className="flex h-full w-full justify-center items-center" id="notebook-parent">
                <div className="flex h-full w-full justify-end items-center relative">
                    <div className="chevronleft-icon size-7" id="flip-left" onClick={flipPage} />
                    <div className="note right max-h-[80%] h-[80%] max-w-[50%] w-[50%] p-3 overflow-y-auto" contentEditable="true" id="page-leftside" onTransitionEnd={replacePage} />
                    <div className="note prop right max-h-[80%] h-[80%] max-w-[50%] w-[50%] p-3 overflow-y-auto absolute" />
                </div>
                <div className="flex h-full w-full justify-start items-center relative">
                    <div className="note left max-h-[80%] h-[80%] max-w-[50%] w-[50%] p-3 overflow-y-auto" contentEditable="true" id="page-rightside" onTransitionEnd={replacePage} />
                    <div className="note prop left max-h-[80%] h-[80%] max-w-[50%] w-[50%] p-3 overflow-y-auto absolute" />
                    <div className="chevronright-icon size-7" id="flip-right" onClick={flipPage} />
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
            <a className="btn-cancel text-center content-center h-10 w-40 mb-10" href="/">Back</a>
        </div>
    )
}