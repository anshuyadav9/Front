import { motion } from "motion/react";
import { Zap, Smartphone, Shield, Layout, ChevronRight } from "lucide-react";

interface LandingProps {
  onLogin: () => void;
}

export function Landing({ onLogin }: LandingProps) {
  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-cyan-500/30">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl aspect-square bg-[radial-gradient(circle_at_50%_0%,#1a3a5a_0%,transparent_70%)] opacity-50" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium mb-8"
          >
            <Zap className="w-4 h-4" />
            <span>Next-Gen Mobile UI Controller</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl font-bold tracking-tighter mb-8 bg-gradient-to-b from-white to-gray-500 bg-clip-text text-transparent"
          >
            Control Your Device <br /> From the Web.
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            Customize floating windows, keyboard overlays, and accessibility shortcuts 
            in real-time. Experience seamless device sync with zero latency.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <button
              onClick={onLogin}
              className="px-8 py-4 bg-white text-black font-bold rounded-2xl flex items-center gap-2 hover:bg-cyan-50 transition-all shadow-xl shadow-cyan-500/10 active:scale-95"
            >
              Get Started for Free
              <ChevronRight className="w-5 h-5" />
            </button>
            <button className="px-8 py-4 bg-white/5 border border-white/10 text-white font-bold rounded-2xl hover:bg-white/10 transition-all backdrop-blur-md">
              Download Android App
            </button>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard 
            icon={Layout} 
            title="Floating Widgets" 
            description="Drag and drop chat heads, stock tickers, and quick tools anywhere on your screen."
          />
          <FeatureCard 
            icon={Smartphone} 
            title="Custom Keyboards" 
            description="One-hand mode, custom shortcut mapping, and neon themes for your typing experience."
          />
          <FeatureCard 
            icon={Shield} 
            title="Secure Sync" 
            description="End-to-end encrypted configuration sync between your desktop and mobile device."
          />
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description }: any) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl hover:border-cyan-500/50 transition-all group"
    >
      <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center mb-6 group-hover:bg-cyan-500/20 transition-colors">
        <Icon className="w-6 h-6 text-cyan-400" />
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-gray-400 leading-relaxed">{description}</p>
    </motion.div>
  );
}
