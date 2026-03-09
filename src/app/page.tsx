"use client";
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import FlightSearch from '@/components/FlightSearch';

const Index = () => {
  return (
    <div className="min-h-screen bg-background overflow-hidden">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-24 pb-32 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 sky-gradient opacity-90" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yIDItNCAyLTRzMiAyIDIgNC0yIDQtMiA0LTItMi0yLTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />

        {/* Floating Clouds */}
        <motion.div
          animate={{ x: [0, 100, 0], y: [0, -20, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-20 left-10 w-32 h-16 bg-white/20 rounded-full blur-2xl"
        />
        <motion.div
          animate={{ x: [0, -80, 0], y: [0, 15, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute top-40 right-20 w-48 h-24 bg-white/15 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ x: [0, 60, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-20 left-1/4 w-24 h-12 bg-white/10 rounded-full blur-xl"
        />

        <div className="relative container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              Trusted by 1M+ travelers
            </motion.div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Book Your Next
              <br />
              <span className="relative">
                Adventure
                <motion.svg
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 0.8, duration: 1 }}
                  className="absolute -bottom-2 left-0 w-full"
                  viewBox="0 0 300 20"
                  fill="none"
                >
                  <motion.path
                    d="M5 15 Q150 -5 295 15"
                    stroke="hsl(16, 90%, 55%)"
                    strokeWidth="4"
                    strokeLinecap="round"
                    fill="none"
                  />
                </motion.svg>
              </span>
            </h1>

            <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto">
              Discover amazing destinations with the best flight deals.
              Simple booking, transparent pricing, unforgettable journeys.
            </p>
          </motion.div>

          {/* Search Component */}
          <FlightSearch />
        </div>

        {/* Wave Bottom */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              fill="hsl(var(--background))"
            />
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why Choose SkyBook?
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              We make booking flights simple, secure, and satisfying
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "💰",
                title: "Best Price Guarantee",
                description: "We offer competitive prices on all flights with no hidden fees"
              },
              {
                icon: "🔒",
                title: "Secure Payments",
                description: "Your transactions are protected with bank-grade encryption"
              },
              {
                icon: "⚡",
                title: "Instant Confirmation",
                description: "Get your e-ticket immediately after booking"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ y: -8 }}
                className="bg-card rounded-2xl p-8 shadow-soft hover:shadow-elevated transition-all duration-300"
              >
                <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center text-3xl mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Routes */}
      <section className="py-20 bg-secondary/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Popular Routes
            </h2>
            <p className="text-muted-foreground">
              Most booked destinations by our travelers
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { from: 'Delhi', to: 'Mumbai', price: '₹3,499', image: '🌆' },
              { from: 'Bengaluru', to: 'Kolkata', price: '₹4,299', image: '🏛️' },
              { from: 'Mumbai', to: 'Chennai', price: '₹3,899', image: '🌴' },
              { from: 'Delhi', to: 'Hyderabad', price: '₹3,799', image: '🕌' },
            ].map((route, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="bg-card rounded-2xl overflow-hidden shadow-soft hover:shadow-elevated transition-all duration-300 cursor-pointer group"
              >
                <div className="h-32 sky-gradient flex items-center justify-center text-5xl relative overflow-hidden">
                  <motion.span
                    whileHover={{ scale: 1.2, rotate: 10 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {route.image}
                  </motion.span>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold text-foreground">{route.from}</span>
                    <span className="text-muted-foreground">→</span>
                    <span className="font-semibold text-foreground">{route.to}</span>
                  </div>
                  <p className="text-primary font-bold text-lg">
                    Starting {route.price}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-foreground text-background">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl sky-gradient flex items-center justify-center">
                <span className="text-xl">✈️</span>
              </div>
              <span className="text-xl font-bold">SkyBook</span>
            </div>
            <p className="text-center text-background/60 text-sm">
              © 2024 SkyBook. Your journey starts here.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
