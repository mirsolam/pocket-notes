const API = import.meta.env.VITE_APP_API_URL

export async function createNotebook() {
    const res = await fetch(`${API}/notebooks/create`, {
        method: 'POST',
        credentials: "include",
    })

    return res.json()
}

export async function saveNotebook(data: { id: string, title: string, currentLeft: number, currentRight: number, content: Array<string> }) {
    if (!data.id || !data.content || data.currentLeft === null || data.currentLeft === undefined || !data.currentRight) return { status: "failed", message: "Invalid values." }
    const res = await fetch(`${API}/notebooks/save`, {
        method: 'POST',
        credentials: "include",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json"
        }
    })

    return res.json()
}

export async function getNotebook(id: string) {
    if (!id) return { status: "failed", message: "Invalid values." }
    const res = await fetch(`${API}/notebooks/${id}`, {
        method: 'GET',
        credentials: "include",
    })

    return res.json()
}