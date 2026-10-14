import type { Login, User } from "../types/types"

const API = import.meta.env.VITE_APP_API_URL

export async function registerAccount(data: User) {
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

export async function login(data: Login) {
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

export async function logout() {
    const res = await fetch(`${API}/users/logout`, {
        method: 'GET',
        credentials: "include",
    })

    return res.json()
}