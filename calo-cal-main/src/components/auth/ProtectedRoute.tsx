import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import LoadingScreen from "@/screens/LoadingScreen";

interface ProtectedRouteProps {
    children: React.ReactNode;
    requireOnboarding?: boolean;
}

const ProtectedRoute = ({ children, requireOnboarding = true }: ProtectedRouteProps) => {
    const { user, profile, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <LoadingScreen />;
    }

    if (!user) {
        // Save the attempted path for post-login redirect
        return <Navigate to="/welcome" state={{ from: location }} replace />;
    }

    if (requireOnboarding && profile && !profile.onboarding_completed) {
        // If onboarding is required but not completed, redirect to onboarding flow
        // But don't redirect if already in onboarding
        if (!location.pathname.startsWith("/onboarding")) {
            return <Navigate to="/onboarding/goal" replace />;
        }
    }

    if (!requireOnboarding && profile?.onboarding_completed && location.pathname.startsWith("/onboarding")) {
        // If already completed onboarding but trying to access onboarding screens
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
