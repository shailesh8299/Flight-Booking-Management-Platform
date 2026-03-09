import { motion } from 'framer-motion';
import { Plane, Clock, Users, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Flight } from '@/lib/flightData';
import { cn } from '@/lib/utils';

interface FlightCardProps {
  flight: Flight;
  isSelected?: boolean;
  onSelect: (flight: Flight) => void;
  passengers?: number;
  isReturnLeg?: boolean;
}

const FlightCard: React.FC<FlightCardProps> = ({ flight, isSelected = false, onSelect, passengers = 1, isReturnLeg = false }) => {
  const airlineLogos: Record<string, string> = {
    'IndiGo': '🛫',
    'Air India': '✈️',
    'SpiceJet': '🌶️',
    'Vistara': '⭐',
    'GoAir': '🛩️',
    'AirAsia India': '🔴',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "bg-card rounded-2xl p-6 shadow-soft hover:shadow-elevated transition-all duration-300 border-2",
        isSelected ? "border-primary ring-2 ring-primary/20" : "border-transparent"
      )}
    >
      <div className="flex flex-col md:flex-row md:items-center gap-6">
        {/* Airline Info */}
        <div className="flex items-center gap-4 md:w-40">
          <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center text-2xl">
            {airlineLogos[flight.airline] || '✈️'}
          </div>
          <div>
            <p className="font-semibold text-foreground">{flight.airline}</p>
            <p className="text-sm text-muted-foreground">{flight.flight_number}</p>
          </div>
        </div>

        {/* Flight Times */}
        <div className="flex-1 flex items-center gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground">{flight.departure_time}</p>
            <p className="text-xs font-bold text-primary flex items-center gap-1 justify-center">
              <MapPin className="w-3 h-3" /> {flight.source_airport}
            </p>
          </div>

          <div className="flex-1 flex items-center gap-2 px-4">
            <div className="h-0.5 flex-1 bg-gradient-to-r from-primary/50 to-transparent rounded-full" />
            <div className="flex flex-col items-center">
              <Plane className={cn("w-5 h-5 text-primary", isReturnLeg ? "-rotate-90" : "rotate-90")} />
              <span className="text-xs text-muted-foreground mt-1">{flight.duration}</span>
            </div>
            <div className="h-0.5 flex-1 bg-gradient-to-l from-primary/50 to-transparent rounded-full" />
          </div>

          <div className="text-center">
            <p className="text-2xl font-bold text-foreground">{flight.arrival_time}</p>
            <p className="text-xs font-bold text-primary flex items-center gap-1 justify-center">
              <MapPin className="w-3 h-3" /> {flight.destination_airport}
            </p>
          </div>
        </div>

        {/* Flight Info */}
        <div className="flex items-center gap-6 md:w-48">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span className={cn(
              "text-xs font-medium px-2 py-1 rounded-lg",
              flight.flight_type === 'Non-Stop'
                ? "bg-green-100 text-green-700"
                : "bg-amber-100 text-amber-700"
            )}>
              {flight.flight_type}
            </span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Users className="w-4 h-4" />
            <span className="text-sm">{flight.seats_available}</span>
          </div>
        </div>

        {/* Price & Book */}
        <div className="flex items-center gap-4 md:w-48">
          <div className="text-right flex-1">
            <p className="text-2xl font-bold text-primary">
              ₹{(flight.price * passengers).toLocaleString()}
            </p>
            <p className="text-[10px] text-muted-foreground uppercase flex flex-col">
              <span>₹{flight.price.toLocaleString()} / adult</span>
              {passengers > 1 && <span>× {passengers} passengers</span>}
            </p>
          </div>
          <Button
            onClick={() => onSelect(flight)}
            variant={isSelected ? "hero" : "outline"}
            size="default"
          >
            {isSelected ? 'Selected' : 'Select'}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default FlightCard;
