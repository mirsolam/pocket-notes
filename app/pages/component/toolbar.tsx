export default function Toolbar() {

    function toolOnClick(e: React.MouseEvent<HTMLDivElement>) {
        const element = e.target as HTMLDivElement
    }

    return (
        <div className="flex text-toolbar h-[3rem] mb-10">
            <div className="checklist-icon" />
            <div className="textcolor-icon" />
            <div className="fontsize-icon" />
            <div className="highlight-icon" />
            <div className="bold-icon" id="tool-bold" />
            <div className="italic-icon" />
        </div>
    )
}