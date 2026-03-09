"use client";
import { motion } from 'framer-motion';
import { Building2, MapPin, Calendar, Users, Star, Clock, ArrowRight } from 'lucide-react';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

const featuredHotels = [
  {
    name: 'The Grand Palace',
    location: 'Mumbai, India',
    rating: 4.8,
    price: '₹8,499',
    image: '🏨',
    tags: ['Luxury', 'Pool', 'Spa'],
  },
  {
    name: 'Skyline Suites',
    location: 'Delhi, India',
    rating: 4.6,
    price: '₹5,299',
    image: '🏢',
    tags: ['Business', 'WiFi', 'Gym'],
  },
  {
    name: 'Ocean Breeze Resort',
    location: 'Goa, India',
    rating: 4.9,
    price: '₹12,999',
    image: '🏖️',
    tags: ['Beachfront', 'Resort', 'Restaurant'],
  },
  {
    name: 'Heritage Inn',
    location: 'Jaipur, India',
    rating: 4.5,
    price: '₹3,799',
    image: '🏛️',
    tags: ['Heritage', 'Breakfast', 'Parking'],
  },
];

const HotelsPage = () => {
  return (
    <div className="min-h-screen bg-background overflow-hidden">
      <Header />

      {/* Hero */}
      <section className="relative pt-24 pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500 opacity-90" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yIDItNCAyLTRzMiAyIDIgNC0yIDQtMiA0LTItMi0yLTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <Badge className="mb-4 bg-white/20 text-white border-white/30 backdrop-blur-sm text-sm px-4 py-1.5">
              <Clock className="w-3.5 h-3.5 mr-1.5" /> Coming Soon
            </Badge>
            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 tracking-tight">
              Find Your Perfect <span className="opacity-80">Stay</span>
            </h1>
            <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-10">
              Hotel booking is on the way! Soon you'll be able to search and book hotels across India — all in one place.
            </p>
          </motion.div>

          {/* Search Card (demo/non-functional) */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-card/95 backdrop-blur-xl rounded-2xl p-6 shadow-elevated border border-border/50">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> Destination
                  </Label>
                  <Input placeholder="e.g. Mumbai" disabled className="bg-muted/50" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> Check-in
                  </Label>
                  <Input type="date" disabled className="bg-muted/50" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> Check-out
                  </Label>
                  <Input type="date" disabled className="bg-muted/50" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                    <Users className="w-3 h-3" /> Guests
                  </Label>
                  <Input placeholder="2 Adults" disabled className="bg-muted/50" />
                </div>
              </div>
              <Button disabled size="lg" className="w-full mt-4 gap-2 opacity-70">
                <Building2 className="w-4 h-4" /> Search Hotels — Coming Soon
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Hotels Preview */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-2">Featured Hotels</h2>
          <p className="text-muted-foreground">A preview of what's coming</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredHotels.map((hotel, i) => (
            <motion.div
              key={hotel.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * i }}
              className="bg-card rounded-2xl border border-border/50 overflow-hidden shadow-soft hover:shadow-elevated transition-shadow group"
            >
              <div className="h-40 bg-muted flex items-center justify-center text-6xl">
                {hotel.image}
              </div>
              <div className="p-4 space-y-3">
                <div>
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                    {hotel.name}
                  </h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {hotel.location}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="font-medium text-foreground">{hotel.rating}</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {hotel.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-border/50">
                  <div>
                    <span className="text-lg font-bold text-foreground">{hotel.price}</span>
                    <span className="text-xs text-muted-foreground">/night</span>
                  </div>
                  <Button size="sm" variant="outline" disabled className="gap-1 text-xs opacity-60">
                    Book <ArrowRight className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-muted/50">
        <div className="max-w-2xl mx-auto text-center px-4">
          <Building2 className="w-12 h-12 text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">Hotel Booking Coming Soon!</h2>
          <p className="text-muted-foreground mb-6">
            We're working hard to bring you the best hotel deals. In the meantime, explore our flight booking services.
          </p>
          <Button asChild size="lg" className="gap-2">
            <a href="/flights">
              Explore Flights <ArrowRight className="w-4 h-4" />
            </a>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default HotelsPage;
