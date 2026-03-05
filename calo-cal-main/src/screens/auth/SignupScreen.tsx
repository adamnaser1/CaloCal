import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Eye, EyeOff, Loader2, Check } from "lucide-react";

interface PasswordStrength {
    score: 0 | 1 | 2 | 3 | 4;
    label: string;
    color: string;
}

const SignupScreen = () => {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [agreeTerms, setAgreeTerms] = useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const { signUp } = useAuth();
    const navigate = useNavigate();

    // Password strength logic
    const getPasswordStrength = (pass: string): PasswordStrength => {
        if (pass.length === 0) return { score: 0, label: "Weak", color: "bg-gray-200" };
        if (pass.length <= 2) return { score: 0, label: "Weak", color: "bg-gray-200" };
        if (pass.length <= 5) return { score: 1, label: "Weak", color: "bg-red-500" };
        if (pass.length <= 7) return { score: 2, label: "Fair", color: "bg-orange-500" };

        const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(pass);
        const hasNumber = /\d/.test(pass);

        if (hasSpecial || hasNumber) {
            return { score: 4, label: "Strong", color: "bg-green-500" };
        }

        return { score: 3, label: "Good", color: "bg-yellow-500" };
    };

    const strength = getPasswordStrength(password);

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            setLoading(false);
            return;
        }

        const { error } = await signUp(email, password, fullName);

        if (error) {
            setError(error.message);
            setLoading(false);
            return;
        }

        setSuccess(true);
        setTimeout(() => navigate("/welcome"), 2000);
    };

    if (success) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center bg-white px-5 text-center">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                    <Check className="h-8 w-8 text-green-600" />
                </div>
                <h1 className="mb-2 font-display text-2xl font-bold text-foreground">Account created!</h1>
                <p className="font-body text-sm text-muted-foreground">
                    Welcome to Calo Cal — let's set up your profile
                </p>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen flex-col items-center bg-white px-5 pt-[60px] pb-8">
            {/* Logo */}
            <div className="mb-12 flex flex-col items-center gap-2">
                <span className="text-4xl">🔥</span>
                <h1 className="font-display text-[28px] font-bold text-foreground">Calo Cal</h1>
                <p className="font-body text-base text-muted-foreground">Create your account</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSignup} className="flex w-full flex-col gap-4">
                {/* Full Name */}
                <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Full name</label>
                    <input
                        type="text"
                        placeholder="Aymen Trabelsi"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full rounded-xl border border-[#E5E7EB] bg-[#F9F9F9] px-4 py-3 font-body outline-none transition-all placeholder:text-muted-foreground focus:border-[#F5C518] focus:ring-4 focus:ring-yellow-100/50"
                        required
                    />
                </div>

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
                            placeholder="Min. 8 characters"
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

                    {/* Strength Indicator */}
                    <div className="mt-2 flex flex-col gap-1">
                        <div className="flex gap-1">
                            {[1, 2, 3, 4].map((step) => (
                                <div
                                    key={step}
                                    className={`h-1 flex-1 rounded-full transition-colors ${step <= strength.score ? strength.color : "bg-gray-100"
                                        }`}
                                />
                            ))}
                        </div>
                        <span className="text-right text-xs font-medium text-muted-foreground">
                            {strength.label}
                        </span>
                    </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Confirm password</label>
                    <input
                        type="password"
                        placeholder="Repeat password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full rounded-xl border border-[#E5E7EB] bg-[#F9F9F9] px-4 py-3 font-body outline-none transition-all placeholder:text-muted-foreground focus:border-[#F5C518] focus:ring-4 focus:ring-yellow-100/50"
                        required
                    />
                    {password !== confirmPassword && confirmPassword && (
                        <p className="text-xs text-red-500">Passwords don't match</p>
                    )}
                </div>

                {/* Terms */}
                <div className="flex items-start gap-3 px-1">
                    <input
                        type="checkbox"
                        id="terms"
                        checked={agreeTerms}
                        onChange={(e) => setAgreeTerms(e.target.checked)}
                        className="mt-1 h-4 w-4 rounded border-gray-300 text-[#F5C518] focus:ring-[#F5C518]"
                    />
                    <label htmlFor="terms" className="text-xs text-muted-foreground leading-relaxed">
                        I agree to the <span className="text-[#F5C518] underline decoration-yellow-300">Terms of Service</span> and <span className="text-[#F5C518] underline decoration-yellow-300">Privacy Policy</span>
                    </label>
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
                    disabled={loading || !agreeTerms || !fullName || !email || !password || password !== confirmPassword}
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-[#F5C518] py-4 font-display font-bold text-foreground transition-transform active:scale-[0.98] disabled:opacity-40 disabled:active:scale-100"
                >
                    {loading ? (
                        <>
                            <Loader2 className="h-5 w-5 animate-spin" />
                            Creating account...
                        </>
                    ) : (
                        "Create account →"
                    )}
                </button>
            </form>

            <div className="mt-8 text-sm text-foreground">
                Already have an account?{" "}
                <Link to="/login" className="font-medium text-[#F5C518] underline decoration-2 underline-offset-4 hover:text-[#dcb015]">
                    Sign in
                </Link>
            </div>
        </div>
    );
};

export default SignupScreen;
