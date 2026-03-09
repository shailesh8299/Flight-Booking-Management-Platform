import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();
        const users = await db.getUsers();

        // Simple mock authentication
        const user = users.find(u => u.email === email);

        if (user && user.password === password) {
            return NextResponse.json({
                user: {
                    id: user.id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    isAdmin: user.isAdmin,
                    isVerified: user.isVerified,
                    points: user.points,
                    frequent_passengers: user.frequent_passengers
                },
                token: `mock-jwt-token-${user.id}`
            });
        }

        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    } catch (error) {
        return NextResponse.json({ error: 'Authentication failed' }, { status: 400 });
    }
}
