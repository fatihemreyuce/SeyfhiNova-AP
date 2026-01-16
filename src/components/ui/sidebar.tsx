import { NavLink, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import DarkModeToggle from "@/components/dark-mode-toggle";
import { useLoginState } from "@/hooks/use-login-state";
import { LayoutDashboard, LogOut, Sparkles, FileText, Layers } from "lucide-react";

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
		<aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-border/40 bg-gradient-to-b from-background via-background to-muted/20 backdrop-blur-xl">
			{/* Header */}
			<div className="flex h-20 items-center justify-between px-6 border-b border-border/40 bg-gradient-to-r from-primary/5 via-transparent to-transparent">
				<div className="flex items-center gap-3">
					<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/60 shadow-lg shadow-primary/20">
						<Sparkles className="h-5 w-5 text-primary-foreground" />
					</div>
					<div className="flex flex-col">
						<span className="text-base font-bold tracking-tight">Seyfhi Nova</span>
						<span className="text-xs text-muted-foreground font-medium">Yatırım</span>
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
										? "bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-[1.02]"
										: "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground hover:translate-x-1"
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
			<div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border/40 bg-gradient-to-t from-background via-background to-transparent">
				{/* Logout Button */}
				<Button
					variant="outline"
					onClick={handleLogout}
					disabled={!isActionable || isLoading}
					className="w-full justify-start gap-3 h-10 border-border/40 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/40 transition-all duration-200"
					aria-busy={isLoading}
				>
					<LogOut className="h-4 w-4" />
					{isLoading ? "Çıkış yapılıyor..." : "Çıkış Yap"}
				</Button>
			</div>
		</aside>
	);
}