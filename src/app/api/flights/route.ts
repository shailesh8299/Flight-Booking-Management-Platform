import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { generateFlights } from '@/lib/flightData';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const from = searchParams.get('from');
    const to = searchParams.get('to');

    if (from && to) {
        // Generate flights for this route
        const generatedFlights = generateFlights(from, to);

        // Apply dynamic pricing logic
        const flightsWithDynamicPricing = generatedFlights.map(f => {
            let adjustedPrice = f.price;
            if (f.seats_available < 10) {
                adjustedPrice = Math.round(f.price * 1.25);
            } else if (f.seats_available < 30) {
                adjustedPrice = Math.round(f.price * 1.10);
            }
            return { ...f, price: adjustedPrice };
        });

        // Add to db if not already present
        const existingFlights = await db.getFlights();
        for (const gf of flightsWithDynamicPricing) {
            if (!existingFlights.some(ef => ef.id === gf.id)) {
                await db.addFlight(gf as any);
            }
        }

        return NextResponse.json(flightsWithDynamicPricing);
    }

    const flights = await db.getFlights();
    return NextResponse.json(flights);
}

export async function POST(request: Request) {
    try {
        const flightData = await request.json();
        const newFlight = {
            ...flightData,
            id: `f${Date.now()}`
        };
        await db.addFlight(newFlight);
        return NextResponse.json(newFlight, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create flight' }, { status: 400 });
    }
}
