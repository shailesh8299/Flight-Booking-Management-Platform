import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    const users = await db.getUsers();
    const user = users.find(u => u.id === params.id);

    if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
}

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const updates = await request.json();
        const updatedUser = await db.updateUser(params.id, updates);

        if (!updatedUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json(updatedUser);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update user' }, { status: 400 });
    }
}
