
export default function NoteLanding() {
    return (
        <div className="flex flex-col h-dvh justify-center items-center">
            <div className="note max-h-[70%] h-[70%] w-[70dvw] mb-10 p-3 overflow-y-auto" contentEditable="true" />
            <div className="flex text-toolbar h-[3rem] mb-10">
                <div className="checklist-icon" />
                <div className="textcolor-icon" />
                <div className="fontsize-icon" />
                <div className="highlight-icon" />
                <div className="bold-icon" />
                <div className="italic-icon" />
            </div>
            <a className="btn-cancel text-center content-center h-10 w-40" href="/">Back</a>
        </div>
    )
}