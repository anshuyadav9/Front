/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from "react";
import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { auth, googleProvider, db } from "./lib/firebase";
import { collection, onSnapshot, query, where, doc, getDocFromServer } from "firebase/firestore";
import { useAppStore } from "./store/useAppStore";
import { Navbar } from "./components/layout/Navbar";
import { Landing } from "./components/Landing";
import { Dashboard } from "./components/dashboard/Dashboard";
import { Editor } from "./components/editor/Editor";
import { SyncPanel } from "./components/sync/SyncPanel";
import { Settings } from "./components/Settings";
import { AnimatePresence, motion } from "motion/react";

export default function App() {
  const { user, setUser, setDevices, setConfigs, isLoading, setIsLoading } = useAppStore();
  const [currentPage, setCurrentPage] = useState<"dashboard" | "editor" | "sync" | "settings">("dashboard");

  useEffect(() => {
    // Validate connection to Firestore
    async function testConnection() {
      try {
        await getDocFromServer(doc(db, 'test', 'connection'));
      } catch (error) {
        if(error instanceof Error && error.message.includes('the client is offline')) {
          console.error("Please check your Firebase configuration.");
        }
      }
    }
    testConnection();

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [setUser, setIsLoading]);

  useEffect(() => {
    if (!user) return;

    // Sync devices
    const qDevices = query(collection(db, "users", user.uid, "devices"));
    const unsubDevices = onSnapshot(qDevices, (snapshot) => {
      setDevices(snapshot.docs.map((doc) => ({ ...doc.data() } as any)));
    }, (error) => {
      console.error("Device sync failed: ", error);
    });

    // Sync configs
    const qConfigs = query(collection(db, "users", user.uid, "configs"));
    const unsubConfigs = onSnapshot(qConfigs, (snapshot) => {
      setConfigs(snapshot.docs.map((doc) => ({ ...doc.data() } as any)));
    }, (error) => {
      console.error("Config sync failed: ", error);
    });

    return () => {
      unsubDevices();
      unsubConfigs();
    };
  }, [user, setDevices, setConfigs]);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!user) {
    return <Landing onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,#1a2a3a_0%,transparent_50%)] pointer-events-none" />
      
      <Navbar currentPage={currentPage} onNavigate={setCurrentPage} />
      
      <main className="pt-20 px-4 md:px-8 max-w-7xl mx-auto relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {currentPage === "dashboard" && <Dashboard onEdit={() => setCurrentPage("editor")} />}
            {currentPage === "editor" && <Editor />}
            {currentPage === "sync" && <SyncPanel />}
            {currentPage === "settings" && <Settings />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
