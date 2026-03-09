"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Shield, Mail, Lock, Eye, EyeOff, Plane, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
;
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import Link from 'next/link'; import { } from 'next/navigation';

const AdminLoginPage = () => {
  const navigate = useRouter();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [forgotMode, setForgotMode] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }
    setLoading(true);
    try {
      // Mock password reset
      await new Promise(resolve => setTimeout(resolve, 1000));
      setResetSent(true);
      toast.success('Password reset email sent! (Mock implementation)');
    } catch (error: any) {
      toast.error(error.message || 'Failed to send reset email');
    }
    setLoading(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    const { user, error } = await signIn(email, password);

    if (error) {
      toast.error(error.message || 'Authentication failed');
      setLoading(false);
      return;
    }

    if (!user || !user.isAdmin) {
      toast.error('Access denied. You are not an admin.');
      setLoading(false);
      return;
    }

    toast.success('Welcome, Admin!');
    navigate.push('/admin');
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left panel - branding */}
      <div className="hidden lg:flex lg:w-1/2 sky-gradient relative items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yIDItNCAyLTRzMiAyIDIgNC0yIDQtMiA0LTItMi0yLTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="relative text-center text-white px-12"
        >
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Plane className="w-10 h-10" />
          </div>
          <h1 className="text-4xl font-bold mb-3">
            Sky<span className="opacity-80">Book</span>
          </h1>
          <p className="text-xl text-white/80 mb-2">Admin Control Center</p>
          <p className="text-white/60 text-sm max-w-sm mx-auto">
            Manage flights, bookings, discounts and monitor your platform from one dashboard.
          </p>
        </motion.div>
      </div>

      {/* Right panel - login form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                {forgotMode ? 'Reset Password' : 'Admin Login'}
              </h2>
              <p className="text-sm text-muted-foreground">
                {forgotMode
                  ? 'Enter your email to receive a reset link'
                  : 'Sign in to access the admin panel'}
              </p>
            </div>
          </div>

          {resetSent ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center space-y-4"
            >
              <div className="w-16 h-16 mx-auto rounded-full bg-green-100 flex items-center justify-center">
                <Mail className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Check your inbox</h3>
              <p className="text-sm text-muted-foreground">
                We've sent a password reset link to <strong>{email}</strong>. Click the link in the email to set a new password.
              </p>
              <Button variant="outline" onClick={() => { setResetSent(false); setForgotMode(false); }} className="gap-2">
                <ArrowLeft className="w-4 h-4" /> Back to Login
              </Button>
            </motion.div>
          ) : forgotMode ? (
            <form onSubmit={handleForgotPassword} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@skybook.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Button type="submit" disabled={loading} className="w-full gap-2" size="lg">
                {loading ? (
                  <div className="animate-spin w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full" />
                ) : (
                  <Mail className="w-4 h-4" />
                )}
                {loading ? 'Sending...' : 'Send Reset Link'}
              </Button>
              <button
                type="button"
                onClick={() => setForgotMode(false)}
                className="w-full text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                ← Back to Login
              </button>
            </form>
          ) : (
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@skybook.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <button
                    type="button"
                    onClick={() => setForgotMode(true)}
                    className="text-xs font-semibold text-primary hover:underline flex items-center gap-1 underline underline-offset-2"
                  >
                    🔑 Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button type="submit" disabled={loading} className="w-full gap-2" size="lg">
                {loading ? (
                  <div className="animate-spin w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full" />
                ) : (
                  <Shield className="w-4 h-4" />
                )}
                {loading ? 'Signing in...' : 'Sign In as Admin'}
              </Button>
            </form>
          )}

          <div className="mt-8 text-center">
            <Link href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              ← Back to SkyBook
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
