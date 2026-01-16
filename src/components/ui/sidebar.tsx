import { NavLink, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import DarkModeToggle from "@/components/dark-mode-toggle";
import { useLoginState } from "@/hooks/use-login-state";
import { LayoutDashboard, LogOut } from "lucide-react";

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
	// add more navigation items here
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
		<aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/80">
			{/* Header */}
			<div className="flex h-16 items-center justify-between px-6 border-b">
				<div className="flex items-center gap-2">
					
					<span className="text-lg font-semibold italic">Seyfhi Nova Yatırım</span>
				</div>
			</div>

			{/* Navigation */}
			<nav className="flex flex-col gap-2 p-4">
				{navigationItems.map((item) => {
					const Icon = item.icon;
					return (
						<NavLink
							key={item.to}
							to={item.to}
							end={item.end}
							className={({ isActive }) =>
								`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
									isActive
										? "bg-primary text-primary-foreground shadow-sm"
										: "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
								}`
							}
						>
							<Icon className="h-4 w-4" />
							{item.label}
						</NavLink>
					);
				})}
			</nav>

			{/* Footer with dark mode toggle and logout */}
			<div className="absolute bottom-0 left-0 right-0 p-4 border-t space-y-3">
				{/* Dark Mode Toggle */}
				<div className="flex items-center justify-between px-2">
					<span className="text-sm text-muted-foreground">Theme</span>
					<DarkModeToggle />
				</div>
				
				{/* Logout Button */}
				<Button
					variant="outline"
					onClick={handleLogout}
					disabled={!isActionable || isLoading}
					className="w-full justify-start gap-3"
					aria-busy={isLoading}
				>
					<LogOut className="h-4 w-4" />
					{isLoading ? "Logging out..." : "Logout"}
				</Button>
			</div>
		</aside>
	);
}