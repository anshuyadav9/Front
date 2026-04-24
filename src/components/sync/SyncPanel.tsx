import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Smartphone, ShieldCheck, RefreshCw, SmartphoneIcon, ExternalLink } from "lucide-react";
import { useAppStore } from "../../store/useAppStore";

export function SyncPanel() {
  const { user, devices } = useAppStore();
  const [pairingCode] = useState(() => Math.random().toString(36).substring(2, 8).toUpperCase());

  const pairingUrl = JSON.stringify({
    uid: user?.uid,
    code: pairingCode,
    email: user?.email,
    timestamp: Date.now()
  });

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Device Synchronization</h1>
        <p className="text-gray-400">Pair your Android device with FrontWindow to apply layouts in real-time.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Pairing Card */}
        <div className="p-8 rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-xl space-y-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <h2 className="font-bold text-xl">Pairing Mode</h2>
              <p className="text-sm text-gray-500">Scan this code in the mobile app</p>
            </div>
          </div>

          <div className="flex justify-center p-6 bg-white rounded-[2rem]">
            <QRCodeSVG value={pairingUrl} size={200} level="H" />
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-black/40 border border-white/5 flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1">Pairing Code</p>
                <p className="text-2xl font-mono font-bold tracking-widest text-cyan-400">{pairingCode}</p>
              </div>
              <button className="p-2 rounded-full hover:bg-white/10 text-gray-400">
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">
              Open <b>FrontWindow</b> on your Android device, go to Settings &gt; Pair Desktop 
              and scan the QR code or enter the pairing code manually.
            </p>
          </div>
        </div>

        {/* Info / Instructions */}
        <div className="space-y-6">
          <Section icon={SmartphoneIcon} title="Prerequisites">
            <ul className="space-y-4">
              <ListItem text="Android 10+ recommended for best overlay performance." />
              <ListItem text="Enable 'Display over other apps' permission." />
              <ListItem text="Enable 'Accessibility Service' for shortcut automation." />
              <ListItem text="Ignore battery optimization for always-on sync." />
            </ul>
          </Section>

          <div className="p-6 rounded-3xl bg-cyan-500/10 border border-cyan-500/20">
            <h3 className="font-bold mb-2 flex items-center gap-2 text-cyan-400">
              <ExternalLink className="w-4 h-4" />
              Android Integration Guide
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Check our documentation for advanced setup, custom intent hooks, and persistent background services.
            </p>
            <button className="mt-4 text-sm font-bold text-white hover:underline">Read Integration Guide &rarr;</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ icon: Icon, title, children }: any) {
  return (
    <div className="p-6 rounded-3xl bg-white/5 border border-white/10">
      <div className="flex items-center gap-3 mb-6">
        <Icon className="w-5 h-5 text-gray-400" />
        <h3 className="font-bold text-lg">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function ListItem({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-3">
      <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-cyan-500 shadow-[0_0_5px_#06b6d4]" />
      <span className="text-sm text-gray-300">{text}</span>
    </li>
  );
}
