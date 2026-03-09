import { NextResponse } from 'next/server';
import { db, User } from '@/lib/db';

export async function POST(request: Request) {
    try {
        const { email, password, firstName, lastName } = await request.json();
        const users = await db.getUsers();

        // Check if user already exists
        if (users.some(u => u.email === email)) {
            return NextResponse.json({ error: 'User already exists' }, { status: 400 });
        }

        const newUser: User = {
            id: `u${Date.now()}`,
            email,
            password,
            isVerified: false,
            firstName: firstName || '',
            lastName: lastName || '',
            phone: '',
            role: 'user' as const,
            isAdmin: false,
            points: 0,
            frequent_passengers: [],
            created_at: new Date().toISOString()
        };

        await db.addUser(newUser);

        return NextResponse.json({
            user: newUser,
            token: `mock-jwt-token-${newUser.id}`
        }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Registration failed' }, { status: 400 });
    }
}
