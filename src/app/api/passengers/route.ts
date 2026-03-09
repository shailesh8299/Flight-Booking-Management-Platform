import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const bookingId = searchParams.get('bookingId');

    let passengers = await db.getPassengers();
    if (bookingId) {
        passengers = passengers.filter(p => p.booking_id === bookingId);
    }

    return NextResponse.json(passengers);
}

export async function POST(request: Request) {
    try {
        const data = await request.json();
        const newPassenger = {
            ...data,
            id: `p${Date.now()}`
        };
        await db.addPassenger(newPassenger);
        return NextResponse.json(newPassenger, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create passenger' }, { status: 400 });
    }
}
