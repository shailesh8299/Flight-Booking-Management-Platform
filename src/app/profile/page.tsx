"use client";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/Header';
import { User, Shield, Users, Trash2, Plus, Mail, Phone, Award, ChevronRight, CheckCircle2, Plane } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from "@/components/ui/label";
import { AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

const ProfilePage = () => {
    const { user, loading, logout } = useAuth();
    const navigate = useRouter();
    const [passengers, setPassengers] = useState<any[]>([]);
    const [isAdding, setIsAdding] = useState(false);
    const [isEditingProfile, setIsEditingProfile] = useState(false);

    // Profile fields
    const [address, setAddress] = useState(user?.address || '');
    const [age, setAge] = useState(user?.age?.toString() || '');
    const [phone, setPhone] = useState(user?.phone || '');

    // Passenger fields
    const [newName, setNewName] = useState('');
    const [newAge, setNewAge] = useState('');
    const [newGender, setNewGender] = useState('Male');

    useEffect(() => {
        if (!loading && !user) {
            navigate.push('/auth');
        }
    }, [user, loading, navigate]);

    useEffect(() => {
        if (user?.frequent_passengers) {
            setPassengers(user.frequent_passengers);
        }
        if (user) {
            setAddress(user.address || '');
            setAge(user.age?.toString() || '');
            setPhone(user.phone || '');
        }
    }, [user]);

    const handleDeletePassenger = async (index: number) => {
        const updated = passengers.filter((_, i) => i !== index);
        try {
            const res = await fetch(`/api/users/${user?.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ frequent_passengers: updated })
            });
            if (res.ok) {
                setPassengers(updated);
                toast.success("Passenger removed");
            }
        } catch (e) {
            toast.error("Failed to remove passenger");
        }
    };

    const handleAddPassenger = async () => {
        if (!newName || !newAge) return;

        const newPassenger = { name: newName, age: parseInt(newAge), gender: newGender };
        const updated = [...passengers, newPassenger];

        try {
            const res = await fetch(`/api/users/${user?.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ frequent_passengers: updated })
            });
            if (res.ok) {
                setPassengers(updated);
                setIsAdding(false);
                setNewName('');
                setNewAge('');
                toast.success("Passenger added!");
            }
        } catch (e) {
            toast.error("Failed to add passenger");
        }
    };

    const handleUpdateProfile = async () => {
        try {
            const res = await fetch(`/api/users/${user?.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    address,
                    age: parseInt(age) || undefined,
                    phone
                })
            });
            if (res.ok) {
                toast.success("Profile updated!");
                setIsEditingProfile(false);
            }
        } catch (e) {
            toast.error("Failed to update profile");
        }
    };

    if (loading || !user) return null;

    return (
        <div className="min-h-screen bg-background">
            <Header />

            <main className="pt-24 pb-16">
                <div className="container mx-auto px-4 max-w-5xl">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Sidebar info */}
                        <div className="lg:col-span-4 space-y-6">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-card rounded-3xl p-8 shadow-soft border border-border text-center"
                            >
                                <div className="w-24 h-24 rounded-full sky-gradient mx-auto mb-4 flex items-center justify-center text-3xl font-bold text-white shadow-xl shadow-primary/20">
                                    {(user.firstName || 'U')[0]}{(user.lastName || '')[0]}
                                </div>
                                <h2 className="text-2xl font-bold text-foreground">{user.firstName || 'User'} {user.lastName || ''}</h2>
                                <div className="flex items-center justify-center gap-2 mb-6">
                                    <p className="text-muted-foreground text-sm capitalize">{user.isAdmin ? 'Admin' : 'User'} Account</p>
                                    {user.isVerified ? (
                                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                                    ) : (
                                        <span className="text-[10px] bg-amber-100 text-amber-600 px-2 py-0.5 rounded-full font-bold">Unverified</span>
                                    )}
                                </div>

                                <div className="space-y-3 text-left">
                                    <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-xl text-sm">
                                        <Mail className="w-4 h-4 text-primary" />
                                        <span className="truncate">{user.email}</span>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-xl text-sm">
                                        <Phone className="w-4 h-4 text-primary" />
                                        <span>+91 {user.phone || 'Enter mobile'}</span>
                                    </div>
                                    {user.address && (
                                        <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-xl text-sm italic">
                                            <span className="truncate">{user.address}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-6 flex flex-col gap-2">
                                    <Button variant="outline" className="w-full" onClick={() => setIsEditingProfile(!isEditingProfile)}>
                                        {isEditingProfile ? 'Cancel Editing' : 'Edit Profile'}
                                    </Button>
                                    {user.isAdmin && (
                                        <Button variant="hero" className="w-full" onClick={() => navigate.push('/admin')}>
                                            <Shield className="w-4 h-4 mr-2" />
                                            Admin Dashboard
                                        </Button>
                                    )}
                                    <Button variant="ghost" className="w-full text-red-500 hover:text-red-600 hover:bg-red-50" onClick={logout}>
                                        Logout
                                    </Button>
                                </div>
                            </motion.div>

                            {/* SkyMiles Card */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 }}
                                className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                    <Award className="w-32 h-32" />
                                </div>
                                <h3 className="text-lg font-semibold text-sky-400 mb-2 flex items-center gap-2">
                                    <Shield className="w-5 h-5" />
                                    SkyMiles Platinum
                                </h3>
                                <div className="mb-6">
                                    <p className="text-4xl font-bold mb-1">{(user.points || 0).toLocaleString()}</p>
                                    <p className="text-slate-400 text-sm">Available Miles</p>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex justify-between text-xs">
                                        <span className="text-slate-400">Next Tier: Diamond</span>
                                        <span>{Math.round(((user.points || 0) / 10000) * 100)}%</span>
                                    </div>
                                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${Math.min(100, ((user.points || 0) / 10000) * 100)}%` }}
                                            className="h-full bg-sky-500 rounded-full shadow-[0_0_10px_rgba(14,165,233,0.5)]"
                                        />
                                    </div>
                                    <p className="text-[10px] text-slate-500">Book more flights to reach Diamond status and get free lounge access!</p>
                                </div>
                            </motion.div>
                        </div>

                        {/* Main Content */}
                        <div className="lg:col-span-8 space-y-8">
                            {/* Profile Editor */}
                            {isEditingProfile && (
                                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-3xl p-8 border border-primary/20 shadow-soft bg-primary/5">
                                    <h3 className="text-xl font-bold mb-6">Complete Your Profile</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label>Mobile Number</Label>
                                            <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="10 digit mobile" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Age</Label>
                                            <Input type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder="Your age" />
                                        </div>
                                        <div className="md:col-span-2 space-y-2">
                                            <Label>Current Address</Label>
                                            <Input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="House no, Street, City" />
                                        </div>
                                    </div>
                                    <div className="flex justify-end gap-3 mt-8">
                                        <Button variant="ghost" onClick={() => setIsEditingProfile(false)}>Cancel</Button>
                                        <Button onClick={handleUpdateProfile}>Save Changes</Button>
                                    </div>
                                </motion.div>
                            )}

                            {!user.isVerified && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <AlertCircle className="w-5 h-5 text-amber-600" />
                                        <p className="text-amber-800 text-sm font-medium">Your email is not verified.</p>
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="border-amber-300 text-amber-700 hover:bg-amber-100"
                                        onClick={async () => {
                                            try {
                                                const res = await fetch(`/api/users/${user.id}/verify`, { method: 'POST' });
                                                if (res.ok) {
                                                    toast.success("Email verified successfully!");
                                                    // The user object in useAuth should update if it's polling or on next refresh
                                                    // For a mock, a simple refresh or re-login would show it.
                                                }
                                            } catch (e) {
                                                toast.error("Verification failed");
                                            }
                                        }}
                                    >
                                        Verify Now
                                    </Button>
                                </motion.div>
                            )}
                            {/* Saved Passengers */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-card rounded-3xl p-8 border border-border shadow-soft"
                            >
                                <div className="flex justify-between items-center mb-8">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                            <Users className="w-6 h-6" />
                                        </div>
                                        <h3 className="text-xl font-bold text-foreground">Frequent Passengers</h3>
                                    </div>
                                    {!isAdding && (
                                        <Button variant="outline" size="sm" onClick={() => setIsAdding(true)}>
                                            <Plus className="w-4 h-4 mr-2" />
                                            Add New
                                        </Button>
                                    )}
                                </div>

                                {isAdding && (
                                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="mb-8 p-6 bg-secondary/50 rounded-2xl space-y-4 overflow-hidden">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <Input placeholder="Full Name" value={newName} onChange={(e) => setNewName(e.target.value)} />
                                            <Input type="number" placeholder="Age" value={newAge} onChange={(e) => setNewAge(e.target.value)} />
                                            <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background" value={newGender} onChange={(e) => setNewGender(e.target.value)}>
                                                <option>Male</option>
                                                <option>Female</option>
                                                <option>Other</option>
                                            </select>
                                        </div>
                                        <div className="flex gap-2 justify-end">
                                            <Button variant="ghost" size="sm" onClick={() => setIsAdding(false)}>Cancel</Button>
                                            <Button size="sm" onClick={handleAddPassenger}>Save Passenger</Button>
                                        </div>
                                    </motion.div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {passengers.map((p, i) => (
                                        <div key={i} className="flex items-center justify-between p-4 bg-secondary/30 rounded-2xl group hover:bg-secondary/50 transition-all border border-transparent hover:border-border">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center border border-border">
                                                    <User className="w-5 h-5 text-muted-foreground" />
                                                </div>
                                                <div>
                                                    <p className="font-semibold">{p.name}</p>
                                                    <p className="text-xs text-muted-foreground">{p.gender}, {p.age}y</p>
                                                </div>
                                            </div>
                                            <button onClick={() => handleDeletePassenger(i)} className="text-muted-foreground hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all p-2">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                    {passengers.length === 0 && (
                                        <div className="col-span-2 py-10 text-center text-muted-foreground">
                                            <p>No saved passengers yet.</p>
                                        </div>
                                    )}
                                </div>
                            </motion.div>

                            {/* Recent Travel Achievements */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="bg-card rounded-3xl p-8 border border-border shadow-soft"
                            >
                                <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                                    Travel Milestone
                                </h3>
                                <div className="space-y-6">
                                    <div className="flex gap-4 items-start">
                                        <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center text-sky-600 flex-shrink-0">
                                            <Plane className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="font-bold">The Explorer</p>
                                            <p className="text-sm text-muted-foreground">You have visited 3 different cities this year. Travel to 2 more cities to unlock "World Traveler" badge!</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4 items-start opacity-50 grayscale">
                                        <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 flex-shrink-0">
                                            <Shield className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-muted-foreground">Business Mogul (Locked)</p>
                                            <p className="text-sm">Complete 5 Business Class bookings to unlock this title.</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ProfilePage;
