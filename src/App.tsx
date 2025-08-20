import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import SplashScreen from "@/components/SplashScreen";
import Index from "./pages/Index";
import SignIn from "./pages/signIn";
import SignUp from "./pages/signUp";
import Dashboard from "./pages/Dashboard";
import PaidFines from "./pages/PaidFines";
import NewFines from "./pages/NewFines";
import PendingDisputes from "./pages/PendingDisputes";
import OutstandingFines from "./pages/OutstandingFines";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import { ThemeProvider } from "@/components/theme-provider";
import CitizenDashboard from "./pages/CitizenDashboard";
import MyFines from "./pages/MyFines";
import DisputeFine from "./pages/DisputeFine";
import Payment from "./pages/Payment";
import PaymentSuccess from "./pages/PaymentSuccess";
import FineDetails from "./pages/FineDetails";
import DisputeReview from "./pages/DisputeReview";
import Emergency from "./pages/Emergency";

const queryClient = new QueryClient();

const App = () => {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          {showSplash ? (
            <SplashScreen />
          ) : (
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/sign-in" element={<SignIn />} />
                <Route path="/sign-up" element={<SignUp />} />
                
                {/* Officer Routes */}
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/paid-fines" element={<PaidFines />} />
                <Route path="/new-fines" element={<NewFines />} />
                <Route path="/pending-disputes" element={<PendingDisputes />} />
                <Route path="/outstanding-fines" element={<OutstandingFines />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/dispute-review/:fineId" element={<DisputeReview />} />

                {/* Citizen Routes */}
                <Route path="/citizen-dashboard" element={<CitizenDashboard />} />
                <Route path="/my-fines" element={<MyFines />} />
                <Route path="/dispute-fine/:fineId" element={<DisputeFine />} />
                <Route path="/payment" element={<Payment />} />
                <Route path="/payment/:fineId" element={<Payment />} />
                <Route path="/payment-success" element={<PaymentSuccess />} />
                <Route path="/fine-details/:fineId" element={<FineDetails />} />
                <Route path="/emergency" element={<Emergency />} />

                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          )}
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;