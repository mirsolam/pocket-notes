const API = import.meta.env.VITE_APP_API_URL

export async function getDashboardList() {
    const res = await fetch(`${API}/dashboard/`, {
        method: 'GET',
        credentials: "include",
    })

    return res.json()
}