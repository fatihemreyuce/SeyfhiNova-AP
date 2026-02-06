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
import { LayoutDashboard, LogOut, Sparkles, FileText, Layers, Briefcase, BarChart3, Images, Handshake, Award, HelpCircle, Bell, UserPlus, BookOpen, Phone, Info, Users, User, ChevronsUpDown, Mail, Settings, Menu } from "lucide-react";
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
				"fixed left-0 top-0 z-40 h-screen border-r border-sidebar-border bg-sidebar gradient-sidebar transition-all duration-300 ease-in-out flex flex-col",
				isOpen ? "w-[280px] sm:w-64 max-w-[85vw]" : "w-0 lg:w-16",
				isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
				!isOpen && "overflow-hidden lg:overflow-visible"
			)}
		>
			{/* Header: logo + toggle (burger) sidebar içinde, ayrı üst bar yok */}
			<div className={cn(
				"flex h-16 sm:h-20 items-center border-b border-sidebar-border/60 transition-all duration-300 shrink-0",
				isOpen ? "justify-between px-4 sm:px-6" : "justify-center px-0 lg:px-0",
				!isOpen && "opacity-0 lg:opacity-100"
			)}>
				<button
					type="button"
					onClick={onToggle}
					className={cn(
						"flex items-center gap-2 sm:gap-3 rounded-lg transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-primary/50",
						!isOpen && "lg:cursor-pointer"
					)}
					aria-label={isOpen ? "Kenar çubuğunu kapat" : "Kenar çubuğunu aç"}
				>
					<div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground shadow-md shrink-0">
						<Sparkles className="h-4 w-4 sm:h-5 sm:w-5" />
					</div>
					{isOpen && (
						<div className="flex flex-col text-left">
							<span className="text-sm sm:text-base font-bold tracking-tight text-sidebar-foreground">Seyfhi</span>
							<span className="text-[10px] sm:text-xs text-sidebar-foreground/70 font-medium">Yatırım</span>
						</div>
					)}
				</button>
				{isOpen && (
					<div className="flex items-center gap-1">
						<DarkModeToggle />
						<button
							type="button"
							onClick={onToggle}
							className="flex h-9 w-9 items-center justify-center rounded-lg text-sidebar-foreground hover:bg-sidebar-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-primary/50"
							aria-label="Menüyü kapat"
						>
							<Menu className="h-5 w-5" />
						</button>
					</div>
				)}
			</div>

			{/* Navigation - Scrollable */}
			<nav className={cn(
				"flex flex-col gap-3 sm:gap-4 flex-1 overflow-y-auto overflow-x-hidden transition-all duration-300",
				isOpen ? "p-3 sm:p-4" : "p-0 lg:p-2",
				!isOpen && "lg:overflow-visible opacity-0 lg:opacity-100 pointer-events-none lg:pointer-events-auto",
				"scrollbar-thin scrollbar-thumb-sidebar-border scrollbar-track-transparent hover:scrollbar-thumb-sidebar-primary/50"
			)}>
				<TooltipProvider delayDuration={200}>
					{navigationCategories.map((category) => (
						<div key={category.title} className="space-y-1.5">
							{isOpen && (
								<h3 className="px-3 sm:px-3.5 text-[10px] sm:text-xs font-semibold text-sidebar-foreground/60 uppercase tracking-wider mb-2">
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
												"group flex items-center gap-2 sm:gap-3 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200",
												isOpen ? "px-3 sm:px-3.5 py-2 sm:py-2.5" : "px-2 py-2.5 justify-center lg:justify-center",
												isActive
													? "bg-sidebar-accent text-sidebar-foreground shadow-md shadow-sidebar-foreground/10 scale-[1.02] border-l-4 border-sidebar-primary font-semibold"
													: "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:translate-x-1",
												!isOpen && "lg:text-sidebar-foreground"
											)
										}
									>
										<Icon className={cn(
											"h-4 w-4 transition-transform duration-200 group-hover:scale-110 shrink-0",
											isOpen ? "text-current" : "lg:text-sidebar-foreground"
										)} />
										{isOpen && <span className="truncate min-w-0 text-sidebar-foreground">{item.label}</span>}
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
				"border-t border-sidebar-border/60 transition-all duration-300 bg-sidebar shrink-0",
				isOpen ? "p-3 sm:p-4" : "p-0 lg:p-2",
				!isOpen && "opacity-0 lg:opacity-100 pointer-events-none lg:pointer-events-auto"
			)}>
				{isOpen ? (
					<div className="space-y-2">
						{/* User Profile - Enhanced Design */}
						{userMe && (
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<button
										className={cn(
											"w-full flex items-center gap-2 sm:gap-3 rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3.5 text-xs sm:text-sm font-medium transition-all duration-300 group",
											"bg-sidebar-accent hover:bg-sidebar-accent/90 text-sidebar-foreground",
											"border border-sidebar-border hover:border-sidebar-primary/30",
											"shadow-sm hover:shadow-md",
											"hover:scale-[1.01] active:scale-[0.99]"
										)}
									>
										{/* Avatar - Enhanced */}
										<div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-sidebar-primary text-sidebar-primary-foreground flex items-center justify-center shrink-0 border-2 border-sidebar-border/50 shadow-sm group-hover:border-sidebar-primary transition-all duration-300 group-hover:scale-105">
											<User className="h-5 w-5 sm:h-6 sm:w-6 drop-shadow-sm" strokeWidth={2} />
										</div>
										
										{/* User Info - Enhanced */}
										<div className="flex-1 text-left min-w-0">
											<div className="text-xs sm:text-sm font-bold text-sidebar-foreground truncate leading-tight mb-1 sm:mb-1.5">
												{userMe.firstName} {userMe.lastName}
											</div>
											<div className="text-[10px] sm:text-xs text-sidebar-foreground/60 truncate flex items-center gap-1 sm:gap-1.5 font-medium">
												<Mail className="h-3 w-3 sm:h-3.5 sm:w-3.5 shrink-0" strokeWidth={2} />
												<span className="truncate">{userMe.email}</span>
											</div>
										</div>
										
										{/* Chevron Icon - Enhanced */}
										<ChevronsUpDown className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-sidebar-foreground/50 shrink-0 group-hover:text-sidebar-foreground transition-all duration-300 group-hover:scale-110" strokeWidth={2} />
									</button>
								</DropdownMenuTrigger>
								<DropdownMenuContent 
									align="end" 
									side="top"
									sideOffset={8}
									className="w-[calc(100vw-2rem)] sm:w-72 max-w-[280px] sm:max-w-none bg-white dark:bg-[#1f2937] border border-gray-200/80 dark:border-gray-700/80 shadow-2xl rounded-xl overflow-hidden backdrop-blur-sm"
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
							<div className="w-full flex items-center gap-2 sm:gap-3 rounded-xl px-3 sm:px-3.5 py-2.5 sm:py-3 bg-sidebar-accent border border-sidebar-border">
								<div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-sidebar-accent animate-pulse border border-sidebar-border shrink-0" />
								<div className="flex-1 space-y-1.5 sm:space-y-2">
									<div className="h-3 sm:h-3.5 w-24 sm:w-28 bg-sidebar-accent rounded animate-pulse" />
									<div className="h-2 sm:h-2.5 w-32 sm:w-36 bg-sidebar-accent rounded animate-pulse" />
								</div>
							</div>
						)}
					</div>
				) : (
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<button
								className="w-full h-11 flex items-center justify-center rounded-xl bg-sidebar-accent hover:bg-sidebar-accent/90 text-sidebar-foreground transition-all duration-200 border border-sidebar-border hover:border-sidebar-primary/30 shadow-sm hover:shadow-md group"
								title={userMe ? `${userMe.firstName} ${userMe.lastName}` : "Kullanıcı"}
							>
								{userMe ? (
									<div className="w-9 h-9 rounded-full bg-sidebar-primary text-sidebar-primary-foreground flex items-center justify-center border border-sidebar-border/50 shadow-sm group-hover:border-sidebar-primary group-hover:scale-105 transition-all duration-200">
										<User className="h-4.5 w-4.5 drop-shadow-sm" />
									</div>
								) : (
									<User className="h-4 w-4 text-sidebar-foreground" />
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
