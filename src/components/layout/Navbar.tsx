import { Layout, Monitor, Settings, Zap, LogOut } from "lucide-react";
import { auth } from "../../lib/firebase";
import { signOut } from "firebase/auth";

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: any) => void;
}

export function Navbar({ currentPage, onNavigate }: NavbarProps) {
  const items = [
    { id: "dashboard", label: "Dashboard", icon: Layout },
    { id: "editor", label: "Customize", icon: Zap },
    { id: "sync", label: "Sync Device", icon: Monitor },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-black/50 backdrop-blur-xl border-bottom border-white/10 z-50 px-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center">
          <Zap className="w-5 h-5 text-white" />
        </div>
        <span className="font-bold text-xl tracking-tight hidden md:block">FrontWindow</span>
      </div>

      <div className="flex items-center gap-2 md:gap-8 bg-white/5 rounded-full px-4 py-1.5 border border-white/10">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all ${
              currentPage === item.id
                ? "bg-cyan-500/20 text-cyan-400"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <item.icon className="w-4 h-4" />
            <span className="text-sm font-medium hidden lg:block">{item.label}</span>
          </button>
        ))}
      </div>

      <button
        onClick={() => signOut(auth)}
        className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-red-400 transition-colors"
      >
        <LogOut className="w-5 h-5" />
      </button>
    </nav>
  );
}
