"use client";
import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, ChevronDown, ChevronUp, Utensils, Armchair, Shield, FileText } from 'lucide-react';
import { Passenger, MEAL_OPTIONS, SEAT_PREFERENCES, DISCOUNT_TYPES } from '@/lib/flightData';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import SeatMap from './SeatMap';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface PassengerFormProps {
  index: number;
  passenger: Passenger;
  onChange: (index: number, passenger: Passenger) => void;
  isFirst: boolean;
  frequentPassengers?: any[];
}

const PassengerForm: React.FC<PassengerFormProps> = ({ index, passenger, onChange, isFirst, frequentPassengers = [] }) => {
  const [isExpanded, setIsExpanded] = useState(isFirst);

  const handleSelectFrequent = (saved: any) => {
    onChange(index, {
      ...passenger,
      name: saved.name,
      age: saved.age,
      gender: saved.gender,
      email: isFirst ? saved.email || passenger.email : passenger.email,
      phone: isFirst ? saved.phone || passenger.phone : passenger.phone
    });
  };

  const handleChange = (field: keyof Passenger, value: string | number | boolean) => {
    onChange(index, { ...passenger, [field]: value });
  };

  const selectedDiscount = DISCOUNT_TYPES.find(d => d.code === passenger.discountType);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-card rounded-2xl shadow-soft overflow-hidden"
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-5 flex items-center justify-between hover:bg-secondary/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl sky-gradient flex items-center justify-center">
            <User className="w-5 h-5 text-primary-foreground" />
          </div>
          <div className="text-left">
            <p className="font-semibold text-foreground">
              {passenger.name || `Passenger ${index + 1}`}
            </p>
            <p className="text-sm text-muted-foreground">
              {isFirst ? 'Primary Contact' : 'Co-traveller'}
              {selectedDiscount && selectedDiscount.code !== 'none' && (
                <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                  {selectedDiscount.percentage}% off
                </span>
              )}
            </p>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-5 h-5 text-muted-foreground" />
        )}
      </button>

      {isExpanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="px-5 pb-5"
        >
          <div className="space-y-6 pt-4 border-t border-border">
            {/* Saved Passengers Selector */}
            {frequentPassengers.length > 0 && (
              <div className="mb-6 p-4 bg-primary/5 rounded-xl border border-primary/20">
                <p className="text-sm font-medium text-primary mb-2 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Select from Saved Passengers
                </p>
                <div className="flex flex-wrap gap-2">
                  {frequentPassengers.map((fp, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleSelectFrequent(fp)}
                      className="px-3 py-1.5 bg-white border border-primary/30 rounded-lg text-xs font-medium text-primary hover:bg-primary hover:text-white transition-all"
                    >
                      {fp.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Basic Details */}
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <User className="w-4 h-4" />
                Basic Details
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Full Name *</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="text"
                      value={passenger.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      placeholder="As per ID proof"
                      className="w-full h-12 pl-11 pr-4 rounded-xl border-2 border-border focus:border-primary bg-background text-foreground outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Age */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Age *</label>
                  <input
                    type="number"
                    value={passenger.age || ''}
                    onChange={(e) => handleChange('age', parseInt(e.target.value) || 0)}
                    placeholder="Age"
                    min={1}
                    max={120}
                    className="w-full h-12 px-4 rounded-xl border-2 border-border focus:border-primary bg-background text-foreground outline-none transition-colors"
                  />
                </div>

                {/* Gender */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Gender *</label>
                  <Select value={passenger.gender} onValueChange={(v) => handleChange('gender', v)}>
                    <SelectTrigger className="h-12 rounded-xl border-2 border-border focus:border-primary bg-background">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Email (only for first passenger) */}
                {isFirst && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Email *</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        type="email"
                        value={passenger.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        placeholder="email@example.com"
                        className="w-full h-12 pl-11 pr-4 rounded-xl border-2 border-border focus:border-primary bg-background text-foreground outline-none transition-colors"
                      />
                    </div>
                  </div>
                )}

                {/* Phone (only for first passenger) */}
                {isFirst && (
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-muted-foreground">Phone Number *</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <div className="absolute left-11 top-1/2 -translate-y-1/2 text-muted-foreground">+91</div>
                      <input
                        type="tel"
                        value={passenger.phone}
                        onChange={(e) => handleChange('phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
                        placeholder="10-digit number"
                        className="w-full h-12 pl-20 pr-4 rounded-xl border-2 border-border focus:border-primary bg-background text-foreground outline-none transition-colors"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Seat & Meal Preferences */}
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <Armchair className="w-4 h-4" />
                Seat & Meal Preferences
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Seat Preference */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground flex items-center justify-between">
                    <span>Seat Preference</span>
                    <Dialog>
                      <DialogTrigger asChild>
                        <button type="button" className="text-xs text-primary font-semibold hover:underline">
                          Visual Seat Map
                        </button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Select Your Seat</DialogTitle>
                        </DialogHeader>
                        <div className="py-4">
                          <SeatMap
                            selectedSeat={passenger.seat_no || ''}
                            onSelect={(seat) => handleChange('seat_no', seat)}
                          />
                        </div>
                      </DialogContent>
                    </Dialog>
                  </label>
                  <Select value={passenger.seat_no || ''} onValueChange={(v) => handleChange('seat_no', v)}>
                    <SelectTrigger className="h-12 rounded-xl border-2 border-border focus:border-primary bg-background">
                      <SelectValue placeholder="Select seat type or use map" />
                    </SelectTrigger>
                    <SelectContent>
                      {SEAT_PREFERENCES.map((seat) => (
                        <SelectItem key={seat.code} value={seat.code}>
                          <div className="flex justify-between items-center w-full">
                            <span>{seat.name}</span>
                            {seat.price > 0 && (
                              <span className="text-xs text-muted-foreground ml-2">+₹{seat.price}</span>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                      {passenger.seat_no && !SEAT_PREFERENCES.some(s => s.code === passenger.seat_no) && (
                        <SelectItem value={passenger.seat_no}>
                          Selected: {passenger.seat_no}
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                {/* Meal Preference */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Utensils className="w-4 h-4" />
                    Meal Preference
                  </label>
                  <Select value={passenger.mealPreference || ''} onValueChange={(v) => handleChange('mealPreference', v)}>
                    <SelectTrigger className="h-12 rounded-xl border-2 border-border focus:border-primary bg-background">
                      <SelectValue placeholder="Select meal type" />
                    </SelectTrigger>
                    <SelectContent>
                      {MEAL_OPTIONS.map((meal) => (
                        <SelectItem key={meal.code} value={meal.code}>
                          <div className="flex justify-between items-center w-full">
                            <span>{meal.name}</span>
                            {meal.price > 0 && (
                              <span className="text-xs text-muted-foreground ml-2">+₹{meal.price}</span>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Special Assistance */}
              <div className="flex items-center space-x-2 mt-4">
                <Checkbox
                  id={`special-assistance-${index}`}
                  checked={passenger.specialAssistance || false}
                  onCheckedChange={(checked) => handleChange('specialAssistance', checked as boolean)}
                />
                <Label htmlFor={`special-assistance-${index}`} className="text-sm text-muted-foreground cursor-pointer">
                  I require special assistance (wheelchair, medical needs, etc.)
                </Label>
              </div>
            </div>

            {/* Special Discount */}
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Passenger Category
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Category Type */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Select Category</label>
                  <Select value={passenger.discountType || 'none'} onValueChange={(v) => handleChange('discountType', v)}>
                    <SelectTrigger className="h-12 rounded-xl border-2 border-border focus:border-primary bg-background">
                      <SelectValue placeholder="Select discount type" />
                    </SelectTrigger>
                    <SelectContent>
                      {DISCOUNT_TYPES.map((discount) => (
                        <SelectItem key={discount.code} value={discount.code}>
                          <div className="flex justify-between items-center w-full">
                            <span>{discount.name}</span>
                            {discount.percentage > 0 && (
                              <span className="text-xs text-green-600 ml-2 font-semibold">{discount.percentage}% off</span>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Document Number (if discount selected) */}
                {selectedDiscount && selectedDiscount.code !== 'none' && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      {selectedDiscount.document} Number *
                    </label>
                    <input
                      type="text"
                      value={passenger.discountDocument || ''}
                      onChange={(e) => handleChange('discountDocument', e.target.value)}
                      placeholder={`Enter ${selectedDiscount.document} number`}
                      className="w-full h-12 px-4 rounded-xl border-2 border-border focus:border-primary bg-background text-foreground outline-none transition-colors"
                    />
                  </div>
                )}
              </div>

              {selectedDiscount && selectedDiscount.code !== 'none' && (
                <div className="mt-3 p-3 bg-green-50 rounded-xl border border-green-200">
                  <p className="text-sm text-green-700">
                    ✓ {selectedDiscount.percentage}% discount will be applied for {selectedDiscount.name}.
                    Please carry valid {selectedDiscount.document} for verification at the airport.
                  </p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default PassengerForm;
