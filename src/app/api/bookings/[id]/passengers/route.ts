import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    const bookingId = params.id;
    const allPassengers = await db.getPassengers();
    const passengers = allPassengers.filter(p => p.booking_id === bookingId);
    return NextResponse.json(passengers);
}
