"use client";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/useAuth";
import { BookingProvider } from "@/context/BookingContext";
import Providers from "./providers";
import "@/globals.css";


export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <link rel="icon" href="/favicon.png" type="image/png" />
                <title>SkyBook - Premium Flight Booking</title>
            </head>
            <body>
                <Providers>
                    <TooltipProvider>
                        <AuthProvider>
                            <BookingProvider>
                                {children}
                                <Toaster />
                                <Sonner />
                            </BookingProvider>
                        </AuthProvider>
                    </TooltipProvider>
                </Providers>
            </body>
        </html>
    );
}
