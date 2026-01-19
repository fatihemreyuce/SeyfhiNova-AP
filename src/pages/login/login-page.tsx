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
		<div className="min-h-screen w-full gradient-login flex items-center justify-center">
			{/* Login Form */}
			<div className="w-full max-w-md px-6 py-12">
				<div className="w-full max-w-md">
					{/* Logo and Brand */}
					<div className="flex items-center gap-3 mb-8">
						<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/60 shadow-lg shadow-primary/20">
							<Sparkles className="h-5 w-5 text-primary-foreground" />
						</div>
						<div className="flex flex-col">
							<span className="text-xl font-bold tracking-tight text-foreground">Seyfh</span>
							<span className="text-xs text-muted-foreground font-medium">Yatırım</span>
						</div>
					</div>

					{/* Welcome Section */}
					<div className="mb-8">
						<h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">
							Hoş geldiniz
						</h1>
						<p className="text-sm text-muted-foreground">
							Seyfh Yatırım hesabınıza giriş yapın
						</p>
					</div>

					{/* Login Form */}
					<form onSubmit={handleSubmit} className="space-y-6">
						{/* Email Field */}
						<div className="space-y-2">
							<Label htmlFor="email" className="text-sm font-medium text-foreground">
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
								className="h-11 border-border/60"
							/>
						</div>

						{/* Password Field */}
						<div className="space-y-2">
							<Label htmlFor="password" className="text-sm font-medium text-foreground">
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
									className="pl-10 pr-10 h-11 border-border/60"
								/>
								<button
									type="button"
									onClick={() => setShowPassword(!showPassword)}
									className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
									disabled={isFormDisabled}
									aria-label={showPassword ? "Şifreyi gizle" : "Şifreyi göster"}
								>
									{showPassword ? (
										<EyeOff className="h-4 w-4" />
									) : (
										<Eye className="h-4 w-4" />
									)}
								</button>
							</div>
						</div>

						{error && (
							<p className="text-sm text-destructive mt-1">{error}</p>
						)}

						{/* Login Button */}
						<Button 
							type="submit" 
							className="w-full h-11 text-base font-semibold" 
							disabled={isFormDisabled} 
							aria-busy={isFormDisabled}
						>
							{isFormDisabled ? "Giriş yapılıyor..." : "Giriş Yap"}
						</Button>
					</form>

					{/* Footer */}
					<div className="mt-8 pt-6 border-t border-border/60">
						<p className="text-xs text-center text-muted-foreground">
							Devam ederek,{" "}
							<a href="#" className="text-primary hover:underline">Kullanım Koşulları</a>
							{" "}ve{" "}
							<a href="#" className="text-primary hover:underline">Gizlilik Politikası</a>
							{" "}mızı kabul etmiş olursunuz.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
