"use client";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
;
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Flight } from '@/lib/types';

const emptyFlight = {
  flight_number: '',
  airline: '',
  source_airport: '',
  destination_airport: '',
  departure_time: '',
  arrival_time: '',
  duration: '',
  price: 0,
  seats_available: 100,
  status: 'on_time' as const,
  flight_type: 'Non-Stop',
};

const AdminFlights = () => {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [airports, setAirports] = useState<{ airport_code: string; city: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingFlight, setEditingFlight] = useState<Partial<Flight> | null>(null);
  const [formData, setFormData] = useState(emptyFlight);
  const [saving, setSaving] = useState(false);

  const fetchFlights = async () => {
    try {
      const response = await fetch('/api/flights');
      if (response.ok) {
        const data = await response.json();
        setFlights(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchAirports = async () => {
    const { data } = await fetch(`/api/airports`).then(r => r.json());
    setAirports(data || []);
  };

  useEffect(() => {
    fetchFlights();
    fetchAirports();
  }, []);

  const handleAdd = () => {
    setEditingFlight(null);
    setFormData(emptyFlight);
    setDialogOpen(true);
  };

  const handleEdit = (flight: Flight) => {
    setEditingFlight(flight);
    setFormData({
      flight_number: flight.flight_number,
      airline: flight.airline,
      source_airport: flight.source_airport || '',
      destination_airport: flight.destination_airport || '',
      departure_time: flight.departure_time,
      arrival_time: flight.arrival_time,
      duration: flight.duration || '',
      price: flight.price,
      seats_available: flight.seats_available || 100,
      status: (flight.status || 'on_time') as any,
      flight_type: flight.flight_type || 'Non-Stop',
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this flight?')) return;
    try {
      const response = await fetch(`/api/flights/${id}`, { method: 'DELETE' });
      if (response.ok) {
        toast.success('Flight deleted');
        fetchFlights();
      } else {
        toast.error('Failed to delete flight');
      }
    } catch (e) {
      toast.error('Failed to delete flight');
    }
  };

  const handleSave = async () => {
    setSaving(true);
    const payload = {
      flight_number: formData.flight_number,
      airline: formData.airline,
      source_airport: formData.source_airport || null,
      destination_airport: formData.destination_airport || null,
      departure_time: formData.departure_time,
      arrival_time: formData.arrival_time,
      duration: formData.duration || null,
      price: Number(formData.price),
      seats_available: Number(formData.seats_available),
      status: formData.status as any,
      flight_type: formData.flight_type,
    };

    try {
      const method = editingFlight?.id ? 'PUT' : 'POST';
      const url = editingFlight?.id ? `/api/flights/${editingFlight.id}` : '/api/flights';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        toast.success(editingFlight ? 'Flight updated' : 'Flight added');
        setDialogOpen(false);
        fetchFlights();
      } else {
        toast.error('Failed to save flight');
      }
    } catch (e) {
      toast.error('Failed to save flight');
    }
    setSaving(false);
  };

  const filtered = flights.filter(
    (f) =>
      f.flight_number.toLowerCase().includes(search.toLowerCase()) ||
      f.airline.toLowerCase().includes(search.toLowerCase()) ||
      (f.source_airport || '').toLowerCase().includes(search.toLowerCase()) ||
      (f.destination_airport || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Flights</h1>
            <p className="text-muted-foreground">Manage all flights</p>
          </div>
          <Button onClick={handleAdd} className="gap-2">
            <Plus className="w-4 h-4" /> Add Flight
          </Button>
        </div>

        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search flights..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-card rounded-xl p-4 animate-pulse h-16" />
            ))}
          </div>
        ) : (
          <div className="bg-card rounded-2xl shadow-soft overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Flight #</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Airline</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Route</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Time</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Price</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Seats</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                    <th className="px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.map((flight) => (
                    <tr key={flight.id} className="hover:bg-secondary/50 transition-colors">
                      <td className="px-4 py-3 font-medium text-foreground">{flight.flight_number}</td>
                      <td className="px-4 py-3 text-foreground">{flight.airline}</td>
                      <td className="px-4 py-3 text-foreground">{flight.source_airport} → {flight.destination_airport}</td>
                      <td className="px-4 py-3 text-foreground">{flight.departure_time} - {flight.arrival_time}</td>
                      <td className="px-4 py-3 font-semibold text-foreground">₹{Number(flight.price).toLocaleString()}</td>
                      <td className="px-4 py-3 text-foreground">{flight.seats_available}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${flight.status === 'on_time' ? 'bg-green-100 text-green-700' :
                          flight.status === 'delayed' ? 'bg-yellow-100 text-yellow-700' :
                            flight.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                              'bg-blue-100 text-blue-700'
                          }`}>
                          {flight.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(flight)}>
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-destructive" onClick={() => handleDelete(flight.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr><td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">No flights found</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingFlight ? 'Edit Flight' : 'Add New Flight'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Flight Number</Label>
                <Input value={formData.flight_number} onChange={(e) => setFormData({ ...formData, flight_number: e.target.value })} placeholder="e.g. AI-202" />
              </div>
              <div>
                <Label>Airline</Label>
                <Input value={formData.airline} onChange={(e) => setFormData({ ...formData, airline: e.target.value })} placeholder="e.g. Air India" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Source Airport</Label>
                <Select value={formData.source_airport} onValueChange={(v) => setFormData({ ...formData, source_airport: v })}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    {airports.map((a) => (
                      <SelectItem key={a.airport_code} value={a.airport_code}>{a.airport_code} - {a.city}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Destination Airport</Label>
                <Select value={formData.destination_airport} onValueChange={(v) => setFormData({ ...formData, destination_airport: v })}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    {airports.map((a) => (
                      <SelectItem key={a.airport_code} value={a.airport_code}>{a.airport_code} - {a.city}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Departure</Label>
                <Input type="time" value={formData.departure_time} onChange={(e) => setFormData({ ...formData, departure_time: e.target.value })} />
              </div>
              <div>
                <Label>Arrival</Label>
                <Input type="time" value={formData.arrival_time} onChange={(e) => setFormData({ ...formData, arrival_time: e.target.value })} />
              </div>
              <div>
                <Label>Duration</Label>
                <Input value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })} placeholder="e.g. 2h 30m" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Price (₹)</Label>
                <Input type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })} />
              </div>
              <div>
                <Label>Seats</Label>
                <Input type="number" value={formData.seats_available} onChange={(e) => setFormData({ ...formData, seats_available: Number(e.target.value) })} />
              </div>
              <div>
                <Label>Status</Label>
                <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v as any })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {['on_time', 'delayed', 'cancelled', 'boarding', 'departed', 'landed'].map((s) => (
                      <SelectItem key={s} value={s}>{s.replace('_', ' ')}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Flight Type</Label>
              <Select value={formData.flight_type} onValueChange={(v) => setFormData({ ...formData, flight_type: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Non-Stop">Non-Stop</SelectItem>
                  <SelectItem value="1 Stop">1 Stop</SelectItem>
                  <SelectItem value="2 Stops">2 Stops</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleSave} disabled={saving} className="w-full">
              {saving ? 'Saving...' : editingFlight ? 'Update Flight' : 'Add Flight'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminFlights;
