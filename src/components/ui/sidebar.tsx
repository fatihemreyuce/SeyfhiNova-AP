import { NavLink, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import DarkModeToggle from "@/components/dark-mode-toggle";
import { useLoginState } from "@/hooks/use-login-state";
import { LayoutDashboard, LogOut, Sparkles, FileText, Layers, Briefcase, BarChart3, Images, Handshake, Award, ScrollText, HelpCircle, Bell, UserPlus } from "lucide-react";

interface NavItem {
	to: string;
	label: string;
	icon: React.ComponentType<{ className?: string }>;
	end?: boolean;
}

const navigationItems: NavItem[] = [
	{
		to: "/",
		label: "Dashboard",
		icon: LayoutDashboard,
		end: true,
	},
	{
		to: "/home-page-about",
		label: "Ana Sayfa Hakkında",
		icon: FileText,
		end: false,
	},
	{
		to: "/service-category",
		label: "Servis Kategorileri",
		icon: Layers,
		end: false,
	},
	{
		to: "/service",
		label: "Servisler",
		icon: Briefcase,
		end: false,
	},
	{
		to: "/service-stats",
		label: "Servis İstatistikleri",
		icon: BarChart3,
		end: false,
	},
	{
		to: "/slider",
		label: "Sliderlar",
		icon: Images,
		end: false,
	},
	{
		to: "/partner",
		label: "Ortaklar",
		icon: Handshake,
		end: false,
	},
	{
		to: "/referance",
		label: "Referanslar",
		icon: Award,
		end: false,
	},
	{
		to: "/circular",
		label: "Genelgeler",
		icon: ScrollText,
		end: false,
	},
	{
		to: "/faq",
		label: "Sıkça Sorulan Sorular",
		icon: HelpCircle,
		end: false,
	},
	{
		to: "/notification",
		label: "Bildirimler",
		icon: Bell,
		end: false,
	},
	{
		to: "/notification-sub",
		label: "Bildirim Abonelikleri",
		icon: UserPlus,
		end: false,
	},
];

export default function Sidebar() {
	const { logout, isActionable, isLoading } = useLoginState();
	const navigate = useNavigate();

	const handleLogout = async () => {
		try {
			await logout();
			navigate("/login");
		} catch {
			// noop
		}
	};

	return (
		<aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-seyfhi-accent bg-seyfhi-primary">
			{/* Header */}
			<div className="flex h-20 items-center justify-between px-6 border-b border-seyfhi-accent/20">
				<div className="flex items-center gap-3">
					<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 backdrop-blur-sm shadow-lg">
						<Sparkles className="h-5 w-5 text-white" />
					</div>
					<div className="flex flex-col">
						<span className="text-base font-bold tracking-tight text-white">Seyfhi Nova</span>
						<span className="text-xs text-white/70 font-medium">Yatırım</span>
					</div>
				</div>
				<div className="flex items-center">
					<DarkModeToggle />
				</div>
			</div>

			{/* Navigation */}
			<nav className="flex flex-col gap-1.5 p-4 mt-2">
				{navigationItems.map((item) => {
					const Icon = item.icon;
					return (
						<NavLink
							key={item.to}
							to={item.to}
							end={item.end}
							className={({ isActive }) =>
								`group flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-all duration-200 ${
									isActive
										? "bg-white/15 text-white shadow-lg shadow-primary/20 scale-[1.02] border-l-4 border-white/40"
										: "text-white/70 hover:bg-white/10 hover:text-white hover:translate-x-1"
								}`
							}
						>
							<Icon className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
							<span>{item.label}</span>
						</NavLink>
					);
				})}
			</nav>

			{/* Spacer */}
			<div className="flex-1" />

			{/* Footer with logout */}
			<div className="absolute bottom-0 left-0 right-0 p-4 border-t border-seyfhi-accent/20">
				{/* Logout Button */}
				<Button
					variant="outline"
					onClick={handleLogout}
					disabled={!isActionable || isLoading}
					className="w-full justify-start gap-3 h-10 border-white/20 bg-white/5 hover:bg-white/10 text-white hover:text-white transition-all duration-200"
					aria-busy={isLoading}
				>
					<LogOut className="h-4 w-4" />
					{isLoading ? "Çıkış yapılıyor..." : "Çıkış Yap"}
				</Button>
			</div>
		</aside>
	);
}