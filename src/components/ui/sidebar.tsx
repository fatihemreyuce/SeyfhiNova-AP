import { NavLink, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import DarkModeToggle from "@/components/dark-mode-toggle";
import { useLoginState } from "@/hooks/use-login-state";
import { LayoutDashboard, LogOut, Sparkles, FileText, Layers, Briefcase, BarChart3, Images, Handshake, Award, ScrollText, HelpCircle, Bell, UserPlus, Building2, BookOpen, Phone, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
	to: string;
	label: string;
	icon: React.ComponentType<{ className?: string }>;
	end?: boolean;
}

interface NavCategory {
	title: string;
	items: NavItem[];
}

const navigationCategories: NavCategory[] = [
	{
		title: "GENEL BAKIŞ",
		items: [
			{
				to: "/",
				label: "Dashboard",
				icon: LayoutDashboard,
				end: true,
			},
		],
	},
	{
		title: "İÇERİK YÖNETİMİ",
		items: [
			{
				to: "/notification",
				label: "Bildirimler",
				icon: Bell,
				end: false,
			},
			{
				to: "/notification-sub",
				label: "Bildirim Aboneleri",
				icon: UserPlus,
				end: false,
			},
			{
				to: "/contact",
				label: "İletişim Mesajları",
				icon: Phone,
				end: false,
			},
			{
				to: "/useful-information",
				label: "Faydalı Bilgi",
				icon: BookOpen,
				end: false,
			},
			{
				to: "/faq",
				label: "SSS",
				icon: HelpCircle,
				end: false,
			},
		],
	},
	{
		title: "GÖRSEL İÇERİK",
		items: [
			{
				to: "/home-page-about",
				label: "Ana Sayfa Hakkında",
				icon: Info,
				end: false,
			},
			{
				to: "/partner",
				label: "Partner",
				icon: Handshake,
				end: false,
			},
			{
				to: "/slider",
				label: "Slider",
				icon: Images,
				end: false,
			},
			{
				to: "/referance",
				label: "Referanslar",
				icon: Award,
				end: false,
			},
		],
	},
	{
		title: "HİZMET YÖNETİMİ",
		items: [
			{
				to: "/service-category",
				label: "Hizmet Kategorisi",
				icon: Layers,
				end: false,
			},
			{
				to: "/service",
				label: "Hizmetler",
				icon: Briefcase,
				end: false,
			},
			{
				to: "/service-stats",
				label: "Hizmet İstatistikleri",
				icon: BarChart3,
				end: false,
			},
		],
	},
	{
		title: "SİSTEM",
		items: [
			{
				to: "/official-page",
				label: "Resmi Sayfa",
				icon: FileText,
				end: false,
			},
		],
	},
];

interface SidebarProps {
	isOpen: boolean;
	onToggle: () => void;
}

export default function Sidebar({ isOpen, onToggle }: SidebarProps) {
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
		<aside
			className={cn(
				"fixed left-0 top-0 z-40 h-screen border-r border-seyfhi-accent bg-seyfhi-primary gradient-sidebar transition-all duration-300 ease-in-out",
				isOpen ? "w-64" : "w-0 lg:w-16",
				isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
			)}
		>
			{/* Header */}
			<div className={cn(
				"flex h-20 items-center border-b border-seyfhi-accent/20 transition-all duration-300",
				isOpen ? "justify-between px-6" : "justify-center px-0"
			)}>
				<div className="flex items-center gap-3">
					<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 backdrop-blur-sm shadow-lg shrink-0">
						<Sparkles className="h-5 w-5 text-white" />
					</div>
					{isOpen && (
						<div className="flex flex-col">
							<span className="text-base font-bold tracking-tight text-white">Seyfhi</span>
							<span className="text-xs text-white/70 font-medium">Yatırım</span>
						</div>
					)}
				</div>
				{isOpen && (
					<div className="flex items-center">
						<DarkModeToggle />
					</div>
				)}
			</div>

			{/* Navigation */}
			<nav className={cn(
				"flex flex-col gap-4 mt-2 transition-all duration-300 overflow-y-auto",
				isOpen ? "p-4" : "p-2 lg:p-2"
			)}>
				<TooltipProvider delayDuration={200}>
					{navigationCategories.map((category) => (
						<div key={category.title} className="space-y-1.5">
							{isOpen && (
								<h3 className="px-3.5 text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">
									{category.title}
								</h3>
							)}
							{category.items.map((item) => {
								const Icon = item.icon;
								const navLink = (
									<NavLink
										to={item.to}
										end={item.end}
										onClick={() => {
											// Close sidebar on mobile when navigating
											if (window.innerWidth < 1024) {
												onToggle();
											}
										}}
										className={({ isActive }) =>
											cn(
												"group flex items-center gap-3 rounded-lg text-sm font-medium transition-all duration-200",
												isOpen ? "px-3.5 py-2.5" : "px-2 py-2.5 justify-center lg:justify-center",
												isActive
													? "bg-white/15 text-white shadow-lg shadow-primary/20 scale-[1.02] border-l-4 border-white/40"
													: "text-white/70 hover:bg-white/10 hover:text-white hover:translate-x-1"
											)
										}
									>
										<Icon className="h-4 w-4 transition-transform duration-200 group-hover:scale-110 shrink-0" />
										{isOpen && <span>{item.label}</span>}
									</NavLink>
								);

								if (!isOpen) {
									return (
										<Tooltip key={item.to}>
											<TooltipTrigger asChild>
												{navLink}
											</TooltipTrigger>
											<TooltipContent 
												side="right" 
												sideOffset={12}
												className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 shadow-xl backdrop-blur-sm px-3 py-2 text-sm font-medium rounded-md"
											>
												{item.label}
											</TooltipContent>
										</Tooltip>
									);
								}

								return <div key={item.to}>{navLink}</div>;
							})}
						</div>
					))}
				</TooltipProvider>
			</nav>

			{/* Spacer */}
			<div className="flex-1" />

			{/* Footer with logout */}
			<div className={cn(
				"absolute bottom-0 left-0 right-0 border-t border-seyfhi-accent/20 transition-all duration-300",
				isOpen ? "p-4" : "p-2 lg:p-2"
			)}>
				{isOpen ? (
					<Button
						variant="outline"
						onClick={handleLogout}
						disabled={!isActionable || isLoading}
						className="w-full justify-start gap-3 h-10 border-white/20 bg-white/5 hover:bg-white/10 text-white hover:text-white transition-all duration-200"
						aria-busy={isLoading}
					>
						<LogOut className="h-4 w-4 shrink-0" />
						{isLoading ? "Çıkış yapılıyor..." : "Çıkış Yap"}
					</Button>
				) : (
					<Button
						variant="outline"
						onClick={handleLogout}
						disabled={!isActionable || isLoading}
						title="Çıkış Yap"
						size="icon"
						className="w-full h-10 border-white/20 bg-white/5 hover:bg-white/10 text-white hover:text-white transition-all duration-200"
						aria-busy={isLoading}
					>
						<LogOut className="h-4 w-4" />
					</Button>
				)}
			</div>
		</aside>
	);
}
