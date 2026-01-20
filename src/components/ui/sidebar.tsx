import { NavLink, useNavigate } from "react-router-dom";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DarkModeToggle from "@/components/dark-mode-toggle";
import { useLoginState } from "@/hooks/use-login-state";
import { useGetUserMe } from "@/hooks/use-user";
import { LayoutDashboard, LogOut, Sparkles, FileText, Layers, Briefcase, BarChart3, Images, Handshake, Award, HelpCircle, Bell, UserPlus, BookOpen, Phone, Info, Users, User, ChevronsUpDown, Mail, Settings } from "lucide-react";
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
			{
				to: "/circular",
				label: "Blog",
				icon: FileText,
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
				to: "/user",
				label: "Kullanıcılar",
				icon: Users,
				end: false,
			},
			{
				to: "/official-page",
				label: "Resmi Sayfa",
				icon: FileText,
				end: false,
			},
			{
				to: "/settings",
				label: "Ayarlar",
				icon: Settings,
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
	const { data: userMe, isLoading: userMeLoading } = useGetUserMe();

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
				"fixed left-0 top-0 z-40 h-screen border-r border-seyfhi-accent bg-seyfhi-primary gradient-sidebar transition-all duration-300 ease-in-out flex flex-col",
				isOpen ? "w-64" : "w-0 lg:w-16",
				isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
			)}
		>
			{/* Header */}
			<div className={cn(
				"flex h-20 items-center border-b border-seyfhi-accent/20 transition-all duration-300 shrink-0",
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

			{/* Navigation - Scrollable */}
			<nav className={cn(
				"flex flex-col gap-4 flex-1 overflow-y-auto overflow-x-hidden transition-all duration-300",
				isOpen ? "p-4" : "p-2 lg:p-2",
				"scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent hover:scrollbar-thumb-white/30"
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

			{/* Footer with user profile and logout */}
			<div className={cn(
				"border-t border-seyfhi-accent/20 transition-all duration-300 bg-seyfhi-primary shrink-0",
				isOpen ? "p-4" : "p-2 lg:p-2"
			)}>
				{isOpen ? (
					<div className="space-y-2">
						{/* User Profile - Enhanced Design */}
						{userMe && (
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<button
										className={cn(
											"w-full flex items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-medium transition-all duration-300 group",
											"bg-slate-800/60 hover:bg-slate-800/80 text-white",
											"border border-slate-700/50 hover:border-slate-600/70",
											"backdrop-blur-md shadow-lg hover:shadow-xl",
											"hover:scale-[1.02] active:scale-[0.98]"
										)}
									>
										{/* Avatar - Enhanced */}
										<div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-slate-600 via-slate-500 to-slate-600 flex items-center justify-center shrink-0 border-2 border-slate-500/50 shadow-inner group-hover:border-slate-400/70 transition-all duration-300 group-hover:scale-105">
											<User className="h-6 w-6 text-white/90 drop-shadow-sm" strokeWidth={2} />
											{/* Subtle inner glow */}
											<div className="absolute inset-0 rounded-full bg-white/5 group-hover:bg-white/10 transition-colors duration-300" />
										</div>
										
										{/* User Info - Enhanced */}
										<div className="flex-1 text-left min-w-0">
											<div className="text-sm font-bold text-white truncate leading-tight mb-1.5 drop-shadow-sm">
												{userMe.firstName} {userMe.lastName}
											</div>
											<div className="text-xs text-slate-300 truncate flex items-center gap-1.5 font-medium">
												<Mail className="h-3.5 w-3.5 text-slate-400 shrink-0" strokeWidth={2} />
												<span className="truncate">{userMe.email}</span>
											</div>
										</div>
										
										{/* Chevron Icon - Enhanced */}
										<ChevronsUpDown className="h-4 w-4 text-slate-400 shrink-0 group-hover:text-slate-300 transition-all duration-300 group-hover:scale-110" strokeWidth={2} />
									</button>
								</DropdownMenuTrigger>
								<DropdownMenuContent 
									align="end" 
									side="top"
									sideOffset={8}
									className="w-72 bg-white dark:bg-[#1f2937] border border-gray-200/80 dark:border-gray-700/80 shadow-2xl rounded-xl overflow-hidden backdrop-blur-sm"
								>
									<div className="px-4 py-3.5 bg-gradient-to-r from-gray-50 to-gray-100/50 dark:from-gray-900/80 dark:to-gray-800/80 border-b border-gray-200/80 dark:border-gray-700/80">
										<div className="flex items-center gap-2">
											<Mail className="h-3.5 w-3.5 text-gray-400 dark:text-gray-500 shrink-0" />
											<div className="text-sm text-gray-900 dark:text-gray-100 font-medium truncate">
												{userMe.email}
											</div>
										</div>
									</div>
									<div className="p-1.5">
										<DropdownMenuItem
											onClick={() => {
												if (userMe) {
													navigate(`/user/${userMe.id}`);
												}
												if (window.innerWidth < 1024) {
													onToggle();
												}
											}}
											className="cursor-pointer rounded-lg px-3 py-2.5 text-sm font-medium focus:bg-gray-100 dark:focus:bg-gray-800/50 transition-colors duration-150"
										>
											<User className="h-4 w-4 mr-3 text-gray-600 dark:text-gray-400 shrink-0" />
											<span className="text-gray-900 dark:text-gray-100">Profil Görüntüle</span>
										</DropdownMenuItem>
										<DropdownMenuSeparator className="my-1.5 bg-gray-200 dark:bg-gray-700" />
										<DropdownMenuItem
											onClick={handleLogout}
											disabled={!isActionable || isLoading}
											className="cursor-pointer rounded-lg px-3 py-2.5 text-sm font-medium focus:bg-red-50 dark:focus:bg-red-950/30 text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
										>
											<LogOut className="h-4 w-4 mr-3 shrink-0" />
											<span>{isLoading ? "Çıkış yapılıyor..." : "Çıkış Yap"}</span>
										</DropdownMenuItem>
									</div>
								</DropdownMenuContent>
							</DropdownMenu>
						)}
						{userMeLoading && (
							<div className="w-full flex items-center gap-3 rounded-xl px-3.5 py-3 bg-white/5 border border-white/10">
								<div className="w-11 h-11 rounded-full bg-white/10 animate-pulse border border-white/20" />
								<div className="flex-1 space-y-2">
									<div className="h-3.5 w-28 bg-white/10 rounded animate-pulse" />
									<div className="h-2.5 w-36 bg-white/10 rounded animate-pulse" />
								</div>
							</div>
						)}
					</div>
				) : (
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<button
								className="w-full h-11 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 text-white hover:text-white transition-all duration-200 border border-white/10 hover:border-white/25 hover:shadow-lg hover:shadow-white/5 backdrop-blur-sm group"
								title={userMe ? `${userMe.firstName} ${userMe.lastName}` : "Kullanıcı"}
							>
								{userMe ? (
									<div className="w-9 h-9 rounded-full bg-gradient-to-br from-white/25 via-white/15 to-white/5 flex items-center justify-center border border-white/25 shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all duration-200">
										<User className="h-4.5 w-4.5 text-white drop-shadow-sm" />
									</div>
								) : (
									<User className="h-4 w-4" />
								)}
							</button>
						</DropdownMenuTrigger>
						<DropdownMenuContent 
							align="end" 
							side="right"
							sideOffset={12}
							className="w-72 bg-white dark:bg-[#1f2937] border border-gray-200/80 dark:border-gray-700/80 shadow-2xl rounded-xl overflow-hidden backdrop-blur-sm"
						>
							{userMe && (
								<>
									<div className="px-4 py-3.5 bg-gradient-to-r from-gray-50 to-gray-100/50 dark:from-gray-900/80 dark:to-gray-800/80 border-b border-gray-200/80 dark:border-gray-700/80">
										<div className="flex items-center gap-2">
											<Mail className="h-3.5 w-3.5 text-gray-400 dark:text-gray-500 shrink-0" />
											<div className="text-sm text-gray-900 dark:text-gray-100 font-medium truncate">
												{userMe.email}
											</div>
										</div>
									</div>
									<div className="p-1.5">
										<DropdownMenuItem
											onClick={() => {
												if (userMe) {
													navigate(`/user/${userMe.id}`);
												}
											}}
											className="cursor-pointer rounded-lg px-3 py-2.5 text-sm font-medium focus:bg-gray-100 dark:focus:bg-gray-800/50 transition-colors duration-150"
										>
											<User className="h-4 w-4 mr-3 text-gray-600 dark:text-gray-400 shrink-0" />
											<span className="text-gray-900 dark:text-gray-100">Profil Görüntüle</span>
										</DropdownMenuItem>
										<DropdownMenuSeparator className="my-1.5 bg-gray-200 dark:bg-gray-700" />
										<DropdownMenuItem
											onClick={handleLogout}
											disabled={!isActionable || isLoading}
											className="cursor-pointer rounded-lg px-3 py-2.5 text-sm font-medium focus:bg-red-50 dark:focus:bg-red-950/30 text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
										>
											<LogOut className="h-4 w-4 mr-3 shrink-0" />
											<span>{isLoading ? "Çıkış yapılıyor..." : "Çıkış Yap"}</span>
										</DropdownMenuItem>
									</div>
								</>
							)}
							{!userMe && (
								<div className="p-1.5">
									<DropdownMenuItem
										onClick={handleLogout}
										disabled={!isActionable || isLoading}
										className="cursor-pointer rounded-lg px-3 py-2.5 text-sm font-medium focus:bg-red-50 dark:focus:bg-red-950/30 text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
									>
										<LogOut className="h-4 w-4 mr-3 shrink-0" />
										<span>{isLoading ? "Çıkış yapılıyor..." : "Çıkış Yap"}</span>
									</DropdownMenuItem>
								</div>
							)}
						</DropdownMenuContent>
					</DropdownMenu>
				)}
			</div>
		</aside>
	);
}
