"use client";
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Plane, Filter, ArrowRight, Clock, Shield, Info, ArrowLeft, CheckCircle2, Repeat } from 'lucide-react';
import Header from '@/components/Header';
import FlightCard from '@/components/FlightCard';
import { useBooking } from '@/context/BookingContext';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const FlightsPage = () => {
  const navigate = useRouter();
  const {
    searchParams,
    selectedFlight, setSelectedFlight,
    selectedReturnFlight, setSelectedReturnFlight,
    multiCityFlights, setMultiCityFlights
  } = useBooking();

  const [flights, setFlights] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const isRoundTrip = searchParams?.tripType === 'roundtrip';
  const isMultiCity = searchParams?.tripType === 'multicity';

  // Current step for selection
  const currentLegIndex = isMultiCity ? multiCityFlights.length : 0;
  const totalLegs = isMultiCity ? searchParams?.multiCityLegs?.length || 0 : (isRoundTrip ? 2 : 1);
  const isSelectingReturn = Boolean(isRoundTrip && selectedFlight && !selectedReturnFlight);
  const isSelectingMulti = Boolean(isMultiCity && currentLegIndex < totalLegs);

  const fetchFlights = useCallback(async () => {
    if (!searchParams) return;

    setIsLoading(true);
    let from = searchParams.from;
    let to = searchParams.to;
    let date = searchParams.date;

    if (isSelectingReturn) {
      from = searchParams.to;
      to = searchParams.from;
      date = searchParams.returnDate || date;
    } else if (isMultiCity && searchParams.multiCityLegs) {
      const leg = searchParams.multiCityLegs[currentLegIndex];
      from = leg.from;
      to = leg.to;
      date = leg.date;
    }

    try {
      const response = await fetch(`/api/flights?from=${from}&to=${to}&date=${date}`);
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data)) {
          setFlights(data);
        } else {
          setFlights([]);
          console.error("Flights data is not an array:", data);
        }
      }
    } catch (error) {
      console.error("Failed to fetch flights", error);
    } finally {
      setIsLoading(false);
    }
  }, [searchParams, isSelectingReturn, isMultiCity, currentLegIndex]);

  useEffect(() => {
    if (!searchParams) {
      navigate.push('/');
      return;
    }
    fetchFlights();
  }, [searchParams, fetchFlights, navigate]);

  const handleSelect = (flight: any) => {
    if (isMultiCity) {
      const updated = [...multiCityFlights, flight];
      setMultiCityFlights(updated);
      if (updated.length === totalLegs) {
        // Multi-city selection complete
        setSelectedFlight(updated[0]); // Set first for legacy compatibility
        navigate.push('/booking');
      } else {
        toast.success(`Leg ${currentLegIndex + 1} selected! Now select Leg ${currentLegIndex + 2}.`);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else if (isRoundTrip) {
      if (!selectedFlight) {
        setSelectedFlight(flight);
        toast.info("Outbound flight selected. Now select your return flight.");
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setSelectedReturnFlight(flight);
        navigate.push('/booking');
      }
    } else {
      setSelectedFlight(flight);
      navigate.push('/booking');
    }
  };

  if (!searchParams) return null;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-32">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:row justify-between items-start mb-8 gap-4">
            <div>
              <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-widest mb-2">
                {isMultiCity ? (
                  <>Leg {currentLegIndex + 1} of {totalLegs}</>
                ) : (
                  isSelectingReturn ? "Select Return Flight" : "Select Outbound Flight"
                )}
              </div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                {isMultiCity ? (
                  <>{searchParams.multiCityLegs![currentLegIndex].from} <ArrowRight className="w-6 h-6 text-muted-foreground" /> {searchParams.multiCityLegs![currentLegIndex].to}</>
                ) : (
                  isSelectingReturn
                    ? <>{searchParams.to} <ArrowRight className="w-6 h-6 text-muted-foreground" /> {searchParams.from}</>
                    : <>{searchParams.from} <ArrowRight className="w-6 h-6 text-muted-foreground" /> {searchParams.to}</>
                )}
              </h1>
              <p className="text-muted-foreground mt-1 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {isMultiCity ? searchParams.multiCityLegs![currentLegIndex].date : (isSelectingReturn ? searchParams.returnDate : searchParams.date)}
                • {searchParams.passengers} Passenger(s)
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Sidebar Filters */}
            <div className="lg:col-span-3 space-y-6">
              <div className="bg-card rounded-2xl p-6 shadow-soft border border-border">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold flex items-center gap-2">
                    <Filter className="w-4 h-4 text-primary" />
                    Filters
                  </h3>
                  <button className="text-xs text-primary font-semibold hover:underline">Reset All</button>
                </div>
                {/* Filter segments... */}
              </div>
            </div>

            {/* Flight Results */}
            <div className="lg:col-span-9 space-y-4">
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-48 bg-secondary/50 rounded-2xl animate-pulse" />
                ))
              ) : flights.length > 0 ? (
                flights.map((flight, index) => (
                  <FlightCard
                    key={flight.id}
                    flight={flight}
                    onSelect={() => handleSelect(flight)}
                    isReturnLeg={isSelectingReturn}
                  />
                ))
              ) : (
                <div className="text-center py-20 bg-card rounded-2xl border border-dashed border-border">
                  <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                    <Plane className="w-8 h-8 text-muted-foreground/50" />
                  </div>
                  <h3 className="text-xl font-bold">No flights found</h3>
                  <p className="text-muted-foreground">Try adjusting your filters or search criteria.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Selection Summary Overlay */}
      <AnimatePresence>
        {(selectedFlight || (isMultiCity && multiCityFlights.length > 0)) && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-0 left-0 right-0 bg-card/80 backdrop-blur-xl border-t border-border z-40 p-4 shadow-[0_-10px_40px_rgba(0,0,0,0.1)]"
          >
            <div className="container mx-auto max-w-6xl flex justify-between items-center">
              <div className="flex items-center gap-6 overflow-x-auto pb-2 scrollbar-none">
                {isMultiCity ? (
                  multiCityFlights.map((f, i) => (
                    <div key={i} className="flex items-center gap-3 bg-secondary/50 p-2 rounded-xl border border-border min-w-fit">
                      <div className="w-8 h-8 rounded-lg sky-gradient flex items-center justify-center text-white font-bold text-xs">{i + 1}</div>
                      <div>
                        <p className="text-[10px] font-bold text-primary uppercase">{f.source_airport} → {f.destination_airport}</p>
                        <p className="text-xs font-bold">{f.airline}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  selectedFlight && (
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-3 bg-secondary/50 p-2 rounded-xl border border-primary/20">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary"><Plane className="w-4 h-4 rotate-45" /></div>
                        <div>
                          <p className="text-[10px] font-bold text-primary uppercase">Outbound</p>
                          <p className="text-xs font-bold">{selectedFlight.source_airport} → {selectedFlight.destination_airport}</p>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
              <div className="flex items-center gap-4 pr-1">
                <div className="text-right">
                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">Total Selection</p>
                  <p className="text-lg font-bold text-primary">
                    ₹{(selectedFlight?.price || 0 + (selectedReturnFlight?.price || 0) + multiCityFlights.reduce((s, f) => s + f.price, 0)).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FlightsPage;
