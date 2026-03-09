import { NextResponse } from 'next/server';
import { db, Booking } from '@/lib/db';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    let bookings = await db.getBookings();

    if (userId) {
        bookings = bookings.filter(b => b.user_id === userId);
    }

    // Enrich with flight and passenger data
    const flights = await db.getFlights();
    const allPassengers = await db.getPassengers();
    const enrichedBookings = bookings.map(b => ({
        ...b,
        flights: flights.find(f => f.id === b.flight_id) || null,
        return_flights: b.return_flight_id ? flights.find(f => f.id === b.return_flight_id) || null : null,
        multi_city_flights: b.multi_city_flight_ids ? b.multi_city_flight_ids.map(id => flights.find(f => f.id === id) || null).filter(Boolean) : [],
        passengers: allPassengers.filter(p => p.booking_id === b.id)
    }));

    return NextResponse.json(enrichedBookings);
}

export async function POST(request: Request) {
    try {
        const bookingData = await request.json();
        const { passengers: passengerDetails, points_redeemed, ...rest } = bookingData;

        const newBooking = {
            ...rest,
            id: `b${Date.now()}`,
            pnr: Math.random().toString(36).substring(2, 8).toUpperCase(),
            travel_date: bookingData.travel_date || new Date().toISOString(),
            return_date: bookingData.return_date,
            return_flight_id: bookingData.return_flight_id,
            status: 'confirmed',
            created_at: new Date().toISOString()
        } as Booking;

        // Get user and flight details for notifications and points
        const users = await db.getUsers();
        const user = users.find(u => u.id === newBooking.user_id);
        const flights = await db.getFlights();
        const flight = flights.find(f => f.id === newBooking.flight_id);
        const awardedPoints = Math.floor(newBooking.total_amount * 0.1);
        const redeemedCount = points_redeemed || 0;

        // Add booking to database
        await db.addBooking(newBooking);

        // Add notification for user
        if (user) {
            await db.addNotification({
                id: `n${Date.now()}`,
                user_id: user.id,
                title: 'Booking Confirmed!',
                message: `Your flight to ${flight?.destination_airport || 'destination'} is confirmed. PNR: ${newBooking.pnr}`,
                type: 'success',
                read: false,
                created_at: new Date().toISOString()
            });

            if (awardedPoints > 0) {
                await db.addNotification({
                    id: `n${Date.now() + 1}`,
                    user_id: user.id,
                    title: 'SkyMiles Awarded',
                    message: `You earned ${awardedPoints} SkyMiles from your recent booking!`,
                    type: 'info',
                    read: false,
                    created_at: new Date().toISOString()
                });
            }

            // Award points and handle redemption
            await db.updateUser(user.id, {
                points: (user.points || 0) + awardedPoints - redeemedCount
            });
        }

        // Save passengers if provided
        if (passengerDetails && Array.isArray(passengerDetails)) {
            const currentPassengers = await db.getPassengers();
            for (const p of passengerDetails) {
                await db.addPassenger({
                    ...p,
                    id: `p${currentPassengers.length + 1}-${Date.now()}`,
                    booking_id: newBooking.id,
                    meal_preference: p.meal_preference || p.mealPreference || 'none',
                    discount_type: p.discount_type || p.discountType || 'none'
                });
            }

            // Update frequent passengers for the user
            if (user) {
                const existingFrequent = user.frequent_passengers || [];
                const newFrequent = [...existingFrequent];

                passengerDetails.forEach(p => {
                    if (!existingFrequent.some(ef => ef.name === p.name)) {
                        newFrequent.push({
                            name: p.name,
                            age: p.age,
                            gender: p.gender
                        });
                    }
                });

                await db.updateUser(user.id, { frequent_passengers: newFrequent });
            }
        }

        return NextResponse.json(newBooking, { status: 201 });
    } catch (error) {
        console.error("Booking error:", error);
        return NextResponse.json({ error: 'Failed to create booking' }, { status: 400 });
    }
}
