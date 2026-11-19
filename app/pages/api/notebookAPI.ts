import type { Notebook } from "../types/types"

const API = import.meta.env.VITE_APP_API_URL

export async function createNotebook() {
    const res = await fetch(`${API}/notebooks/create`, {
        method: 'POST',
        credentials: "include",
    })

    return res.json()
}

export async function saveNotebook(data: Notebook) {
    if (!data._id || !data.content || data.currentLeft === null || data.currentLeft === undefined || !data.currentRight) return { status: "failed", message: "Invalid values." }
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

export async function deleteNotebook(_id: string) {
    if (!_id) return { status: "failed", message: "Invalid values." }
    const res = await fetch(`${API}/notebooks/${_id}`, {
        method: 'DELETE',
        credentials: "include",
    })

    return res.json()
}