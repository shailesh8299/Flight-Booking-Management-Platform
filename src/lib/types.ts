export interface Flight {
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

export interface Discount {
    id: string;
    discount_type: 'army' | 'senior_citizen' | 'student';
    discount_percentage: number;
    description?: string;
    required_document?: string;
    is_active: boolean;
    created_at?: string;
}

export interface Booking {
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
    flights?: Partial<Flight>;
    return_flights?: Partial<Flight>;
    multi_city_flights?: Partial<Flight>[];
}

export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: 'admin' | 'user';
    points: number;
    frequent_passengers?: Partial<Passenger>[];
    created_at?: string;
}

export interface Passenger {
    id?: string;
    booking_id?: string;
    name: string;
    age: number;
    gender: string;
    email?: string;
    phone?: string;
    seatPreference?: string;
    seat_no?: string;
    mealPreference?: string;
    specialAssistance?: boolean;
    discountType?: string;
    discountDocument?: string;
    // Database field names (legacy/compatibility)
    meal_preference?: string;
    discount_type?: string;
}
