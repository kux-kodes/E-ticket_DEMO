import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SplashScreen from "@/components/SplashScreen";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
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
import DepartmentRegistration from "./pages/DepartmentRegistration";
import DepartmentRegistrationSuccess from "./pages/DepartmentRegistrationSuccess";
import AdminDashboard from "./pages/admin/AdminDashboard";
import DepartmentRequests from "./pages/admin/DepartmentRequests";
import { SessionProvider, useSession } from "./contexts/SessionContext";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const { loading } = useSession();

  if (loading) {
    return <SplashScreen />;
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/register-department" element={<DepartmentRegistration />} />
        <Route path="/department-registration-success" element={<DepartmentRegistrationSuccess />} />

        {/* Officer Routes */}
        <Route element={<ProtectedRoute allowedRoles={['officer', 'department_admin', 'admin']} />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/paid-fines" element={<PaidFines />} />
          <Route path="/new-fines" element={<NewFines />} />
          <Route path="/pending-disputes" element={<PendingDisputes />} />
          <Route path="/outstanding-fines" element={<OutstandingFines />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/dispute-review/:fineId" element={<DisputeReview />} />
        </Route>

        {/* Citizen Routes */}
        <Route element={<ProtectedRoute allowedRoles={['citizen', 'admin']} />}>
          <Route path="/citizen-dashboard" element={<CitizenDashboard />} />
          <Route path="/my-fines" element={<MyFines />} />
          <Route path="/dispute-fine/:fineId" element={<DisputeFine />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/payment/:fineId" element={<Payment />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/fine-details/:fineId" element={<FineDetails />} />
          <Route path="/emergency" element={<Emergency />} />
        </Route>

        {/* Admin Routes */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/department-requests" element={<DepartmentRequests />} />
        </Route>

        {/* Catch-all Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

const App = () => {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <SessionProvider>
            <Toaster />
            <Sonner />
            <AppRoutes />
          </SessionProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;