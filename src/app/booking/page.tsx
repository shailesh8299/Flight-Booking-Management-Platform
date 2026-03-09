"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Plane, CreditCard, Lock, Clock, Shield, RefreshCw, Calendar, AlertCircle, Repeat, MapPin } from 'lucide-react';
import Header from '@/components/Header';
import PassengerForm from '@/components/PassengerForm';
import { Button } from '@/components/ui/button';
import { useBooking } from '@/context/BookingContext';
import {
  Passenger,
  SEAT_CLASSES,
  CANCELLATION_POLICIES,
  PRICE_LOCK_FEE,
  SEAT_PREFERENCES,
  MEAL_OPTIONS,
  DISCOUNT_TYPES
} from '@/lib/flightData';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

const BookingPage = () => {
  const navigate = useRouter();
  const { user } = useAuth();
  const { searchParams, selectedFlight, selectedReturnFlight, multiCityFlights, passengers, setPassengers, setCurrentBooking } = useBooking();
  const [isProcessing, setIsProcessing] = useState(false);
  const [seatClass, setSeatClass] = useState('economy');
  const [isPriceLocked, setIsPriceLocked] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState(CANCELLATION_POLICIES[1]); // Flexi by default
  const [usePoints, setUsePoints] = useState(false);
  const maxRedeemablePoints = Math.min(user?.points || 0, 5000);

  const isRoundTrip = searchParams?.tripType === 'roundtrip';
  const isMultiCity = searchParams?.tripType === 'multicity';

  useEffect(() => {
    if (!searchParams) {
      navigate.push('/');
      return;
    }

    if (isMultiCity && multiCityFlights.length === 0) {
      navigate.push('/flights');
      return;
    }

    if (!isMultiCity && !selectedFlight) {
      navigate.push('/flights');
      return;
    }

    // Initialize passenger forms
    if (passengers.length !== searchParams.passengers) {
      const initialPassengers: Passenger[] = Array.from({ length: searchParams.passengers }, () => ({
        name: '',
        age: 0,
        gender: '',
        email: '',
        phone: '',
        seatPreference: '',
        mealPreference: 'none',
        specialAssistance: false,
        discountType: 'none',
        discountDocument: '',
      }));
      setPassengers(initialPassengers);
    }
  }, [searchParams, selectedFlight, isMultiCity, multiCityFlights, navigate, passengers.length, setPassengers]);

  const handlePassengerChange = (index: number, passenger: Passenger) => {
    const updated = [...passengers];
    updated[index] = passenger;
    setPassengers(updated);
  };

  const isFormValid = () => {
    return passengers.every((p, index) => {
      const baseValid = p.name && p.age > 0 && p.gender;
      const discountValid = p.discountType === 'none' || (p.discountType && p.discountDocument);
      if (index === 0) {
        return baseValid && p.email && p.phone.length === 10 && discountValid;
      }
      return baseValid && discountValid;
    });
  };

  const calculateTotal = () => {
    if (!searchParams) return 0;

    const seatClassMultiplier = SEAT_CLASSES.find(s => s.code === seatClass)?.priceMultiplier || 1;

    let flightPriceSum = 0;
    let multiplierCount = 1;

    if (isMultiCity) {
      flightPriceSum = multiCityFlights.reduce((sum, f) => sum + f.price, 0);
      multiplierCount = multiCityFlights.length;
    } else {
      flightPriceSum = selectedFlight?.price || 0;
      if (isRoundTrip && selectedReturnFlight) {
        flightPriceSum += selectedReturnFlight.price;
        multiplierCount = 2;
      }
    }

    let baseTotal = flightPriceSum * seatClassMultiplier * searchParams.passengers;

    // Add individual add-ons per leg
    passengers.forEach(p => {
      const seatPref = SEAT_PREFERENCES.find(s => s.code === p.seatPreference);
      if (seatPref) baseTotal += seatPref.price * multiplierCount;

      const mealPref = MEAL_OPTIONS.find(m => m.code === p.mealPreference);
      if (mealPref) baseTotal += mealPref.price * multiplierCount;
    });

    // Apply discounts
    passengers.forEach(p => {
      const discount = DISCOUNT_TYPES.find(d => d.code === p.discountType);
      if (discount && discount.percentage > 0) {
        const perPersonDiscount = (flightPriceSum * seatClassMultiplier * discount.percentage) / 100;
        baseTotal -= perPersonDiscount;
      }
    });

    if (isPriceLocked) baseTotal += PRICE_LOCK_FEE;

    if (usePoints && user?.points) {
      const discountFromPoints = Math.min(user.points, maxRedeemablePoints);
      baseTotal -= discountFromPoints;
    }

    return Math.max(0, Math.round(baseTotal));
  };

  const handlePayment = async () => {
    if (!isFormValid() || !searchParams) return;

    if (!user) {
      toast.error("Please sign in to book a flight");
      navigate.push('/auth');
      return;
    }

    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));

    const totalAmount = calculateTotal();

    const bookingData = {
      flight_id: isMultiCity ? multiCityFlights[0].id : selectedFlight?.id,
      return_flight_id: selectedReturnFlight?.id,
      multi_city_flight_ids: isMultiCity ? multiCityFlights.map(f => f.id) : undefined,
      user_id: user.id,
      travel_date: searchParams.date,
      return_date: searchParams.returnDate,
      num_passengers: searchParams.passengers,
      total_amount: totalAmount,
      seat_class: seatClass,
      discount_type: passengers[0].discountType || 'none',
      status: 'confirmed',
      points_redeemed: usePoints ? Math.min(user?.points || 0, maxRedeemablePoints) : 0,
      passengers: passengers.map(p => ({
        ...p,
        meal_preference: p.mealPreference || 'none',
        discount_type: p.discountType || 'none'
      }))
    };

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData),
      });

      if (!response.ok) throw new Error('Failed to save booking');

      const savedBooking = await response.json();

      setCurrentBooking({
        ...savedBooking,
        flight: isMultiCity ? multiCityFlights[0] : selectedFlight,
        returnFlight: selectedReturnFlight,
        multiCityFlights: multiCityFlights,
        passengers: passengers,
        searchParams: searchParams,
        totalAmount: totalAmount,
        bookingDate: savedBooking.created_at || new Date().toISOString(),
        seatClass,
        pnr: savedBooking.pnr
      });

      navigate.push('/confirmation');
    } catch (error) {
      toast.error("Failed to complete booking. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const totalAmount = calculateTotal();
  const seatClassDetails = SEAT_CLASSES.find(s => s.code === seatClass);

  return (
    <div className="min-h-screen bg-background pb-32">
      <Header />

      <section className="pt-20 pb-4 bg-secondary/50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-4 py-4">
            {['Search', 'Select Flights', 'Passenger Details', 'Payment'].map((step, index) => (
              <div key={step} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${index <= 2 ? 'sky-gradient text-white' : 'bg-muted text-muted-foreground'}`}>
                  {index + 1}
                </div>
                <span className={`hidden sm:inline text-sm ${index <= 2 ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                  {step}
                </span>
                {index < 3 && <div className="w-8 h-0.5 bg-muted rounded-full" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="container mx-auto px-4">
          <Button variant="ghost" size="sm" onClick={() => navigate.push('/flights')} className="mb-6">
            <ArrowLeft className="w-4 h-4" />
            Back to Flight Selection
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* Seat Class */}
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-2xl shadow-soft p-6">
                <h3 className="text-lg font-semibold mb-4">Select Travel Class</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {SEAT_CLASSES.map((sc) => (
                    <button
                      key={sc.code}
                      onClick={() => setSeatClass(sc.code)}
                      className={`p-4 rounded-xl border-2 transition-all ${seatClass === sc.code ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}
                    >
                      <p className="font-semibold">{sc.name}</p>
                      <p className="text-sm text-muted-foreground">{sc.priceMultiplier}x Price</p>
                    </button>
                  ))}
                </div>
              </motion.div>

              {/* SkyMiles */}
              {user && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-2xl shadow-soft p-6 border-2 border-primary/20 bg-primary/5">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">SkyMiles Rewards</h3>
                      <p className="text-sm text-muted-foreground">You have {user.points} Miles. Redeem max {maxRedeemablePoints} for ₹{maxRedeemablePoints} off.</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="points" checked={usePoints} onCheckedChange={(v) => setUsePoints(v as boolean)} />
                      <Label htmlFor="points" className="cursor-pointer">Redeem</Label>
                    </div>
                  </div>
                </motion.div>
              )}

              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-foreground">Passenger Details</h2>
                {passengers.map((p, i) => (
                  <PassengerForm key={i} index={i} passenger={p} onChange={handlePassengerChange} isFirst={i === 0} frequentPassengers={user?.frequent_passengers} />
                ))}
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-card rounded-2xl shadow-elevated p-6 sticky top-24 space-y-6">
                <h3 className="text-lg font-semibold">Booking Summary</h3>

                <div className="space-y-4">
                  {isMultiCity ? (
                    multiCityFlights.map((f, i) => (
                      <div key={i} className="p-4 bg-secondary/50 rounded-xl relative">
                        <div className="absolute top-2 right-2 text-[10px] font-bold text-primary bg-primary/10 px-1 rounded">LEG {i + 1}</div>
                        <p className="font-bold text-sm">{f.airline} • {f.flight_number}</p>
                        <div className="flex items-center gap-2 mt-1 text-xs">
                          <span className="font-semibold">{f.source_airport}</span>
                          <ArrowRight className="w-3 h-3" />
                          <span className="font-semibold">{f.destination_airport}</span>
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-2">{f.departure_time} | ₹{f.price.toLocaleString()}</p>
                      </div>
                    ))
                  ) : (
                    <>
                      <div className="p-4 bg-secondary/50 rounded-xl">
                        <p className="text-xs font-bold text-primary mb-2 uppercase">Outbound Flight</p>
                        <p className="font-bold">{selectedFlight?.airline} {selectedFlight?.flight_number}</p>
                        <p className="text-xs text-muted-foreground">{searchParams.from} → {searchParams.to}</p>
                      </div>
                      {isRoundTrip && selectedReturnFlight && (
                        <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl">
                          <p className="text-xs font-bold text-primary mb-2 uppercase">Return Flight</p>
                          <p className="font-bold">{selectedReturnFlight.airline} {selectedReturnFlight.flight_number}</p>
                          <p className="text-xs text-muted-foreground">{searchParams.to} → {searchParams.from}</p>
                        </div>
                      )}
                    </>
                  )}
                </div>

                <div className="space-y-3 py-4 border-y border-border">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Class</span>
                    <span className="font-medium capitalize">{seatClass}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Passengers</span>
                    <span className="font-medium">{searchParams.passengers}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <span className="text-lg font-semibold">Total Amount</span>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-primary">₹{totalAmount.toLocaleString()}</span>
                  </div>
                </div>

                <Button variant="hero" size="lg" className="w-full" disabled={!isFormValid() || isProcessing} onClick={handlePayment}>
                  {isProcessing ? 'Processing Payment...' : `Confirm & Pay ₹${totalAmount.toLocaleString()}`}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BookingPage;
