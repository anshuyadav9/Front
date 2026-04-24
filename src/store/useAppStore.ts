import { create } from "zustand";
import { User } from "firebase/auth";
import { Device, WindowConfig } from "../lib/firebase";

interface AppState {
  user: User | null;
  setUser: (user: User | null) => void;
  devices: Device[];
  setDevices: (devices: Device[]) => void;
  configs: WindowConfig[];
  setConfigs: (configs: WindowConfig[]) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  devices: [],
  setDevices: (devices) => set({ devices }),
  configs: [],
  setConfigs: (configs) => set({ configs }),
  isLoading: true,
  setIsLoading: (loading) => set({ isLoading: loading }),
}));
