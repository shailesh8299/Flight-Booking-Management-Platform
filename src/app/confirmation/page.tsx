"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Check, Download, Plane, MapPin, Repeat, ArrowRight, Clock } from 'lucide-react';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { useBooking } from '@/context/BookingContext';
import { toast } from 'sonner';
import { SEAT_CLASSES } from '@/lib/flightData';
import { generateTicketPDF } from '@/lib/pdfGenerator';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

const ConfirmationPage = () => {
  const navigate = useRouter();
  const { currentBooking, resetBooking } = useBooking();

  useEffect(() => {
    if (!currentBooking) {
      navigate.push('/');
      return;
    }
    const timer = setTimeout(() => {
      toast.info(`Journey confirmed. Check-in will open 24h before departure.`, { duration: 5000 });
    }, 2000);
    return () => clearTimeout(timer);
  }, [currentBooking, navigate]);

  const handleNewBooking = () => {
    resetBooking();
    navigate.push('/');
  };

  if (!currentBooking) return null;

  const { flight, returnFlight, multiCityFlights, searchParams, passengers, totalAmount, pnr, seatClass } = currentBooking;
  const isMultiCity = !!multiCityFlights && multiCityFlights.length > 0;
  const isRoundTrip = !!returnFlight;

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />

      <section className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex justify-center mb-8">
            <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center shadow-lg shadow-green-500/20">
              <Check className="w-10 h-10 text-white" />
            </div>
          </motion.div>

          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold text-foreground mb-2">Booking Successful!</h1>
            <p className="text-muted-foreground text-lg">Your itinerary PNR is <span className="text-primary font-mono font-bold select-all bg-primary/5 px-2 rounded-lg">{pnr}</span></p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-6">
              {isMultiCity ? (
                multiCityFlights.map((f: any, i: number) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="bg-card rounded-3xl shadow-soft overflow-hidden border border-border">
                    <div className="bg-secondary/50 px-6 py-4 border-b border-border flex justify-between items-center">
                      <span className="text-[10px] font-bold text-primary uppercase tracking-widest bg-primary/10 px-2 py-0.5 rounded-full">Leg {i + 1}</span>
                      <span className="text-xs text-muted-foreground font-medium">{f.airline} • {f.flight_number}</span>
                    </div>
                    <div className="p-8 flex items-center justify-between">
                      <div className="text-center min-w-[80px]">
                        <p className="text-3xl font-bold">{f.source_airport}</p>
                        <p className="text-xs text-muted-foreground mt-1">{f.departure_time}</p>
                      </div>
                      <div className="flex-1 px-8 flex flex-col items-center">
                        <span className="text-[10px] text-muted-foreground mb-2">{f.duration}</span>
                        <div className="w-full h-px bg-dashed border-t border-dashed border-border relative">
                          <Plane className="w-4 h-4 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary rotate-45" />
                        </div>
                      </div>
                      <div className="text-center min-w-[80px]">
                        <p className="text-3xl font-bold">{f.destination_airport}</p>
                        <p className="text-xs text-muted-foreground mt-1">{f.arrival_time}</p>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <>
                  {/* Outbound LEG */}
                  <div className="bg-card rounded-3xl shadow-soft border border-border p-6">
                    <p className="text-xs font-bold text-primary mb-4 uppercase">Outbound Flight</p>
                    {/* ... (Existing Outbound UI simplified) */}
                    <div className="flex justify-between items-center">
                      <div className="text-center">
                        <p className="text-3xl font-bold">{searchParams.from}</p>
                        <p className="text-xs text-muted-foreground">{flight.departure_time}</p>
                      </div>
                      <ArrowRight className="text-muted-foreground" />
                      <div className="text-center">
                        <p className="text-3xl font-bold">{searchParams.to}</p>
                        <p className="text-xs text-muted-foreground">{flight.arrival_time}</p>
                      </div>
                    </div>
                  </div>

                  {isRoundTrip && (
                    <div className="bg-card rounded-3xl shadow-soft border border-border p-6 mt-4">
                      <p className="text-xs font-bold text-primary mb-4 uppercase flex items-center gap-1"><Repeat className="w-3 h-3" /> Return Flight</p>
                      <div className="flex justify-between items-center px-4">
                        <div className="text-center">
                          <p className="text-3xl font-bold">{searchParams.to}</p>
                          <p className="text-xs text-muted-foreground">{returnFlight.departure_time}</p>
                        </div>
                        <ArrowRight className="text-muted-foreground" />
                        <div className="text-center">
                          <p className="text-3xl font-bold">{searchParams.from}</p>
                          <p className="text-xs text-muted-foreground">{returnFlight.arrival_time}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="lg:col-span-4">
              <div className="bg-card rounded-3xl p-8 border border-border shadow-elevated sticky top-24">
                <h3 className="text-xl font-bold mb-6">Itinerary Summary</h3>
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Passengers</span>
                    <span className="font-bold">{passengers.length} Adult(s)</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Class</span>
                    <span className="font-bold capitalize">{seatClass}</span>
                  </div>
                </div>
                <div className="pt-6 border-t border-border mb-8">
                  <p className="text-xs text-muted-foreground uppercase mb-1">Total Paid</p>
                  <p className="text-4xl font-bold text-primary">₹{totalAmount.toLocaleString()}</p>
                </div>
                <div className="space-y-3">
                  <Button variant="hero" size="lg" className="w-full" onClick={() => generateTicketPDF(currentBooking)}>
                    <Download className="w-4 h-4 mr-2" /> Download Ticket
                  </Button>
                  <Button variant="outline" className="w-full" onClick={handleNewBooking}>Plan Another Trip</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ConfirmationPage;
