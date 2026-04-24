import { motion } from "motion/react";
import { Plus, Smartphone, CheckCircle2, XCircle, ChevronRight, Clock } from "lucide-react";
import { useAppStore } from "../../store/useAppStore";

interface DashboardProps {
  onEdit: () => void;
}

export function Dashboard({ onEdit }: DashboardProps) {
  const { devices, configs, user } = useAppStore();

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">System Console</h1>
          <p className="text-gray-400 mt-2">Welcome back, {user?.displayName}. Monitoring {devices.length} devices.</p>
        </div>
        <button
          onClick={onEdit}
          className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-black font-bold rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-cyan-500/20"
        >
          <Plus className="w-5 h-5" />
          Create New Configuration
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Active Devices */}
        <div className="lg:col-span-2 space-y-6">
          <SectionHeader title="Active Devices" count={devices.length} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {devices.map((device) => (
              <DeviceCard key={device.deviceId} device={device} />
            ))}
            {devices.length === 0 && (
              <div className="col-span-full p-12 rounded-3xl border border-dashed border-white/10 flex flex-col items-center justify-center text-center">
                <Smartphone className="w-12 h-12 text-gray-600 mb-4" />
                <p className="text-gray-500">No devices paired yet.</p>
                <button className="text-cyan-400 text-sm mt-2 font-medium hover:underline">Pair your first device</button>
              </div>
            )}
          </div>

          <SectionHeader title="Recent Configurations" count={configs.length} />
          <div className="space-y-4">
            {configs.map((config) => (
              <ConfigRow key={config.id} config={config} onEdit={onEdit} />
            ))}
            {configs.length === 0 && (
              <div className="p-8 rounded-3xl bg-white/5 border border-white/10 text-center text-gray-500">
                You haven't created any configurations yet.
              </div>
            )}
          </div>
        </div>

        {/* Sidebar / Stats */}
        <div className="space-y-6">
          <SectionHeader title="System Status" />
          <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl">
            <div className="space-y-6">
              <StatusItem label="API Connection" status="healthy" />
              <StatusItem label="Cloud Sync" status="healthy" />
              <StatusItem label="Device Proxy" status="standby" />
              <div className="pt-4 border-t border-white/10">
                <p className="text-xs text-gray-500 mb-4 uppercase tracking-widest font-bold">Quick Usage</p>
                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full w-[65%] bg-cyan-500 shadow-[0_0_10px_#06b6d4]" />
                </div>
                <div className="flex justify-between mt-2 text-xs font-mono text-gray-400">
                  <span>65% Sync Load</span>
                  <span>1.2s Latency</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionHeader({ title, count }: any) {
  return (
    <div className="flex items-center gap-3">
      <h2 className="text-xl font-bold">{title}</h2>
      {count !== undefined && (
        <span className="px-2 py-0.5 rounded-md bg-white/10 text-xs font-mono text-gray-400">
          {count}
        </span>
      )}
    </div>
  );
}

function DeviceCard({ device }: { device: any }) {
  return (
    <div className="p-6 rounded-3xl bg-white/5 border border-white/10 hover:border-cyan-500/30 transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
          <Smartphone className="w-5 h-5 text-gray-400" />
        </div>
        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
          device.status === 'online' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
        }`}>
          <div className={`w-1.5 h-1.5 rounded-full ${device.status === 'online' ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
          {device.status}
        </div>
      </div>
      <div>
        <h3 className="font-bold text-lg">{device.model}</h3>
        <p className="text-gray-500 text-sm mt-1">OS: {device.osVersion}</p>
      </div>
      <div className="mt-6 flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          <span>Last seen 2m ago</span>
        </div>
        <button className="text-cyan-400 font-bold hover:underline">Manage</button>
      </div>
    </div>
  );
}

function ConfigRow({ config, onEdit }: any) {
  return (
    <div className="group flex items-center justify-between p-4 px-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/[0.07] transition-all cursor-pointer" onClick={onEdit}>
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center">
          <div className="w-4 h-4 rounded-sm border-2 border-cyan-400" />
        </div>
        <div>
          <h4 className="font-bold">{config.name}</h4>
          <p className="text-xs text-gray-500 uppercase tracking-wider mt-0.5">{config.type}</p>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div className="hidden md:flex flex-col items-end">
          <span className="text-xs text-gray-500">Last updated</span>
          <span className="text-sm font-mono tracking-tighter">Apr 24, 05:22</span>
        </div>
        <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-cyan-500 group-hover:border-cyan-500 transition-all">
          <ChevronRight className="w-4 h-4 group-hover:text-black transition-colors" />
        </div>
      </div>
    </div>
  );
}

function StatusItem({ label, status }: any) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-400">{label}</span>
      <div className="flex items-center gap-2">
        <span className={`text-xs font-bold uppercase tracking-wider ${
          status === 'healthy' ? 'text-green-400' : 'text-yellow-400'
        }`}>
          {status}
        </span>
        {status === 'healthy' ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : <XCircle className="w-4 h-4 text-yellow-400" />}
      </div>
    </div>
  );
}
