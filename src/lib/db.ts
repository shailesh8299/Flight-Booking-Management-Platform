import clientPromise from './mongodb';
import { TOP_AIRPORTS } from './flightData';
import { ObjectId } from 'mongodb';

export interface User {
    _id?: ObjectId;
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    role: 'admin' | 'user';
    isAdmin?: boolean;
    password: string;
    isVerified: boolean;
    address?: string;
    age?: number;
    points: number;
    frequent_passengers?: any[];
    created_at: string;
}

export interface Flight {
    _id?: ObjectId;
    id: string;
    flight_number: string;
    airline: string;
    source_airport: string;
    destination_airport: string;
    departure_time: string;
    arrival_time: string;
    duration?: string;
    price: number;
    seats_available: number;
    status: 'on_time' | 'delayed' | 'cancelled' | 'boarding' | 'departed' | 'landed';
    flight_type: string;
    created_at?: string;
}

export interface Booking {
    _id?: ObjectId;
    id: string;
    pnr: string;
    user_id: string;
    flight_id: string;
    return_flight_id?: string;
    multi_city_flight_ids?: string[];
    travel_date: string;
    return_date?: string;
    num_passengers: number;
    total_amount: number;
    status: 'confirmed' | 'cancelled' | 'pending';
    seat_class: string;
    discount_type?: string;
    discount_percentage?: number;
    created_at?: string;
}

export interface Passenger {
    _id?: ObjectId;
    id: string;
    booking_id: string;
    name: string;
    age: number;
    gender: string;
    seat_no?: string;
    meal_preference?: string;
    discount_type?: string;
}

export interface Notification {
    _id?: ObjectId;
    id: string;
    user_id: string;
    title: string;
    message: string;
    type: 'success' | 'info' | 'warning' | 'error';
    read: boolean;
    created_at: string;
}

export interface Discount {
    id: string;
    discount_type: string;
    discount_percentage: number;
    is_active: boolean;
}

const getCollection = async (name: string) => {
    try {
        const client = await clientPromise;
        return client.db("Skybooking").collection(name);
    } catch (e: any) {
        console.error(`Error getting collection ${name}:`, e.message);
        throw e;
    }
};

// Seeding logic
async function seedDatabase() {
    const flightsCol = await getCollection("flights");
    const count = await flightsCol.countDocuments();

    if (count === 0) {
        console.log("Seeding database...");

        // Seed Users
        const usersCol = await getCollection("users");
        await usersCol.deleteMany({});
        await usersCol.insertMany([
            {
                id: 'u1',
                email: 'admin@skybook.com',
                password: '22bce2006@Mishra',
                isVerified: true,
                firstName: 'Admin',
                lastName: 'SkyBook',
                phone: '9999999999',
                role: 'admin',
                isAdmin: true,
                points: 1000,
                frequent_passengers: [],
                created_at: new Date().toISOString()
            },
            {
                id: 'u2',
                email: 'mishrashailesh154@gmail.com',
                password: 'password123',
                isVerified: false,
                firstName: 'Shailesh',
                lastName: 'Mishra',
                phone: '1234567890',
                role: 'user',
                points: 500,
                frequent_passengers: [],
                created_at: new Date().toISOString()
            }
        ]);

        // Seed Flights
        const AIRLINES_LIST = [
            { code: 'AI', name: 'Air India' },
            { code: '6E', name: 'IndiGo' },
            { code: 'SG', name: 'SpiceJet' },
            { code: 'UK', name: 'Vistara' },
            { code: 'G8', name: 'GoAir' },
        ];

        let seededFlights: Flight[] = [];
        for (let i = 0; i < 151; i++) {
            const airline = AIRLINES_LIST[i % AIRLINES_LIST.length];
            const sourceAirport = TOP_AIRPORTS[i % TOP_AIRPORTS.length];
            const destAirport = TOP_AIRPORTS[(i + 1) % TOP_AIRPORTS.length];

            const source = `${sourceAirport.city} (${sourceAirport.code})`;
            const destination = `${destAirport.city} (${destAirport.code})`;

            const hour = Math.floor(i / 6) % 24;
            const minute = (i % 6) * 10;
            const depTime = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
            const arrTime = `${(hour + 2) % 24}:${minute.toString().padStart(2, '0')}`;

            seededFlights.push({
                id: `f${1000 + i}`,
                flight_number: `${airline.code}-${1000 + i}`,
                airline: airline.name,
                source_airport: source,
                destination_airport: destination,
                departure_time: depTime,
                arrival_time: arrTime,
                duration: '2h 00m',
                price: 3500 + (i * 20),
                seats_available: 10 + (i % 180),
                status: i % 10 === 0 ? 'delayed' : 'on_time',
                flight_type: i % 5 === 0 ? '1-Stop' : 'Non-Stop',
                created_at: new Date().toISOString()
            });
        }
        await flightsCol.insertMany(seededFlights);

        // Seed Discounts
        const discountsCol = await getCollection("discounts");
        await discountsCol.deleteMany({});
        await discountsCol.insertMany([
            { id: 'd1', discount_type: 'army', discount_percentage: 15, is_active: true },
            { id: 'd2', discount_type: 'senior_citizen', discount_percentage: 20, is_active: true },
            { id: 'd3', discount_type: 'student', discount_percentage: 10, is_active: true },
        ]);

        console.log("Database seeded successfully!");
    }
}

// Ensure seeding runs
seedDatabase().catch(console.error);

// Helper to clean MongoDB documents for serialization
export const cleanDoc = (doc: any) => {
    if (!doc) return doc;
    const { _id, ...rest } = doc;
    return { ...rest, mongo_id: _id?.toString() };
};

export const db = {
    getUsers: async () => {
        const col = await getCollection("users");
        const results = await col.find({}).toArray();
        return results.map(cleanDoc) as User[];
    },
    updateUser: async (id: string, updates: Partial<User>) => {
        const col = await getCollection("users");
        await col.updateOne({ id }, { $set: updates });
        const result = await col.findOne({ id });
        return cleanDoc(result) as User;
    },
    addUser: async (user: User) => {
        const col = await getCollection("users");
        return await col.insertOne(user);
    },
    getFlights: async () => {
        const col = await getCollection("flights");
        const results = await col.find({}).toArray();
        return results.map(cleanDoc) as Flight[];
    },
    setFlights: async (newFlights: Flight[]) => {
        const col = await getCollection("flights");
        await col.deleteMany({});
        return await col.insertMany(newFlights);
    },
    addFlight: async (flight: Flight) => {
        const col = await getCollection("flights");
        return await col.insertOne(flight);
    },
    promoteToAdmin: async (id: string) => {
        const col = await getCollection("users");
        await col.updateOne({ id }, { $set: { role: 'admin', isAdmin: true } });
        const result = await col.findOne({ id });
        return cleanDoc(result) as User;
    },
    getBookings: async () => {
        const col = await getCollection("bookings");
        const results = await col.find({}).toArray();
        return results.map(cleanDoc) as Booking[];
    },
    addBooking: async (booking: Booking) => {
        const col = await getCollection("bookings");
        return await col.insertOne(booking);
    },
    getPassengers: async () => {
        const col = await getCollection("passengers");
        const results = await col.find({}).toArray();
        return results.map(cleanDoc) as Passenger[];
    },
    addPassenger: async (p: Passenger) => {
        const col = await getCollection("passengers");
        return await col.insertOne(p);
    },
    getNotifications: async (userId?: string) => {
        const col = await getCollection("notifications");
        const query = userId ? { user_id: userId } : {};
        const results = await col.find(query).sort({ created_at: -1 }).toArray();
        return results.map(cleanDoc) as Notification[];
    },
    addNotification: async (n: Notification) => {
        const col = await getCollection("notifications");
        return await col.insertOne(n);
    },
    readNotifications: async (userId: string) => {
        const col = await getCollection("notifications");
        await col.updateMany({ user_id: userId }, { $set: { read: true } });
    },
    getDiscounts: async () => {
        const col = await getCollection("discounts");
        const results = await col.find({}).toArray();
        return results.map(cleanDoc) as unknown as Discount[];
    },
    addDiscount: async (d: Discount) => {
        const col = await getCollection("discounts");
        return await col.insertOne(d);
    },
    updateDiscount: async (id: string, updates: any) => {
        const col = await getCollection("discounts");
        await col.updateOne({ id }, { $set: updates });
        const result = await col.findOne({ id });
        return cleanDoc(result) as unknown as Discount;
    },
    deleteDiscount: async (id: string) => {
        const col = await getCollection("discounts");
        await col.deleteOne({ id });
    }
};
