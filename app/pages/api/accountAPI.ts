const API = import.meta.env.VITE_APP_API_URL

export async function registerAccount(data: { name: string, email: string, password: string }) {
    if (!data.name || !data.email || !data.password) return { status: "failed", message: "Invalid values." }

    const res = await fetch(`${API}/users/register`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json"
        }
    })

    return res.json()
}

export async function login(data: { email: string, password: string }) {
    if (!data.email || !data.password) return { status: "failed", message: "Invalid values." }

    const res = await fetch(`${API}/users/login`, {
        method: 'POST',
        credentials: "include",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json"
        }
    })

    return res.json()
}

export async function checkSessionValidity() {
    const res = await fetch(`${API}/users/checksession`, {
        method: 'GET',
        credentials: "include",
    })

    return res.json()
}