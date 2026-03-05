import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

const LoginScreen = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { signIn } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error } = await signIn(email, password);

        if (error) {
            setError(error.message);
            setLoading(false);
            return;
        }

        // Auth state change in AuthContext handles redirect
        // but add fallback:
        navigate("/");
    };

    const handleGoogleLogin = async () => {
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: window.location.origin
                }
            });
            if (error) throw error;
        } catch (err: any) {
            toast({
                variant: 'destructive',
                title: 'Google Login',
                description: err.message || "Failed to initialize Google login.",
            });
        }
    };

    return (
        <div className="flex min-h-screen flex-col items-center bg-white px-5 pt-[60px]">
            {/* Logo */}
            <div className="mb-12 flex flex-col items-center gap-2">
                <span className="text-4xl">🔥</span>
                <h1 className="font-display text-[28px] font-bold text-foreground">Calo Cal</h1>
                <p className="font-body text-base text-muted-foreground">Welcome back!</p>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="flex w-full flex-col gap-4">
                {/* Email */}
                <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Email</label>
                    <input
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full rounded-xl border border-[#E5E7EB] bg-[#F9F9F9] px-4 py-3 font-body outline-none transition-all placeholder:text-muted-foreground focus:border-[#F5C518] focus:ring-4 focus:ring-yellow-100/50"
                        required
                    />
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Password</label>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full rounded-xl border border-[#E5E7EB] bg-[#F9F9F9] px-4 py-3 font-body outline-none transition-all placeholder:text-muted-foreground focus:border-[#F5C518] focus:ring-4 focus:ring-yellow-100/50"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>
                </div>

                {/* Error Banner */}
                {error && (
                    <div className="rounded-xl bg-red-50 p-3 text-sm text-red-600">
                        {error}
                    </div>
                )}

                <div className="h-4" />

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={loading}
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-[#F5C518] py-4 font-display font-bold text-foreground transition-transform active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100"
                >
                    {loading ? (
                        <>
                            <Loader2 className="h-5 w-5 animate-spin" />
                            Signing in...
                        </>
                    ) : (
                        "Sign in →"
                    )}
                </button>
            </form>

            <div className="my-8 flex w-full items-center gap-4">
                <div className="h-px flex-1 bg-[#E5E7EB]" />
                <span className="text-sm text-muted-foreground">— or —</span>
                <div className="h-px flex-1 bg-[#E5E7EB]" />
            </div>

            {/* Google Button */}
            <button
                type="button"
                onClick={handleGoogleLogin}
                className="flex w-full items-center justify-center gap-3 rounded-full border border-[#E5E7EB] bg-white py-3.5 font-body text-[15px] font-medium text-foreground transition-colors hover:bg-gray-50"
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Continue with Google
            </button>

            <div className="mt-8 text-sm text-foreground">
                Don't have an account?{" "}
                <Link to="/signup" className="font-medium text-[#F5C518] underline decoration-2 underline-offset-4 hover:text-[#dcb015]">
                    Sign up
                </Link>
            </div>
        </div>
    );
};

export default LoginScreen;
