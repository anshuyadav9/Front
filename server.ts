import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes for Android App
  app.get("/api/health", (req, res) => {
    res.json({ status: "online", version: "1.2.0" });
  });

  // Mock endpoint for config fetch (in production, the app would use Firebase SDK directly)
  // But providing this as per user request for "API structure"
  app.get("/api/config/:deviceId", (req, res) => {
    const { deviceId } = req.params;
    // In a real scenario, we'd verify auth/pairing here
    res.json({
      deviceId,
      timestamp: Date.now(),
      syncMode: "HEARTBEAT",
      config: {
        overlayEnabled: true,
        windows: [
          { id: "clock-1", type: "CLOCK", x: 10, y: 10, scale: 1.2 },
          { id: "shortcuts-1", type: "LIST", items: ["Calc", "Notes"] }
        ]
      }
    });
  });

  // Android Integration Guide Endpoint
  app.get("/api/android/guide", (req, res) => {
    res.json({
      app_name: "FrontWindow Companion",
      permissions: [
        "android.permission.SYSTEM_ALERT_WINDOW",
        "android.permission.BIND_ACCESSIBILITY_SERVICE",
        "android.permission.INTERNET"
      ],
      service_type: "Sticky Background Service",
      sync_protocol: "Firebase Firestore Snapshot / REST fallback",
      endpoint_root: `${process.env.APP_URL || "http://localhost:3000"}/api`
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
