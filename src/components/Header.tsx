"use client";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plane, User, LogOut, History, Shield } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import NotificationCenter from './NotificationCenter';

const Header = () => {
  const { user, signOut, loading } = useAuth();
  const navigate = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Admin check handled in Auth context now
    setIsAdmin(user?.isAdmin || false);
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    navigate.push('/');
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 glass-card"
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl sky-gradient flex items-center justify-center shadow-soft group-hover:shadow-glow transition-shadow duration-300">
            <Plane className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground">
            Sky<span className="text-primary">Book</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            Flights
          </Link>
          <Link href="/hotels" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            Hotels
          </Link>
          <span className="text-sm font-medium text-muted-foreground/50 cursor-not-allowed">
            Holidays
          </span>
        </nav>

        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground hidden sm:inline">
            ₹ INR
          </span>

          {user && <NotificationCenter userId={user.id} />}

          {!loading && (
            <>
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="w-4 h-4 text-primary" />
                      </div>
                      <span className="hidden sm:inline text-sm font-medium">
                        {user.email?.split('@')[0]}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    {isAdmin && (
                      <>
                        <DropdownMenuItem onClick={() => navigate.push('/admin')}>
                          <Shield className="w-4 h-4 mr-2" />
                          Admin Panel
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                      </>
                    )}
                    <DropdownMenuItem onClick={() => navigate.push('/profile')}>
                      <User className="w-4 h-4 mr-2" />
                      My Profile
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate.push('/my-bookings')}>
                      <History className="w-4 h-4 mr-2" />
                      My Bookings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button
                  variant="hero"
                  size="sm"
                  onClick={() => navigate.push('/auth')}
                  className="gap-2"
                >
                  <User className="w-4 h-4" />
                  Login
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
