import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { MealLogProvider } from "./context/MealLogContext";
import { AnimatePresence } from "framer-motion";
import ProtectedRoute from "./components/auth/ProtectedRoute";

// Screens
import HomeScreen from "./screens/HomeScreen";
import CaptureScreen from "./screens/CaptureScreen";
import ResultsScreen from "./screens/ResultsScreen";
import DiaryScreen from "./screens/diary/DiaryScreen";
import MealDetailScreen from "./screens/diary/MealDetailScreen";
import ProgressScreen from "./screens/progress/ProgressScreen";
import MealPlansScreen from "./screens/plans/MealPlansScreen";
import MealPlanDetailScreen from "./screens/plans/MealPlanDetailScreen";
import ProfileScreen from "./screens/profile/ProfileScreen";
import OnboardingProfileScreen from "./screens/onboarding/ProfileScreen";
import PersonalInfoScreen from "./screens/profile/PersonalInfoScreen";
import NotificationsScreen from "./screens/profile/NotificationsScreen";
import VoiceInputScreen from "./screens/voice/VoiceInputScreen";

import BarcodeScannerScreen from "./screens/barcode/BarcodeScannerScreen";
import ManualEntryScreen from "./screens/manual/ManualEntryScreen";
import MyGoalsScreen from "./screens/profile/MyGoalsScreen";
import ExportDataScreen from "./screens/profile/ExportDataScreen";
import HelpScreen from "./screens/profile/HelpScreen";

// Auth & Onboarding
import LoginScreen from "./screens/auth/LoginScreen";
import SignupScreen from "./screens/auth/SignupScreen";
import AuthCallbackScreen from "./screens/auth/AuthCallbackScreen";
import WelcomeScreen from "./screens/onboarding/WelcomeScreen";
import GoalScreen from "./screens/onboarding/GoalScreen";
import CalorieTargetScreen from "./screens/onboarding/CalorieTargetScreen";
import LoadingScreen from "./screens/LoadingScreen";

const queryClient = new QueryClient();

const AppContent = () => {
  const { loading: authLoading, user, profile } = useAuth();
  const location = useLocation();

  if (authLoading) {
    return <LoadingScreen />;
  }

  // Redirect logic for root path
  if (location.pathname === "/") {
    if (!user) return <Navigate to="/welcome" replace />;
    if (profile && !profile.onboarding_completed) return <Navigate to="/onboarding/goal" replace />;
  }

  return (
    <div className="mx-auto max-w-[430px] overflow-hidden bg-background min-h-screen">
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Public Routes */}
          <Route path="/welcome" element={!user ? <WelcomeScreen /> : <Navigate to="/" replace />} />
          <Route path="/login" element={!user ? <LoginScreen /> : <Navigate to="/" replace />} />
          <Route path="/signup" element={!user ? <SignupScreen /> : <Navigate to="/" replace />} />
          <Route path="/auth/callback" element={<AuthCallbackScreen />} />

          {/* Onboarding - Requires Auth but not completion */}
          <Route path="/onboarding/goal" element={<ProtectedRoute requireOnboarding={false}><GoalScreen /></ProtectedRoute>} />
          <Route path="/onboarding/profile" element={<ProtectedRoute requireOnboarding={false}><OnboardingProfileScreen /></ProtectedRoute>} />
          <Route path="/onboarding/calories" element={<ProtectedRoute requireOnboarding={false}><CalorieTargetScreen /></ProtectedRoute>} />

          {/* App Routes - Requires Auth and completion */}
          <Route path="/" element={<ProtectedRoute><HomeScreen /></ProtectedRoute>} />
          <Route path="/capture" element={<ProtectedRoute><CaptureScreen /></ProtectedRoute>} />
          <Route path="/results" element={<ProtectedRoute><ResultsScreen /></ProtectedRoute>} />

          <Route path="/diary" element={<ProtectedRoute><DiaryScreen /></ProtectedRoute>} />
          <Route path="/diary/meal/:mealLogId" element={<ProtectedRoute><MealDetailScreen /></ProtectedRoute>} />

          <Route path="/voice" element={<ProtectedRoute><VoiceInputScreen /></ProtectedRoute>} />
          <Route path="/scan" element={<ProtectedRoute><BarcodeScannerScreen /></ProtectedRoute>} />
          <Route path="/manual-entry" element={<ProtectedRoute><ManualEntryScreen /></ProtectedRoute>} />

          <Route path="/progress" element={<ProtectedRoute><ProgressScreen /></ProtectedRoute>} />

          <Route path="/plans" element={<ProtectedRoute><MealPlansScreen /></ProtectedRoute>} />
          <Route path="/plans/:id" element={<ProtectedRoute><MealPlanDetailScreen /></ProtectedRoute>} />

          <Route path="/profile" element={<ProtectedRoute><ProfileScreen /></ProtectedRoute>} />
          <Route path="/profile/info" element={<ProtectedRoute><PersonalInfoScreen /></ProtectedRoute>} />
          <Route path="/profile/notifications" element={<ProtectedRoute><NotificationsScreen /></ProtectedRoute>} />
          <Route path="/profile/goals" element={<ProtectedRoute><MyGoalsScreen /></ProtectedRoute>} />
          <Route path="/profile/export" element={<ProtectedRoute><ExportDataScreen /></ProtectedRoute>} />
          <Route path="/profile/help" element={<ProtectedRoute><HelpScreen /></ProtectedRoute>} />

          <Route path="/loading" element={<LoadingScreen />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <MealLogProvider>
            <Toaster />
            <Sonner />
            <AppContent />
          </MealLogProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
