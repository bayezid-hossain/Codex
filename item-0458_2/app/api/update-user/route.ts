

export async function POST(request: Request) {
    // Parse the request body
    const body = await request.json();
    const { name } = body;
    console.log(body)

    // e.g. Insert new user into your DB
    const newUser = { "message": "ok" };

    return new Response(JSON.stringify(newUser), {
        status: 201,
        headers: { 'Content-Type': 'application/json' }
    });
}