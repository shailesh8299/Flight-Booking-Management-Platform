import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
        return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    const notifications = await db.getNotifications(userId);
    return NextResponse.json(notifications);
}

export async function POST(request: Request) {
    const { userId } = await request.json();
    if (!userId) return NextResponse.json({ error: 'User ID required' }, { status: 400 });

    await db.readNotifications(userId);
    return NextResponse.json({ success: true });
}
