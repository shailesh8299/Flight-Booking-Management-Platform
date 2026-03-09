"use client";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Eye } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
;
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { Booking, Passenger } from '@/lib/types';

const AdminBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [passengers, setPassengers] = useState<Passenger[]>([]);

  const fetchBookings = async () => {
    try {
      const response = await fetch('/api/bookings');
      if (response.ok) {
        const data = await response.json();
        setBookings(data || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBookings(); }, []);

  const handleViewDetails = async (booking: Booking) => {
    setSelectedBooking(booking);
    try {
      const response = await fetch(`/api/bookings/${booking.id}/passengers`);
      if (response.ok) {
        const data = await response.json();
        setPassengers(data || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleStatusChange = async (bookingId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (response.ok) {
        toast.success('Status updated');
        fetchBookings();
      } else {
        toast.error('Failed to update status');
      }
    } catch (e) {
      toast.error('Failed to update status');
    }
  };

  const filtered = bookings.filter((b) => {
    const matchSearch =
      (b.pnr || '').toLowerCase().includes(search.toLowerCase()) ||
      ((b.flights as any)?.flight_number || '').toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || b.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Bookings</h1>
          <p className="text-muted-foreground">View and manage all bookings</p>
        </div>

        <div className="flex flex-wrap gap-4">
          <div className="relative max-w-sm flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search by PNR or flight..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => <div key={i} className="bg-card rounded-xl p-4 animate-pulse h-16" />)}
          </div>
        ) : (
          <div className="bg-card rounded-2xl shadow-soft overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">PNR</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Flight</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Route</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Travel Date</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Passengers</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Amount</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                    <th className="px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.map((booking) => (
                    <tr key={booking.id} className="hover:bg-secondary/50 transition-colors">
                      <td className="px-4 py-3 font-mono font-medium text-foreground">{booking.pnr}</td>
                      <td className="px-4 py-3 text-foreground">
                        {booking.multi_city_flights && booking.multi_city_flights.length > 0 ? (
                          <span className="text-primary font-bold">{booking.multi_city_flights.length} Legs</span>
                        ) : (
                          <>{(booking.flights as any)?.airline} {(booking.flights as any)?.flight_number}</>
                        )}
                      </td>
                      <td className="px-4 py-3 text-foreground">
                        {booking.multi_city_flights && booking.multi_city_flights.length > 0 ? (
                          <span className="text-xs">{booking.multi_city_flights[0].source_airport} → ... → {booking.multi_city_flights[booking.multi_city_flights.length - 1].destination_airport}</span>
                        ) : (
                          <>{(booking.flights as any)?.source_airport} → {(booking.flights as any)?.destination_airport}</>
                        )}
                      </td>
                      <td className="px-4 py-3 text-foreground">{format(new Date(booking.travel_date), 'dd MMM yyyy')}</td>
                      <td className="px-4 py-3 text-foreground">{booking.num_passengers}</td>
                      <td className="px-4 py-3 font-semibold text-foreground">₹{Number(booking.total_amount).toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <Select
                          value={booking.status || 'confirmed'}
                          onValueChange={(v) => handleStatusChange(booking.id, v)}
                        >
                          <SelectTrigger className="h-7 text-xs w-28">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="confirmed">Confirmed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button variant="ghost" size="sm" onClick={() => handleViewDetails(booking)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr><td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">No bookings found</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Booking Details Dialog */}
      <Dialog open={!!selectedBooking} onOpenChange={() => setSelectedBooking(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Booking Details — {selectedBooking?.pnr}</DialogTitle>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-2 gap-4 text-sm">
                {selectedBooking.multi_city_flights && selectedBooking.multi_city_flights.length > 0 ? (
                  <div className="col-span-2 bg-secondary/30 p-3 rounded-xl">
                    <p className="text-xs text-muted-foreground uppercase mb-2">Multi-City Itinerary</p>
                    <div className="space-y-2">
                      {selectedBooking.multi_city_flights.map((f: any, i: number) => (
                        <div key={i} className="flex justify-between text-xs border-b border-border pb-1 last:border-0">
                          <span className="font-bold">{f.source_airport} → {f.destination_airport}</span>
                          <span className="text-muted-foreground">{f.airline} {f.flight_number} | {f.departure_time}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <>
                    <div>
                      <p className="text-muted-foreground">Flight</p>
                      <p className="font-medium text-foreground">{(selectedBooking.flights as any)?.airline} {(selectedBooking.flights as any)?.flight_number}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Travel Date</p>
                      <p className="font-medium text-foreground">{format(new Date(selectedBooking.travel_date), 'dd MMM yyyy')}</p>
                    </div>
                  </>
                )}
                <div>
                  <p className="text-muted-foreground">Total Amount</p>
                  <p className="font-medium text-foreground">₹{Number(selectedBooking.total_amount).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Seat Class</p>
                  <p className="font-medium text-foreground capitalize">{selectedBooking.seat_class || 'Economy'}</p>
                </div>
                {selectedBooking.discount_type && selectedBooking.discount_type !== 'none' && (
                  <div>
                    <p className="text-muted-foreground">Discount</p>
                    <p className="font-medium text-foreground capitalize">{selectedBooking.discount_type} ({selectedBooking.discount_percentage}%)</p>
                  </div>
                )}
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">Passengers</h3>
                <div className="space-y-2">
                  {passengers.map((p) => (
                    <div key={p.id} className="bg-secondary rounded-xl p-3 text-sm">
                      <p className="font-medium text-foreground">{p.name} ({p.gender}, {p.age}y)</p>
                      <div className="flex gap-4 text-muted-foreground mt-1">
                        {p.seat_no && <span>Seat: {p.seat_no}</span>}
                        {p.meal_preference && p.meal_preference !== 'none' && <span>Meal: {p.meal_preference}</span>}
                        {p.discount_type && p.discount_type !== 'none' && <span>Discount: {p.discount_type}</span>}
                      </div>
                    </div>
                  ))}
                  {passengers.length === 0 && <p className="text-muted-foreground text-sm">No passenger data</p>}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminBookings;
