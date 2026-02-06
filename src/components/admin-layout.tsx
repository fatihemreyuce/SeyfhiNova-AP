import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./ui/sidebar";
import { Button } from "./ui/button";
import { Menu } from "lucide-react";

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sadece mobil + sidebar kapalıyken: menüyü açmak için tek buton (ayrı üst bar yok) */}
      {!sidebarOpen && (
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="fixed left-3 top-3 z-20 lg:hidden h-9 w-9"
          aria-label="Menüyü aç"
        >
          <Menu className="h-5 w-5" />
        </Button>
      )}

      {/* Sidebar (içinde burger/toggle var) */}
      <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />

      {/* Main Content — ayrı container yok, doğrudan sayfa içeriği */}
      <div
        className={`min-h-screen gradient-bg transition-all duration-300 ${
          sidebarOpen ? "lg:pl-64" : "lg:pl-20"
        }`}
      >
        <main className="min-h-screen p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
