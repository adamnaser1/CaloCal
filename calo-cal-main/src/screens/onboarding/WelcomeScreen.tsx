import { useNavigate } from "react-router-dom";

const WelcomeScreen = () => {
    const navigate = useNavigate();

    return (
        <div className="relative flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-[#F5C518] to-[#FDB366] px-5 pb-8 pt-12">
            {/* Brand */}
            <div className="flex flex-1 flex-col items-center justify-center gap-6">
                <div className="flex flex-col items-center gap-2">
                    <span className="text-7xl">🔥</span>
                    <h1 className="font-display text-[42px] font-bold text-white shadow-sm">Calo Cal</h1>
                </div>

                <p className="font-body text-base text-white/80">Snap it. Know it. Track it.</p>

                <div className="flex items-center gap-2 drop-shadow-md">
                    <span className="text-4xl">🥗</span>
                    <span className="text-4xl">🍗</span>
                    <span className="text-4xl">🥙</span>
                </div>
            </div>

            {/* Bottom Card */}
            <div className="w-full rounded-t-[28px] bg-white p-6 pb-8 shadow-xl">
                <div className="flex flex-col gap-6">
                    <div className="space-y-2 text-center">
                        <h2 className="font-display text-2xl font-bold text-foreground">Track smarter, eat better</h2>
                        <p className="font-body text-sm text-muted-foreground">
                            Powered by AI — built for Tunisian and North African cuisine
                        </p>
                    </div>

                    <div className="flex flex-col gap-3">
                        <button
                            onClick={() => navigate("/onboarding/goal")}
                            className="w-full rounded-full bg-[#F5C518] py-4 font-display font-bold text-foreground transition-transform active:scale-[0.98]"
                        >
                            Get Started →
                        </button>

                        <button
                            onClick={() => navigate("/login")}
                            className="w-full rounded-full py-4 font-body font-medium text-muted-foreground hover:bg-gray-50 transition-colors"
                        >
                            I already have an account
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WelcomeScreen;
