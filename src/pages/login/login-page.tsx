import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
	Eye, 
	EyeOff, 
	Sparkles, 
	Mail, 
	Lock, 
	ArrowRight, 
	Shield, 
	BarChart3, 
	Headphones 
} from "lucide-react";
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
		<div className="min-h-screen w-full gradient-login flex items-center justify-center p-4 lg:p-8">
			{/* Main Container - Rounded Card with Shadow */}
			<div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row rounded-3xl overflow-hidden shadow-2xl border border-white/20 backdrop-blur-sm">
				{/* Left Panel - Dark Theme (Information) */}
				<div className="w-full lg:w-1/2 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex flex-col justify-between p-8 lg:p-16 relative overflow-hidden min-h-[600px] lg:min-h-[700px]">
					{/* Decorative Background Elements - Enhanced */}
					<div className="absolute inset-0">
						<div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
						<div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
						<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-3xl"></div>
					</div>
					
					{/* Animated Grid Pattern */}
					<div className="absolute inset-0 opacity-5">
						<div className="absolute inset-0" style={{
							backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
							                  linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
							backgroundSize: '50px 50px'
						}}></div>
					</div>

					<div className="relative z-10 flex flex-col h-full">
						{/* Logo and Brand - Enhanced */}
						<div className="flex items-center gap-4 mb-16 animate-in fade-in slide-in-from-left duration-700">
							<div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-md border border-white/30 shadow-xl hover:scale-105 transition-transform duration-300">
								<Sparkles className="h-7 w-7 text-white" strokeWidth={2.5} />
							</div>
							<div className="flex flex-col">
								<span className="text-3xl font-bold tracking-tight text-white drop-shadow-lg">Seyfh</span>
								<span className="text-sm text-white/80 font-semibold tracking-wide">Yatırım</span>
							</div>
						</div>

						{/* Welcome Section - Enhanced */}
						<div className="mb-16 animate-in fade-in slide-in-from-left duration-700 delay-100">
							<h1 className="text-6xl font-bold tracking-tight text-white mb-6 leading-tight drop-shadow-lg">
								Hoş geldiniz
							</h1>
							<p className="text-xl text-white/90 leading-relaxed max-w-lg font-light">
								Seyfh Yatırım yönetim paneline giriş yaparak işlemlerinizi kolayca yönetin.
							</p>
						</div>

						{/* Feature Cards - Enhanced */}
						<div className="space-y-5 flex-1 animate-in fade-in slide-in-from-left duration-700 delay-200">
							{/* Güvenli Giriş */}
							<div className="group flex items-start gap-5 p-5 rounded-2xl bg-white/5 backdrop-blur-md border border-white/20 hover:bg-white/10 hover:border-white/30 hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1">
								<div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-white/20 to-white/10 flex items-center justify-center border border-white/30 group-hover:scale-110 transition-transform duration-300 shadow-lg">
									<Shield className="h-7 w-7 text-white" strokeWidth={2.5} />
								</div>
								<div className="flex-1">
									<h3 className="text-xl font-bold text-white mb-2 group-hover:text-white transition-colors">Güvenli Giriş</h3>
									<p className="text-base text-white/75 leading-relaxed font-light">
										Verileriniz en üst düzey güvenlik standartlarıyla korunur.
									</p>
								</div>
							</div>

							{/* Kolay Yönetim */}
							<div className="group flex items-start gap-5 p-5 rounded-2xl bg-white/5 backdrop-blur-md border border-white/20 hover:bg-white/10 hover:border-white/30 hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1">
								<div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-white/20 to-white/10 flex items-center justify-center border border-white/30 group-hover:scale-110 transition-transform duration-300 shadow-lg">
									<BarChart3 className="h-7 w-7 text-white" strokeWidth={2.5} />
								</div>
								<div className="flex-1">
									<h3 className="text-xl font-bold text-white mb-2 group-hover:text-white transition-colors">Kolay Yönetim</h3>
									<p className="text-base text-white/75 leading-relaxed font-light">
										Tüm işlemlerinizi tek bir yerden yönetin.
									</p>
								</div>
							</div>

							{/* 7/24 Destek */}
							<div className="group flex items-start gap-5 p-5 rounded-2xl bg-white/5 backdrop-blur-md border border-white/20 hover:bg-white/10 hover:border-white/30 hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1">
								<div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-white/20 to-white/10 flex items-center justify-center border border-white/30 group-hover:scale-110 transition-transform duration-300 shadow-lg">
									<Headphones className="h-7 w-7 text-white" strokeWidth={2.5} />
								</div>
								<div className="flex-1">
									<h3 className="text-xl font-bold text-white mb-2 group-hover:text-white transition-colors">7/24 Destek</h3>
									<p className="text-base text-white/75 leading-relaxed font-light">
										Her zaman yanınızdayız, sorularınız için destek ekibimiz hazır.
									</p>
								</div>
							</div>
						</div>

						{/* Copyright - Enhanced */}
						<div className="mt-12 pt-8 border-t border-white/10 animate-in fade-in duration-700 delay-300">
							<p className="text-sm text-white/50 font-light">
								© 2024 Seyfh Yatırım. Tüm hakları saklıdır.
							</p>
						</div>
					</div>
				</div>

				{/* Right Panel - Light Theme (Login Form) */}
				<div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-8 lg:p-16 min-h-[600px] lg:min-h-[700px] relative">
					{/* Subtle Background Pattern */}
					<div className="absolute inset-0 opacity-[0.02]">
						<div className="absolute inset-0" style={{
							backgroundImage: `radial-gradient(circle at 2px 2px, rgb(0,0,0) 1px, transparent 0)`,
							backgroundSize: '40px 40px'
						}}></div>
					</div>
					
					<div className="w-full max-w-md relative z-10 animate-in fade-in slide-in-from-right duration-700">
						{/* Welcome Section - Enhanced */}
						<div className="mb-10">
							<h1 className="text-5xl font-bold tracking-tight text-slate-900 mb-3 leading-tight">
								Hoş geldiniz
							</h1>
							<p className="text-lg text-slate-600 leading-relaxed font-light">
								Hesabınıza giriş yapmak için bilgilerinizi girin
							</p>
						</div>

						{/* Login Form - Enhanced */}
						<form onSubmit={handleSubmit} className="space-y-6">
							{/* Email Field - Enhanced */}
							<div className="space-y-3">
								<Label 
									htmlFor="email" 
									className="text-sm font-semibold text-slate-700 block"
								>
									E-posta Adresi
								</Label>
								<div className="relative group">
									<Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-slate-600 transition-colors duration-200" />
									<Input
										id="email"
										type="email"
										placeholder="ornek@email.com"
										autoComplete="email"
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										required
										disabled={isFormDisabled}
										className="h-14 pl-12 pr-4 text-base border-2 border-slate-200 bg-slate-50/50 focus:bg-white focus:border-slate-400 focus:ring-2 focus:ring-slate-200/50 transition-all duration-200 placeholder:text-slate-400 rounded-xl shadow-sm hover:border-slate-300"
									/>
								</div>
							</div>

							{/* Password Field - Enhanced */}
							<div className="space-y-3">
								<Label 
									htmlFor="password" 
									className="text-sm font-semibold text-slate-700 block"
								>
									Şifre
								</Label>
								<div className="relative group">
									<Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-slate-600 transition-colors duration-200" />
									<Input
										id="password"
										type={showPassword ? "text" : "password"}
										placeholder="••••••••"
										autoComplete="current-password"
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										required
										disabled={isFormDisabled}
										className="h-14 pl-12 pr-14 text-base border-2 border-slate-200 bg-slate-50/50 focus:bg-white focus:border-slate-400 focus:ring-2 focus:ring-slate-200/50 transition-all duration-200 placeholder:text-slate-400 rounded-xl shadow-sm hover:border-slate-300"
									/>
									<button
										type="button"
										onClick={() => setShowPassword(!showPassword)}
										className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-all duration-200 p-2 rounded-lg hover:bg-slate-100 active:scale-95"
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
								<div className="rounded-xl bg-red-50 border-2 border-red-200 p-4 animate-in fade-in slide-in-from-top duration-200">
									<p className="text-sm text-red-700 font-semibold">{error}</p>
								</div>
							)}

							{/* Login Button - Enhanced */}
							<Button 
								type="submit" 
								className="w-full h-14 text-base font-semibold bg-gradient-to-r from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 mt-8 group rounded-xl border-0 relative overflow-hidden" 
								disabled={isFormDisabled} 
								aria-busy={isFormDisabled}
							>
								{/* Shine effect */}
								<span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></span>
								
								{isFormDisabled ? (
									<span className="flex items-center justify-center gap-3 relative z-10">
										<svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
											<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
											<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
										</svg>
										Giriş yapılıyor...
									</span>
								) : (
									<span className="flex items-center justify-center gap-3 relative z-10">
										Giriş Yap
										<ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
									</span>
								)}
							</Button>
						</form>

						{/* Footer - Enhanced */}
						<div className="mt-10 pt-8 border-t border-slate-200">
							<p className="text-xs text-center text-slate-500 leading-relaxed font-light">
								Devam ederek,{" "}
								<a 
									href="#" 
									className="text-slate-900 hover:text-slate-700 hover:underline font-semibold transition-all duration-200 underline-offset-2"
								>
									Kullanım Koşulları
								</a>
								{" "}ve{" "}
								<a 
									href="#" 
									className="text-slate-900 hover:text-slate-700 hover:underline font-semibold transition-all duration-200 underline-offset-2"
								>
									Gizlilik Politikası
								</a>
								{" "}mızı kabul etmiş olursunuz.
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
