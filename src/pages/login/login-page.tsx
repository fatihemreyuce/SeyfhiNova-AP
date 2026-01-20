import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLoginState } from "@/hooks/use-login-state";
import type { LoginRequest } from "@/types/auth.types";
import { toast } from "sonner";

export default function LoginPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState("");

	const { login, isLoading, isLoggedIn } = useLoginState();
	const navigate = useNavigate();

	useEffect(() => {
		if (isLoggedIn) {
			navigate("/");
		}
	}, [isLoggedIn, navigate]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setIsSubmitting(true);

		try {
			const loginRequest: LoginRequest = {
				email,
				password,
			};

			await login(loginRequest);
			navigate("/");
		} catch (err: any) {
			toast.error("Geçersiz e-posta veya şifre. Lütfen tekrar deneyin.");
		} finally {
			setIsSubmitting(false);
		}
	};

	const isFormDisabled = isLoading || isSubmitting;

	return (
		<div className="min-h-screen w-full gradient-login flex items-center justify-center p-4">
			{/* Login Form Container */}
			<div className="w-full max-w-md">
				{/* Logo and Brand */}
				<div className="flex items-center gap-3 mb-10 animate-in fade-in slide-in-from-top-4 duration-500">
					<div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/70 shadow-lg shadow-primary/25 backdrop-blur-sm">
						<Sparkles className="h-6 w-6 text-primary-foreground" />
					</div>
					<div className="flex flex-col">
						<span className="text-2xl font-bold tracking-tight text-foreground">Seyfh</span>
						<span className="text-sm text-muted-foreground font-medium">Yatırım</span>
					</div>
				</div>

				{/* Welcome Section */}
				<div className="mb-10 animate-in fade-in slide-in-from-top-4 duration-500 delay-100">
					<h1 className="text-4xl font-bold tracking-tight text-foreground mb-3">
						Hoş geldiniz
					</h1>
					<p className="text-base text-muted-foreground leading-relaxed">
						Seyfh Yatırım hesabınıza giriş yapın
					</p>
				</div>

				{/* Login Form Card */}
				<div className="bg-card/80 backdrop-blur-md rounded-2xl border border-border/50 shadow-xl shadow-black/5 p-8 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
					<form onSubmit={handleSubmit} className="space-y-6">
						{/* Email Field */}
						<div className="space-y-2.5">
							<Label 
								htmlFor="email" 
								className="text-sm font-semibold text-foreground"
							>
								E-posta
							</Label>
							<Input
								id="email"
								type="email"
								placeholder="ornek@email.com"
								autoComplete="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
								disabled={isFormDisabled}
								className="h-12 text-base border-border/60 bg-background/50 focus:bg-background transition-colors placeholder:text-muted-foreground/60"
							/>
						</div>

						{/* Password Field */}
						<div className="space-y-2.5">
							<Label 
								htmlFor="password" 
								className="text-sm font-semibold text-foreground"
							>
								Şifre
							</Label>
							<div className="relative">
								<Input
									id="password"
									type={showPassword ? "text" : "password"}
									placeholder="••••••••"
									autoComplete="current-password"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									required
									disabled={isFormDisabled}
									className="h-12 pr-12 text-base border-border/60 bg-background/50 focus:bg-background transition-colors placeholder:text-muted-foreground/60"
								/>
								<button
									type="button"
									onClick={() => setShowPassword(!showPassword)}
									className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors duration-200 p-1.5 rounded-md hover:bg-accent/50"
									disabled={isFormDisabled}
									aria-label={showPassword ? "Şifreyi gizle" : "Şifreyi göster"}
								>
									{showPassword ? (
										<EyeOff className="h-5 w-5" />
									) : (
										<Eye className="h-5 w-5" />
									)}
								</button>
							</div>
						</div>

						{error && (
							<div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 animate-in fade-in duration-200">
								<p className="text-sm text-destructive font-medium">{error}</p>
							</div>
						)}

						{/* Login Button */}
						<Button 
							type="submit" 
							className="w-full h-12 text-base font-semibold shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-200 mt-8" 
							disabled={isFormDisabled} 
							aria-busy={isFormDisabled}
						>
							{isFormDisabled ? (
								<span className="flex items-center gap-2">
									<svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
										<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
										<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
									</svg>
									Giriş yapılıyor...
								</span>
							) : (
								"Giriş Yap"
							)}
						</Button>
					</form>

					{/* Footer */}
					<div className="mt-8 pt-6 border-t border-border/40">
						<p className="text-xs text-center text-muted-foreground leading-relaxed">
							Devam ederek,{" "}
							<a 
								href="#" 
								className="text-primary hover:underline font-medium transition-colors duration-200 hover:text-primary/80"
							>
								Kullanım Koşulları
							</a>
							{" "}ve{" "}
							<a 
								href="#" 
								className="text-primary hover:underline font-medium transition-colors duration-200 hover:text-primary/80"
							>
								Gizlilik Politikası
							</a>
							{" "}mızı kabul etmiş olursunuz.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
