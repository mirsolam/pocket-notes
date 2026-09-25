
export default function NotebookLanding() {

    function flipPage(e: React.MouseEvent<HTMLDivElement>) {
        const chevron: HTMLDivElement = e.target as HTMLDivElement

        const flipDirection = chevron.id

        if (flipDirection === "flip-left") {
            const rightSidePage: HTMLDivElement = document.getElementById("page-rightside")! as HTMLDivElement

            !rightSidePage.className.includes("flip-left") ? rightSidePage.classList.add("flip-left") : ""

        }
        else if (flipDirection === "flip-right") {

        }
    }

    function replacePage(e: React.AnimationEvent<HTMLDivElement>) {
        const oldPage: HTMLDivElement = e.target as HTMLDivElement
        const newPage = document.createElement("div")
        newPage.contentEditable = "true"
        newPage.id = "page-rightside"
        newPage.className = "note left max-h-[80%] h-[80%] max-w-[25%] w-[25%] p-3 overflow-y-auto"

        oldPage.replaceChild(newPage, oldPage)

    }

    return (
        <div className="flex flex-col h-dvh justify-center items-center">
            <div className="flex h-full w-full justify-center items-center" id="notebook-parent">
                <div className="chevronleft-icon size-7" id="flip-left" onClick={flipPage} />
                <div className="note right max-h-[80%] h-[80%] max-w-[25%] w-[25%] p-3 overflow-y-auto" contentEditable="true" id="page-leftside" />
                <div className="note left max-h-[80%] h-[80%] max-w-[25%] w-[25%] p-3 overflow-y-auto" contentEditable="true" id="page-rightside" onAnimationEnd={replacePage} />
                <div className="chevronright-icon size-7" id="flip-right" onClick={flipPage} />
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