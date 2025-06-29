const URL_API = 'http://127.0.0.1:8000/api/account/';
const API_AUTH = URL_API;

export async function get_users(
    username: string,
    city: string,
    desc: string,
    skills: string,
    status: boolean,
    rating: string
) {
    const response = await fetch(`${API_AUTH}register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username,
            city,
            desc,
            skills,
            status,
            rating,
        }),
    });

    if (!response.ok) {
        throw new Error('Failed to fetch users');
    }

    return response.json();
}