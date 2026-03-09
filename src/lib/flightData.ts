export interface Flight {
  id: string;
  airline: string;
  flight_number: string;
  source_airport: string;
  destination_airport: string;
  departure_time: string;
  arrival_time: string;
  duration: string;
  flight_type: string;
  price: number;
  seats_available: number;
}

export interface SearchParams {
  from: string;
  to: string;
  date: string;
  returnDate?: string;
  passengers: number;
  tripType: 'oneway' | 'roundtrip' | 'multicity';
  multiCityLegs?: { from: string; to: string; date: string }[];
}

export interface Passenger {
  name: string;
  age: number;
  gender: string;
  email: string;
  phone: string;
  seatPreference?: string;
  seat_no?: string;
  mealPreference?: string;
  specialAssistance?: boolean;
  discountType?: string;
  discountDocument?: string;
}

export interface Booking {
  id: string;
  pnr: string;
  flight: Flight;
  passengers: Passenger[];
  searchParams: SearchParams;
  totalAmount: number;
  bookingDate: string;
  seatClass?: string;
  discountType?: string;
  discountPercentage?: number;
  isPriceLocked?: boolean;
  cancellationFee?: number;
  dateChangeFee?: number;
  isRefundable?: boolean;
}

export const TOP_AIRPORTS = [
  { code: 'DEL', city: 'Delhi', name: 'Indira Gandhi International Airport' },
  { code: 'BOM', city: 'Mumbai', name: 'Chhatrapati Shivaji Maharaj International Airport' },
  { code: 'BLR', city: 'Bengaluru', name: 'Kempegowda International Airport' },
  { code: 'HYD', city: 'Hyderabad', name: 'Rajiv Gandhi International Airport' },
  { code: 'MAA', city: 'Chennai', name: 'Chennai International Airport' },
  { code: 'CCU', city: 'Kolkata', name: 'Netaji Subhash Chandra Bose International Airport' },
  { code: 'AMD', city: 'Ahmedabad', name: 'Sardar Vallabhbhai Patel International Airport' },
  { code: 'COK', city: 'Kochi', name: 'Cochin International Airport' },
  { code: 'GOI', city: 'Goa', name: 'Dabolim Airport' },
  { code: 'PNQ', city: 'Pune', name: 'Pune Airport' },
  { code: 'LKO', city: 'Lucknow', name: 'Chaudhary Charan Singh International Airport' },
  { code: 'TRV', city: 'Thiruvananthapuram', name: 'Thiruvananthapuram International Airport' },
  { code: 'GAU', city: 'Guwahati', name: 'Guwahati International Airport' },
  { code: 'JAI', city: 'Jaipur', name: 'Jaipur International Airport' },
  { code: 'SXR', city: 'Srinagar', name: 'Sheikh ul-Alam International Airport' },
  { code: 'IXC', city: 'Chandigarh', name: 'Chandigarh Airport' },
  { code: 'BBI', city: 'Bhubaneswar', name: 'Biju Patnaik International Airport' },
  { code: 'NAG', city: 'Nagpur', name: 'Dr. Babasaheb Ambedkar International Airport' },
  { code: 'IXJ', city: 'Jammu', name: 'Jammu Airport' },
  { code: 'PAT', city: 'Patna', name: 'Jay Prakash Narayan International Airport' },
  { code: 'ATQ', city: 'Amritsar', name: 'Sri Guru Ram Dass Jee International Airport' },
  { code: 'VNS', city: 'Varanasi', name: 'Lal Bahadur Shastri International Airport' },
  { code: 'RPR', city: 'Raipur', name: 'Swami Vivekananda Airport' },
  { code: 'STV', city: 'Surat', name: 'Surat Airport' },
  { code: 'IXZ', city: 'Port Blair', name: 'Veer Savarkar International Airport' },
];

export const AIRLINES = [
  { code: 'AI', name: 'Air India', logo: '✈️' },
  { code: '6E', name: 'IndiGo', logo: '🛫' },
  { code: 'SG', name: 'SpiceJet', logo: '🌶️' },
  { code: 'UK', name: 'Vistara', logo: '⭐' },
  { code: 'G8', name: 'GoAir', logo: '🛩️' },
  { code: 'I5', name: 'AirAsia India', logo: '🔴' },
];

export const SEAT_CLASSES = [
  { code: 'economy', name: 'Economy', priceMultiplier: 1 },
  { code: 'premium_economy', name: 'Premium Economy', priceMultiplier: 1.5 },
  { code: 'business', name: 'Business', priceMultiplier: 3 },
  { code: 'first', name: 'First Class', priceMultiplier: 5 },
];

export const DISCOUNT_TYPES = [
  { code: 'none', name: 'No Discount', percentage: 0, document: '' },
  { code: 'army', name: 'Armed Forces / Army', percentage: 15, document: 'Military ID Card' },
  { code: 'senior_citizen', name: 'Senior Citizen (60+)', percentage: 20, document: 'Age Proof' },
  { code: 'student', name: 'Student', percentage: 10, document: 'Valid Student ID' },
];

export const MEAL_OPTIONS = [
  { code: 'none', name: 'No Meal', price: 0 },
  { code: 'veg', name: 'Vegetarian', price: 0 },
  { code: 'non_veg', name: 'Non-Vegetarian', price: 0 },
  { code: 'vegan', name: 'Vegan Special', price: 150 },
  { code: 'jain', name: 'Jain Meal', price: 100 },
];

export const SEAT_PREFERENCES = [
  { code: 'window', name: 'Window', price: 200 },
  { code: 'aisle', name: 'Aisle', price: 150 },
  { code: 'middle', name: 'Middle', price: 0 },
  { code: 'extra_legroom', name: 'Extra Legroom', price: 500 },
  { code: 'emergency_exit', name: 'Emergency Exit', price: 400 },
];

export const CANCELLATION_POLICIES = [
  { name: 'Super Saver', hoursBefore: 72, refundPercentage: 0, cancellationFee: 3000, dateChangeFee: 3500 },
  { name: 'Flexi', hoursBefore: 48, refundPercentage: 50, cancellationFee: 1500, dateChangeFee: 2000 },
  { name: 'Premium Flexi', hoursBefore: 24, refundPercentage: 75, cancellationFee: 500, dateChangeFee: 1000 },
  { name: 'Fully Refundable', hoursBefore: 4, refundPercentage: 100, cancellationFee: 0, dateChangeFee: 500 },
];

export const PRICE_LOCK_FEE = 200;
export const PRICE_LOCK_DURATION_HOURS = 24;

export const generatePNR = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

import { generateTicketPDF } from '@/lib/pdfGenerator';

export const generateFlights = (from: string, to: string): Flight[] => {
  const flights: Flight[] = [];
  const times = [
    { dep: '06:00', arr: '08:00', dur: '2h 00m' },
    { dep: '07:30', arr: '09:45', dur: '2h 15m' },
    { dep: '09:15', arr: '11:30', dur: '2h 15m' },
    { dep: '11:00', arr: '13:00', dur: '2h 00m' },
    { dep: '13:30', arr: '15:45', dur: '2h 15m' },
    { dep: '15:00', arr: '17:20', dur: '2h 20m' },
    { dep: '17:30', arr: '19:30', dur: '2h 00m' },
    { dep: '19:00', arr: '21:15', dur: '2h 15m' },
    { dep: '21:30', arr: '23:30', dur: '2h 00m' },
  ];

  // Generate 150+ flights for testing
  const numFlights = 150 + Math.floor(Math.random() * 50);

  for (let i = 0; i < numFlights; i++) {
    const airline = AIRLINES[i % AIRLINES.length];

    // Create varied departure times across multiple days/times
    const hour = Math.floor(i / (numFlights / 24)) % 24;
    const minute = (i % 4) * 15;
    const depTime = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;

    // Duration between 1.5h and 5h
    const durHours = 1 + (i % 4);
    const durMins = (i % 3) * 20;
    const arrHour = (hour + durHours + (minute + durMins >= 60 ? 1 : 0)) % 24;
    const arrMin = (minute + durMins) % 60;
    const arrTime = `${arrHour.toString().padStart(2, '0')}:${arrMin.toString().padStart(2, '0')}`;

    // Dynamic pricing based on "demand" (simulated by index and time)
    const basePrice = 3000 + (Math.sin(i) * 1000) + (i * 20);
    const timeSurcharge = (hour >= 8 && hour <= 11) || (hour >= 17 && hour <= 20) ? 1500 : 0;

    flights.push({
      id: `f-${i}-${Date.now()}`,
      airline: airline.name,
      flight_number: `${airline.code}-${1000 + i}`,
      source_airport: from,
      destination_airport: to,
      departure_time: depTime,
      arrival_time: arrTime,
      duration: `${durHours}h ${durMins}m`,
      flight_type: i % 5 === 0 ? '1-Stop' : 'Non-Stop',
      price: Math.floor(basePrice + timeSurcharge),
      seats_available: 10 + (i % 180),
    });
  }

  return flights.sort((a, b) => a.departure_time.localeCompare(b.departure_time));
};
