import { useState } from "react";
import { User, Bell, Shield, Database, Trash2, Smartphone } from "lucide-react";
import { useAppStore } from "../store/useAppStore";

export function Settings() {
  const { user, devices } = useAppStore();

  return (
    <div className="max-w-2xl mx-auto space-y-12 pb-20">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-gray-400 mt-2">Manage your account and platform preferences.</p>
      </div>

      <Section title="Profile" icon={User}>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-cyan-500/20 border border-cyan-500/30 overflow-hidden">
            {user?.photoURL ? (
              <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xl font-bold text-cyan-400">
                {user?.displayName?.charAt(0) || "U"}
              </div>
            )}
          </div>
          <div>
            <p className="font-bold text-lg">{user?.displayName}</p>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>
        </div>
      </Section>

      <Section title="Active Devices" icon={Smartphone}>
        <div className="space-y-4">
          {devices.map(device => (
            <div key={device.deviceId} className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
              <div>
                <p className="font-bold">{device.model}</p>
                <p className="text-xs text-gray-500 font-mono tracking-tighter">ID: {device.deviceId}</p>
              </div>
              <button className="p-2 text-red-500 hover:bg-red-500/10 rounded-xl transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          {devices.length === 0 && (
            <p className="text-sm text-gray-500 italic">No devices paired.</p>
          )}
        </div>
      </Section>

      <Section title="Notifications" icon={Bell}>
        <div className="space-y-4">
          <Toggle label="Device Connection Alerts" description="Notify me when a device stays offline for > 1 hour." defaultChecked />
          <Toggle label="Cloud Sync Confirmation" description="Show popup after successful layout sync." defaultChecked />
        </div>
      </Section>

      <Section title="Security & Privacy" icon={Shield}>
        <div className="space-y-4">
          <button className="w-full text-left p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all font-bold">
            Rotate Encryption Secret
          </button>
          <button className="w-full text-left p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-red-500/10 text-red-400 transition-all font-bold">
            Delete Account & All Data
          </button>
        </div>
      </Section>

      <div className="pt-8 border-t border-white/10 text-center">
        <p className="text-[10px] text-gray-600 uppercase tracking-widest font-black">FrontWindow Changer v1.2.0-stable</p>
      </div>
    </div>
  );
}

function Section({ title, icon: Icon, children }: any) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-white">
        <Icon className="w-4 h-4" />
        <h2 className="text-sm font-bold uppercase tracking-widest">{title}</h2>
      </div>
      <div className="p-8 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-xl">
        {children}
      </div>
    </div>
  );
}

function Toggle({ label, description, defaultChecked }: any) {
  const [checked, setChecked] = useState(defaultChecked);
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex-1">
        <p className="font-bold text-sm tracking-tight">{label}</p>
        <p className="text-xs text-gray-500 leading-relaxed">{description}</p>
      </div>
      <button
        onClick={() => setChecked(!checked)}
        className={`w-12 h-6 rounded-full transition-all relative ${
          checked ? "bg-cyan-500 shadow-[0_0_10px_#06b6d4]" : "bg-white/10"
        }`}
      >
        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${
          checked ? "left-7" : "left-1"
        }`} />
      </button>
    </div>
  );
}
