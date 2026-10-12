const API = import.meta.env.VITE_APP_API_URL

export async function createNote() {
    const res = await fetch(`${API}/notes/create`, {
        method: 'POST',
        credentials: "include",
    })

    return res.json()
}

export async function saveNote(data: { id: string, content: string }) {
    if (!data.id || !data.content) return { status: "failed", message: "Invalid values." }
    const res = await fetch(`${API}/notes/save`, {
        method: 'POST',
        credentials: "include",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json"
        }
    })

    return res.json()
}

export async function getNoteById(id: string) {
    if (!id) return { status: "failed", message: "Invalid values." }
    const res = await fetch(`${API}/notes/${id}`, {
        method: 'GET',
        credentials: "include",
    })

    return res.json()
}