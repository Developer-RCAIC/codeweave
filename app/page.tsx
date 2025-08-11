"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import LandingPage from "./components/LandingPage";
import { authService, AuthUser } from "../lib/authService";

export default function Home() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleGetStarted = () => {
    if (user) {
      router.push('/editor');
    } else {
      router.push('/signup');
    }
  };

  const handleViewDashboard = () => {
    if (user) {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0b0f] text-white flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#11b981] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <LandingPage
      onGetStarted={handleGetStarted}
      onViewDashboard={handleViewDashboard}
    />
  );
}
