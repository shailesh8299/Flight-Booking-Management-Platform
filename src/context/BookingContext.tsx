"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Flight, SearchParams } from '@/lib/flightData';

interface BookingContextType {
  searchParams: SearchParams | null;
  setSearchParams: (params: SearchParams | null) => void;
  selectedFlight: Flight | null;
  setSelectedFlight: (flight: Flight | null) => void;
  selectedReturnFlight: Flight | null;
  setSelectedReturnFlight: (flight: Flight | null) => void;
  multiCityFlights: Flight[];
  setMultiCityFlights: (flights: Flight[]) => void;
  passengers: any[];
  setPassengers: (passengers: any[]) => void;
  currentBooking: any | null;
  setCurrentBooking: (booking: any | null) => void;
  resetBooking: () => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [searchParams, setSearchParams] = useState<SearchParams | null>(null);
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
  const [selectedReturnFlight, setSelectedReturnFlight] = useState<Flight | null>(null);
  const [multiCityFlights, setMultiCityFlights] = useState<Flight[]>([]);
  const [passengers, setPassengers] = useState<any[]>([]);
  const [currentBooking, setCurrentBooking] = useState<any | null>(null);

  const resetBooking = () => {
    setSelectedFlight(null);
    setSelectedReturnFlight(null);
    setMultiCityFlights([]);
    setPassengers([]);
    setCurrentBooking(null);
  };

  return (
    <BookingContext.Provider
      value={{
        searchParams,
        setSearchParams,
        selectedFlight,
        setSelectedFlight,
        selectedReturnFlight,
        setSelectedReturnFlight,
        multiCityFlights,
        setMultiCityFlights,
        passengers,
        setPassengers,
        currentBooking,
        setCurrentBooking,
        resetBooking,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};
