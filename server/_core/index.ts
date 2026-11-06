import "dotenv/config";
import express from "express";
import fs from "fs";
import path from "path";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerAuthRoutes } from "./auth";
import { registerStorageProxy } from "./storageProxy";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic } from "./serveStatic";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  const app = express();
  const server = createServer(app);
  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  // Ensure and serve static uploads directory
  const uploadsDir = path.resolve(process.cwd(), "dist", "public", "uploads");
  const clientUploadsDir = path.resolve(
    process.cwd(),
    "client",
    "public",
    "uploads"
  );
  for (const dir of [uploadsDir, clientUploadsDir]) {
    if (!fs.existsSync(dir)) {
      try {
        fs.mkdirSync(dir, { recursive: true });
      } catch (e) {
        // ignore
      }
    }
  }
  app.use("/uploads", express.static(uploadsDir));
  app.use("/uploads", express.static(clientUploadsDir));

  registerStorageProxy(app);
  registerAuthRoutes(app);
  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  // Only use Vite dev server if running from source (client/src exists) in development mode
  // When running compiled bundle (node dist/index.js), always serve pre-built static files
  const isDevSource =
    process.env.NODE_ENV === "development" &&
    fs.existsSync(path.resolve(import.meta.dirname, "../..", "client", "src"));

  if (isDevSource) {
    const viteModulePath = "./vite";
    const { setupVite } = await import(viteModulePath);
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  const host = process.env.HOST || "0.0.0.0";
  const port = process.env.PORT ? preferredPort : await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, host, () => {
    console.log(`Server running on http://${host === "0.0.0.0" ? "localhost" : host}:${port}/`);
  });
}

startServer().catch(console.error);
