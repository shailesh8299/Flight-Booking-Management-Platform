"use client";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/Header';
import { Plane, Calendar, Users, MapPin, ChevronRight, Download, Repeat, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { generateTicketPDF } from '@/lib/pdfGenerator';
import { cn } from '@/lib/utils';

interface Booking {
  id: string;
  pnr: string;
  travel_date: string;
  return_date?: string;
  num_passengers: number;
  total_amount: number;
  status: string;
  created_at: string;
  seat_class: string;
  flights: {
    flight_number: string;
    airline: string;
    departure_time: string;
    arrival_time: string;
    source_airport: string;
    destination_airport: string;
    duration: string;
  } | null;
  multi_city_flights?: {
    flight_number: string;
    airline: string;
    departure_time: string;
    arrival_time: string;
    source_airport: string;
    destination_airport: string;
    duration: string;
  }[] | null;
  return_flights?: {
    flight_number: string;
    airline: string;
    departure_time: string;
    arrival_time: string;
    source_airport: string;
    destination_airport: string;
    duration: string;
  } | null;
  passengers: any[];
}

const MyBookingsPage = () => {
  const { user, loading } = useAuth();
  const navigate = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate.push('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user) return;

      try {
        const response = await fetch(`/api/bookings?userId=${user.id}`);
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data)) {
            setBookings(data as Booking[]);
          } else {
            setBookings([]);
            console.error("Bookings data is not an array:", data);
          }
        }
      } catch (error) {
        console.error("Failed to fetch bookings", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchBookings();
    }
  }, [user]);

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <div className="pt-24 flex flex-col items-center justify-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mb-4" />
          <p className="text-muted-foreground animate-pulse">Loading your journeys...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 flex justify-between items-end"
          >
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">My Journeys</h1>
              <p className="text-muted-foreground">Manage your upcoming and past flight bookings</p>
            </div>
          </motion.div>

          {bookings.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20 bg-card rounded-3xl border border-dashed border-border"
            >
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-secondary flex items-center justify-center shadow-inner">
                <Plane className="w-12 h-12 text-muted-foreground/50" />
              </div>
              <h2 className="text-2xl font-semibold text-foreground mb-2">No bookings yet</h2>
              <p className="text-muted-foreground mb-8">Ready for your next adventure?</p>
              <Button
                onClick={() => navigate.push('/')}
                size="lg"
                variant="hero"
              >
                Search Flights
                <ChevronRight className="ml-2 w-4 h-4" />
              </Button>
            </motion.div>
          ) : (
            <div className="space-y-6">
              {bookings.map((booking, index) => (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-card rounded-3xl p-8 shadow-soft border border-border group hover:shadow-elevated transition-all"
                >
                  <div className="flex flex-col lg:row gap-8">
                    {/* Flight Journey Details */}
                    <div className="flex-1 space-y-6">
                      {/* Outbound */}
                      <div className="flex items-center gap-6">
                        <div className="w-14 h-14 rounded-2xl sky-gradient flex items-center justify-center text-white shadow-lg shadow-primary/20">
                          <Plane className="w-7 h-7 rotate-45" />
                        </div>
                        <div className="flex-1 flex items-center justify-between">
                          <div>
                            <p className="text-xs font-bold text-primary uppercase tracking-widest mb-1">Outbound • {booking.flights?.flight_number}</p>
                            <div className="flex items-center gap-4">
                              <div className="text-2xl font-bold">{booking.flights?.source_airport}</div>
                              <div className="flex-1 flex items-center gap-2 min-w-[60px]">
                                <div className="h-px flex-1 bg-border relative">
                                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-primary" />
                                </div>
                              </div>
                              <div className="text-2xl font-bold">{booking.flights?.destination_airport}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">{booking.flights?.departure_time}</p>
                            <p className="text-xs text-muted-foreground">{format(new Date(booking.travel_date), 'EEE, dd MMM')}</p>
                          </div>
                        </div>
                      </div>

                      {/* Multi-City Legs */}
                      {booking.multi_city_flights && booking.multi_city_flights.length > 0 && (
                        <div className="space-y-4 pt-4 border-t border-border">
                          {booking.multi_city_flights.map((leg, i) => (
                            <div key={i} className="flex items-center gap-6 pl-2">
                              <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center font-bold text-xs">
                                {i + 1}
                              </div>
                              <div className="flex-1 flex items-center justify-between">
                                <div>
                                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">
                                    Segment {i + 1} • {leg.flight_number}
                                  </p>
                                  <div className="flex items-center gap-3">
                                    <div className="text-lg font-bold">{leg.source_airport}</div>
                                    <ArrowRight className="w-4 h-4 text-muted-foreground" />
                                    <div className="text-lg font-bold">{leg.destination_airport}</div>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="font-bold">{leg.departure_time}</p>
                                  <p className="text-xs text-muted-foreground">{leg.airline}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Return Leg if applicable */}
                      {booking.return_flights && (
                        <div className="flex items-center gap-6 pl-2 pt-4 border-t border-border">
                          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                            <Repeat className="w-5 h-5" />
                          </div>
                          <div className="flex-1 flex items-center justify-between">
                            <div>
                              <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">Return • {booking.return_flights.flight_number}</p>
                              <div className="flex items-center gap-3">
                                <div className="text-lg font-bold">{booking.return_flights.source_airport}</div>
                                <span className="text-muted-foreground">→</span>
                                <div className="text-lg font-bold">{booking.return_flights.destination_airport}</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-bold">{booking.return_flights.departure_time}</p>
                              <p className="text-xs text-muted-foreground">{booking.return_date ? format(new Date(booking.return_date), 'EEE, dd MMM') : 'N/A'}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Sidebar info */}
                    <div className="lg:w-64 flex flex-col justify-between py-2 border-l border-border pl-8">
                      <div>
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <p className="text-xs text-muted-foreground uppercase font-bold tracking-tighter">Status</p>
                            <span className={cn(
                              "text-xs font-bold px-2 py-1 rounded-lg",
                              booking.status === 'confirmed' ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                            )}>
                              {booking.status.toUpperCase()}
                            </span>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-muted-foreground uppercase font-bold tracking-tighter">PNR</p>
                            <p className="font-mono font-bold text-lg">{booking.pnr}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-sm mb-4">
                          <Users className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium">{booking.num_passengers} Passenger(s)</span>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <Button
                          variant="hero"
                          className="w-full shadow-lg shadow-primary/10"
                          onClick={() => generateTicketPDF(booking)}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          E-Ticket PDF
                        </Button>
                        <p className="text-[10px] text-center text-muted-foreground">Booked on {format(new Date(booking.created_at), 'dd MMM yyyy, HH:mm')}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default MyBookingsPage;
