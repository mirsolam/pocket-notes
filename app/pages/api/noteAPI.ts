const API = import.meta.env.VITE_APP_API_URL

export async function createNote() {
    const res = await fetch(`${API}/notes/create`, {
        method: 'POST',
        credentials: "include",
    })

    return res.json()
}