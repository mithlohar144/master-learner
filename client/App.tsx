import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import TimeTable from "./pages/TimeTable";
import Challenge from "./pages/Challenge";
import ChallengeSolver from "./pages/ChallengeSolver";
import UserProfile from "./pages/UserProfile";
import Learn from "./pages/Learn";
import QuizTest from "./pages/QuizTest";
import NotFound from "./pages/NotFound";
import Header from "@/components/Header";

const queryClient = new QueryClient();

function AppRoutes() {
  const [hasProfile, setHasProfile] = useState<boolean | null>(null);

  useEffect(() => {
    const profile = localStorage.getItem('userProfile');
    setHasProfile(!!profile);
  }, []);

  if (hasProfile === null) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <Routes>
      <Route path="/" element={hasProfile ? <Navigate to="/dashboard" replace /> : <Index />} />
      <Route path="/login" element={<Login />} />
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/dashboard" element={hasProfile ? <Dashboard /> : <Navigate to="/login" replace />} />
      <Route path="/legacy" element={<Index />} />
      <Route path="/timetable" element={<TimeTable />} />
      <Route path="/challenge" element={<Challenge />} />
      <Route path="/challenge/:challengeId" element={<ChallengeSolver />} />
      <Route path="/profile" element={hasProfile ? <UserProfile /> : <Navigate to="/login" replace />} />
      <Route path="/learn" element={hasProfile ? <Learn /> : <Navigate to="/login" replace />} />
      <Route path="/quiz-test" element={<QuizTest />} />
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Header />
        <AppRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
