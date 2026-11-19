import type { Note } from "../types/types"

const API = import.meta.env.VITE_APP_API_URL

export async function createNote() {
    const res = await fetch(`${API}/notes/create`, {
        method: 'POST',
        credentials: "include",
    })

    return res.json()
}

export async function saveNote(data: Note) {
    if (!data._id || !data.content) return { status: "failed", message: "Invalid values." }
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

export async function getNote(_id: string) {
    if (!_id) return { status: "failed", message: "Invalid values." }
    const res = await fetch(`${API}/notes/${_id}`, {
        method: 'GET',
        credentials: "include",
    })

    return res.json()
}

export async function deleteNote(_id: string) {
    if (!_id) return { status: "failed", message: "Invalid values." }
    const res = await fetch(`${API}/notes/${_id}`, {
        method: 'DELETE',
        credentials: "include",
    })

    return res.json()
}