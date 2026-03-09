"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  isAdmin?: boolean;
  isVerified?: boolean;
  role?: string;
  phone?: string;
  address?: string;
  age?: number;
  points?: number;
  frequent_passengers?: any[];
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<{ user?: User; error?: any }>;
  signUp: (email: string, password: string, firstName?: string, lastName?: string) => Promise<{ user?: User; error?: any }>;
  resetPassword: (email: string) => Promise<{ error?: any }>;
  logout: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    // Check local storage for existing session
    const token = localStorage.getItem("auth-token");
    const storedUser = localStorage.getItem("auth-user");

    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      localStorage.setItem("auth-token", data.token);
      localStorage.setItem("auth-user", JSON.stringify(data.user));
      setUser(data.user);

      toast({
        title: "Signed in successfully",
        description: `Welcome back, ${data.user.firstName || 'User'}!`,
      });

      return { user: data.user, error: null };
    } catch (error: any) {
      toast({
        title: "Sign in failed",
        description: error.message,
        variant: "destructive",
      });
      return { error: { message: error.message || "Login failed" } };
    }
  };

  const signUp = async (email: string, password: string, firstName?: string, lastName?: string) => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, firstName, lastName }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Registration failed");
      }

      localStorage.setItem("auth-token", data.token);
      localStorage.setItem("auth-user", JSON.stringify(data.user));
      setUser(data.user);

      toast({
        title: "Account created",
        description: "Welcome to SkyBook!",
      });

      return { user: data.user, error: null };
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
      return { error: { message: error.message || "Registration failed" } };
    }
  };

  const signOut = async () => {
    localStorage.removeItem("auth-token");
    localStorage.removeItem("auth-user");
    setUser(null);
    router.push("/");
    toast({
      title: "Signed out",
      description: "You have been logged out successfully.",
    });
  };

  const resetPassword = async (email: string) => {
    // Mock reset password
    toast({
      title: "Password reset link sent",
      description: "Check your email for further instructions.",
    });
    return { error: null };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAdmin: user?.isAdmin || false,
        signIn,
        signUp,
        logout: signOut,
        signOut,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
