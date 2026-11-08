export default function Loading() {
    return (
        <div className="flex fixed h-screen w-screen top-[0] left-[0] z-2">
            <div className="loading justify-center items-center">
                <div className="loading-icon size-[10rem] spin " />
            </div>
        </div>
    )
}