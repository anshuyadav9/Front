import { useState } from "react";
import { motion, Reorder } from "motion/react";
import { Layout, MousePointer2, Move, Type, Settings2, Save, Trash2, Smartphone, Sparkles, Loader2 } from "lucide-react";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useAppStore } from "../../store/useAppStore";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

interface Widget {
  id: string;
  type: "text" | "button" | "image" | "clock";
  x: number;
  y: number;
  w: number;
  h: number;
  content: string;
}

export function Editor() {
  const { user } = useAppStore();
  const [widgets, setWidgets] = useState<Widget[]>([
    { id: "1", type: "clock", x: 20, y: 50, w: 200, h: 80, content: "05:22" },
    { id: "2", type: "text", x: 20, y: 150, w: 240, h: 100, content: "Welcome back, User" },
  ]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isSuggesting, setIsSuggesting] = useState(false);

  const addWidget = (type: Widget["type"]) => {
    const newWidget: Widget = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      x: 50,
      y: 50,
      w: 150,
      h: 50,
      content: type === "text" ? "New Text" : type === "button" ? "Action" : "00:00",
    };
    setWidgets([...widgets, newWidget]);
  };

  const handleAISuggest = async () => {
    setIsSuggesting(true);
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: "Suggest a mobile HUD layout for 'Gaming Mode'. Return a JSON array of widgets with properties: type (text|button|clock), x (0-400), y (0-800), w (50-200), h (30-100), content (string). Only return JSON.",
        config: { responseMimeType: "application/json" }
      });
      
      const suggestedWidgets = JSON.parse(response.text || "[]");
      const mappedWidgets = suggestedWidgets.map((w: any) => ({
        ...w,
        id: Math.random().toString(36).substr(2, 9)
      }));
      setWidgets(mappedWidgets);
    } catch (e) {
      console.error("AI Suggestion failed", e);
    } finally {
      setIsSuggesting(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    try {
      const configId = "default-layout";
      await setDoc(doc(db, "users", user.uid, "configs", configId), {
        id: configId,
        name: "My Custom HUD",
        type: "floating",
        data: { widgets },
        isActive: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      alert("Configuration saved & synced to device!");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="h-[calc(100vh-120px)] flex gap-6">
      {/* Sidebar Controls */}
      <div className="w-64 flex flex-col gap-6">
        <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl">
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-6">Components</h3>
          <div className="grid grid-cols-1 gap-2">
            <ToolButton icon={Type} label="Text Label" onClick={() => addWidget("text")} />
            <ToolButton icon={MousePointer2} label="Quick Button" onClick={() => addWidget("button")} />
            <ToolButton icon={Layout} label="Floating Frame" onClick={() => addWidget("text")} />
            <ToolButton icon={Settings2} label="Clock Widget" onClick={() => addWidget("clock")} />
          </div>
          
          <div className="mt-8 pt-6 border-t border-white/10">
            <button
              onClick={handleAISuggest}
              disabled={isSuggesting}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50 transition-all shadow-lg shadow-purple-500/20"
            >
              {isSuggesting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
              AI Suggest Layout
            </button>
          </div>
        </div>

        <div className="mt-auto space-y-4">
          <button
            onClick={handleSave}
            className="w-full py-4 bg-cyan-500 text-black font-bold rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 hover:scale-[1.02] active:scale-95 transition-all"
          >
            <Save className="w-5 h-5" />
            Sync to Device
          </button>
          <button className="w-full py-4 bg-white/5 border border-white/10 text-white font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-white/10 transition-all">
            <Smartphone className="w-5 h-5" />
            Preview on Mobile
          </button>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 relative bg-black/40 rounded-[3rem] border border-white/10 overflow-hidden group shadow-inner">
        {/* Canvas Background Grid */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]" />
        
        {/* Phone Frame Overlay (Visual Guide) */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] h-[640px] border-2 border-white/10 rounded-[3rem] pointer-events-none flex flex-col items-center p-4">
          <div className="w-20 h-6 bg-black rounded-full mb-4" /> {/* Notch */}
          <span className="text-[10px] text-white/20 uppercase tracking-widest font-bold mt-auto">Android Surface Guide</span>
        </div>

        {/* Draggable Widgets */}
        {widgets.map((w) => (
          <motion.div
            key={w.id}
            drag
            dragMomentum={false}
            onDragStart={() => setSelectedId(w.id)}
            className={`absolute p-4 cursor-move backdrop-blur-md rounded-2xl border transition-all ${
              selectedId === w.id ? "border-cyan-400 bg-cyan-500/10 shadow-[0_0_20px_rgba(34,211,238,0.2)]" : "border-white/20 bg-white/5"
            }`}
            style={{ left: w.x, top: w.y, width: w.w, minHeight: w.h }}
          >
            {w.type === 'clock' ? (
              <div className="text-3xl font-mono tracking-tighter text-cyan-400">{w.content}</div>
            ) : (
              <div className="text-sm font-medium">{w.content}</div>
            )}
            
            {selectedId === w.id && (
              <button 
                onClick={() => setWidgets(widgets.filter(item => item.id !== w.id))}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white shadow-lg"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            )}
          </motion.div>
        ))}

        {widgets.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-gray-600">
            <Move className="w-12 h-12 mb-4 animate-bounce" />
            <p className="text-lg">Drag elements from the sidebar</p>
          </div>
        )}
      </div>
    </div>
  );
}

function ToolButton({ icon: Icon, label, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
    >
      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
        <Icon className="w-4 h-4" />
      </div>
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
}
