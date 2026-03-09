import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Calendar, Users, Search, Plus, Trash2, Repeat, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useBooking } from '@/context/BookingContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { TOP_AIRPORTS } from '@/lib/flightData';

const AirportSuggester = ({ value, onChange, label, icon: Icon, placeholder }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState(value);

  const filteredAirports = TOP_AIRPORTS.filter(
    a => a.city.toLowerCase().includes(search.toLowerCase()) ||
      a.code.toLowerCase().includes(search.toLowerCase()) ||
      a.name.toLowerCase().includes(search.toLowerCase())
  ).slice(0, 5);

  return (
    <div className="relative w-full">
      <Label className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-2 mb-2">
        {Icon && <Icon className="w-3 h-3" />} {label}
      </Label>
      <Input
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setTimeout(() => setIsOpen(false), 200)}
        placeholder={placeholder}
        className="bg-secondary/30 border-none h-12 text-lg font-medium focus-visible:ring-primary"
      />
      <AnimatePresence>
        {isOpen && search.length > 0 && filteredAirports.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-50 w-full mt-2 bg-card border border-border rounded-2xl shadow-elevated overflow-hidden"
          >
            {filteredAirports.map((airport) => (
              <button
                key={airport.code}
                className="w-full px-4 py-3 text-left hover:bg-secondary flex items-center justify-between border-b border-border last:border-none transition-colors"
                onClick={() => {
                  const val = `${airport.city} (${airport.code})`;
                  setSearch(val);
                  onChange(val);
                  setIsOpen(false);
                }}
              >
                <div>
                  <div className="font-bold text-foreground">{airport.city}</div>
                  <div className="text-xs text-muted-foreground">{airport.name}</div>
                </div>
                <div className="bg-primary/10 text-primary px-2 py-1 rounded text-xs font-bold uppercase">
                  {airport.code}
                </div>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FlightSearch = () => {
  const navigate = useRouter();
  const { setSearchParams, resetBooking } = useBooking();
  const [mounted, setMounted] = useState(false);

  const [tripType, setTripType] = useState<'oneway' | 'roundtrip' | 'multicity'>('oneway');
  const [from, setFrom] = useState('New Delhi (DEL)');
  const [to, setTo] = useState('Mumbai (BOM)');
  const [date, setDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [passengers, setPassengers] = useState(1);

  useEffect(() => {
    setMounted(true);
    setDate(format(new Date(), 'yyyy-MM-dd'));
    setReturnDate(format(new Date(Date.now() + 86400000 * 3), 'yyyy-MM-dd'));
  }, []);

  // Multi-city legs
  const [legs, setLegs] = useState<any[]>([]);

  useEffect(() => {
    setMounted(true);
    const today = format(new Date(), 'yyyy-MM-dd');
    setDate(today);
    setReturnDate(format(new Date(Date.now() + 86400000 * 3), 'yyyy-MM-dd'));

    // Initialize legs
    setLegs([
      { from: 'New Delhi (DEL)', to: 'Mumbai (BOM)', date: today },
      { from: 'Mumbai (BOM)', to: 'Bangalore (BLR)', date: format(new Date(Date.now() + 86400000 * 3), 'yyyy-MM-dd') }
    ]);
  }, []);

  const addLeg = () => {
    if (legs.length < 5) {
      const lastLeg = legs[legs.length - 1];
      setLegs([...legs, { from: lastLeg.to, to: '', date: format(new Date(new Date(lastLeg.date).getTime() + 86400000 * 2), 'yyyy-MM-dd') }]);
    }
  };

  const removeLeg = (index: number) => {
    if (legs.length > 2) {
      setLegs(legs.filter((_, i) => i !== index));
    }
  };

  const updateLeg = (index: number, field: string, value: string) => {
    const newLegs = [...legs];
    newLegs[index] = { ...newLegs[index], [field]: value };
    setLegs(newLegs);
  };

  const handleSearch = () => {
    resetBooking();
    const params = {
      from: tripType === 'multicity' ? legs[0].from : from,
      to: tripType === 'multicity' ? legs[0].to : to,
      date: tripType === 'multicity' ? legs[0].date : date,
      returnDate: tripType === 'roundtrip' ? returnDate : undefined,
      passengers,
      tripType,
      multiCityLegs: tripType === 'multicity' ? legs : undefined
    };
    setSearchParams(params);
    navigate.push('/flights');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-6xl mx-auto bg-card rounded-3xl shadow-elevated p-8 border border-border"
    >
      {!mounted ? (
        <div className="h-[400px] flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      ) : (
        <>
          {/* Trip Type Tabs */}
          <div className="flex gap-2 mb-8 p-1 bg-secondary/50 rounded-2xl w-fit">
            {[
              { id: 'oneway', label: 'One Way', icon: ArrowRight },
              { id: 'roundtrip', label: 'Round Trip', icon: Repeat },
              { id: 'multicity', label: 'Multi-City', icon: Plus }
            ].map((type) => (
              <button
                key={type.id}
                onClick={() => setTripType(type.id as any)}
                suppressHydrationWarning
                className={cn(
                  "flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all",
                  tripType === type.id
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                    : "text-muted-foreground hover:bg-secondary"
                )}
              >
                <type.icon className="w-4 h-4" />
                {type.label}
              </button>
            ))}
          </div>

          <div className="space-y-6">
            {tripType !== 'multicity' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <AirportSuggester
                  label="From"
                  icon={MapPin}
                  value={from}
                  onChange={setFrom}
                  placeholder="Source City"
                />
                <AirportSuggester
                  label="To"
                  icon={MapPin}
                  value={to}
                  onChange={setTo}
                  placeholder="Destination City"
                />
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-2">
                    <Calendar className="w-3 h-3" /> Departure
                  </Label>
                  <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="bg-secondary/30 border-none h-12" />
                </div>
                {tripType === 'roundtrip' && (
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-2">
                      <Calendar className="w-3 h-3" /> Return
                    </Label>
                    <Input type="date" value={returnDate} onChange={(e) => setReturnDate(e.target.value)} className="bg-secondary/30 border-none h-12" />
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <AnimatePresence>
                  {legs.map((leg, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end p-4 bg-secondary/20 rounded-2xl relative group"
                    >
                      <AirportSuggester
                        label="From"
                        value={leg.from}
                        onChange={(val: string) => updateLeg(index, 'from', val)}
                        placeholder="Source"
                      />
                      <AirportSuggester
                        label="To"
                        value={leg.to}
                        onChange={(val: string) => updateLeg(index, 'to', val)}
                        placeholder="Destination"
                      />
                      <div className="flex gap-2">
                        <div className="space-y-2 flex-1">
                          <Label className="text-[10px] font-bold text-muted-foreground uppercase">Date</Label>
                          <Input type="date" value={leg.date} onChange={(e) => updateLeg(index, 'date', e.target.value)} className="bg-background border-border" />
                        </div>
                        {legs.length > 2 && (
                          <Button variant="ghost" size="icon" onClick={() => removeLeg(index)} className="text-red-500 hover:bg-red-50 mb-1">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                      <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full sky-gradient text-[10px] flex items-center justify-center font-bold text-white shadow-lg">
                        {index + 1}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                <Button variant="outline" onClick={addLeg} className="border-dashed border-2 py-6 w-full opacity-60 hover:opacity-100 transition-all">
                  <Plus className="w-4 h-4 mr-2" /> Add another city
                </Button>
              </div>
            )}

            <div className="flex flex-col md:row items-center justify-between pt-6 border-t border-border gap-6">
              <div className="flex items-center gap-4">
                <Label className="text-sm font-semibold text-muted-foreground">Passengers:</Label>
                <div className="flex items-center gap-2 bg-secondary/30 p-1 rounded-xl">
                  {[1, 2, 3, 4, 5].map(n => (
                    <button
                      key={n}
                      onClick={() => setPassengers(n)}
                      suppressHydrationWarning
                      className={cn(
                        "w-8 h-8 rounded-lg text-xs font-bold transition-all",
                        passengers === n ? "bg-white text-primary shadow-soft" : "text-muted-foreground hover:bg-white/50"
                      )}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>

              <Button onClick={handleSearch} size="xl" className="w-full md:w-64 sky-gradient shadow-xl shadow-primary/30 group">
                <Search className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                Search Flights
              </Button>
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
};

export default FlightSearch;
