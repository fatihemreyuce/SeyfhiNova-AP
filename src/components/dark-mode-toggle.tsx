import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

interface DarkModeToggleProps {
	className?: string;
}

export default function DarkModeToggle({ className }: DarkModeToggleProps) {
	const [isDark, setIsDark] = useState(() => {
		const stored = localStorage.getItem("theme");
		return stored === "dark";
	});

	useEffect(() => {
		// migrate legacy darkMode flag if present
		const legacyDark = localStorage.getItem("darkMode");
		const stored = localStorage.getItem("theme");
		let initialTheme = stored || "light";
		if (!stored && legacyDark) {
			try {
				const legacy = JSON.parse(legacyDark) as boolean;
				initialTheme = legacy ? "dark" : "light";
				localStorage.setItem("theme", initialTheme);
				localStorage.removeItem("darkMode");
			} catch {
				// Ignore parsing errors
			}
		}
		setIsDark(initialTheme === "dark");
	}, []);

	useEffect(() => {
		const rootElement = document.documentElement;
		rootElement.classList.remove("dark");
		if (isDark) {
			rootElement.classList.add("dark");
			localStorage.setItem("theme", "dark");
		} else {
			localStorage.setItem("theme", "light");
		}
	}, [isDark]);

	const toggleTheme = () => {
		setIsDark(!isDark);
	};

	return (
		<button
			onClick={toggleTheme}
			className={cn(
				"relative inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border/40 bg-background/50 backdrop-blur-sm transition-all duration-200",
				"hover:bg-accent hover:border-border hover:scale-105",
				"focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
				"active:scale-95",
				className
			)}
			aria-label={isDark ? "Açık temaya geç" : "Koyu temaya geç"}
			title={isDark ? "Açık tema" : "Koyu tema"}
		>
			<div className="relative h-4 w-4">
				<Sun
					className={cn(
						"absolute inset-0 h-4 w-4 transition-all duration-300",
						isDark
							? "rotate-90 scale-0 opacity-0 text-muted-foreground"
							: "rotate-0 scale-100 opacity-100 text-amber-500"
					)}
				/>
				<Moon
					className={cn(
						"absolute inset-0 h-4 w-4 transition-all duration-300",
						isDark
							? "rotate-0 scale-100 opacity-100 text-blue-400"
							: "-rotate-90 scale-0 opacity-0 text-muted-foreground"
					)}
				/>
			</div>
		</button>
	);
}
