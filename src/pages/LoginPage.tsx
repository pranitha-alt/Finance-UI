import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFinance } from "@/context/FinanceContext";
import { Lock, Mail, ArrowLeft, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const LoginPage = () => {
  const navigate = useNavigate();
  const { setIsLoggedIn } = useFinance();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      setIsLoggedIn(true);
      toast({ title: "Welcome back, Admin!", description: "You now have full access to manage transactions." });
      navigate("/dashboard");
    } else {
      toast({ title: "Please fill in all fields", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute w-[500px] h-[500px] rounded-full opacity-10 gradient-primary blur-3xl -top-40 -right-40 animate-pulse" />

      <div className="w-full max-w-md" style={{ animation: "scaleIn 0.5s ease-out" }}>
        <button onClick={() => navigate("/")} className="flex items-center gap-2 text-hero-foreground/50 hover:text-hero-foreground transition-colors mb-8 text-sm">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </button>

        <div className="rounded-2xl glass-card p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-heading font-bold text-hero-foreground">FinVista Admin</span>
          </div>

          <h2 className="text-2xl font-heading font-bold text-hero-foreground mb-2">Sign In</h2>
          <p className="text-hero-foreground/50 text-sm mb-8">Enter any credentials to access the admin dashboard</p>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-hero-foreground/30" />
              <Input
                type="email"
                placeholder="admin@finvista.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="pl-11 bg-hero-foreground/5 border-hero-foreground/10 text-hero-foreground placeholder:text-hero-foreground/30 h-12 rounded-xl"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-hero-foreground/30" />
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="pl-11 bg-hero-foreground/5 border-hero-foreground/10 text-hero-foreground placeholder:text-hero-foreground/30 h-12 rounded-xl"
              />
            </div>
            <Button type="submit" className="w-full h-12 rounded-xl gradient-primary text-primary-foreground font-semibold text-base hover:opacity-90 transition-opacity">
              Sign In
            </Button>
          </form>

          <p className="text-hero-foreground/30 text-xs text-center mt-6">
            This is a demo — no real authentication is performed.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
