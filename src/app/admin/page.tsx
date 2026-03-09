"use client";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plane, Ticket, Users, IndianRupee } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
;

interface Stats {
  totalFlights: number;
  totalBookings: number;
  totalRevenue: number;
  totalPassengers: number;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<Stats>({ totalFlights: 0, totalBookings: 0, totalRevenue: 0, totalPassengers: 0 });
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const [flightsRes, bookingsRes, passengersRes] = await Promise.all([
        fetch(`/api/flights`).then(r => r.json()),
        fetch(`/api/bookings`).then(r => r.json()),
        fetch(`/api/passengers`).then(r => r.json()),
      ]);

      const flights = Array.isArray(flightsRes) ? flightsRes : [];
      const bookings = Array.isArray(bookingsRes) ? bookingsRes : [];
      const passengers = Array.isArray(passengersRes) ? passengersRes : [];

      const totalRevenue = bookings.reduce((sum, b) => sum + Number(b.total_amount || 0), 0);

      setStats({
        totalFlights: flights.length,
        totalBookings: bookings.length,
        totalRevenue,
        totalPassengers: passengers.length,
      });
      setRecentBookings([...bookings].reverse().slice(0, 5));
      setLoading(false);
    };
    fetchStats();
  }, []);

  const statCards = [
    { label: 'Total Flights', value: stats.totalFlights, icon: Plane, color: 'bg-primary/10 text-primary' },
    { label: 'Total Bookings', value: stats.totalBookings, icon: Ticket, color: 'bg-accent/10 text-accent' },
    { label: 'Revenue', value: `₹${stats.totalRevenue.toLocaleString()}`, icon: IndianRupee, color: 'bg-green-100 text-green-600' },
    { label: 'Passengers', value: stats.totalPassengers, icon: Users, color: 'bg-purple-100 text-purple-600' },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Overview of your flight booking platform</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-card rounded-2xl p-6 shadow-soft animate-pulse h-32" />
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {statCards.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-card rounded-2xl p-6 shadow-soft"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}>
                      <stat.icon className="w-6 h-6" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </motion.div>
              ))}
            </div>

            {/* Recent Bookings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-card rounded-2xl shadow-soft"
            >
              <div className="p-6 border-b border-border">
                <h2 className="text-lg font-semibold text-foreground">Recent Bookings</h2>
              </div>
              <div className="divide-y divide-border">
                {recentBookings.map((booking) => (
                  <div key={booking.id} className="px-6 py-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">
                        {(booking.flights as any)?.airline} — {(booking.flights as any)?.flight_number}
                      </p>
                      <p className="text-sm text-muted-foreground">PNR: {booking.pnr}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-foreground">₹{Number(booking.total_amount).toLocaleString()}</p>
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${booking.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                        {booking.status}
                      </span>
                    </div>
                  </div>
                ))}
                {recentBookings.length === 0 && (
                  <div className="px-6 py-8 text-center text-muted-foreground">No bookings yet</div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
