import express from "express";
import { createServer } from "http";
import path from "path";
import fs from "fs";
import { nanoid } from "nanoid";
import { createServer as createViteServer } from "vite";
import viteConfig from "../vite.config";

export async function createSpaMiddleware() {
  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    server: { 
      middlewareMode: true,
      allowedHosts: ['all'],
      host: true,
    },
    appType: "custom",
  });

  return {
    viteMiddleware: vite.middlewares,
    spaFallback: async (req: express.Request, res: express.Response) => {
      // Only serve SPA for non-API routes
      if (req.path.startsWith('/api/') || req.path.includes('.')) {
        return res.status(404).json({ message: "Not found" });
      }

      console.log(`[SPA] Serving React app for: ${req.path} (Host: ${req.get('host')})`);

      try {
        const clientTemplate = path.resolve(
          import.meta.dirname,
          "..",
          "client",
          "index.html",
        );

        let template = await fs.promises.readFile(clientTemplate, "utf-8");
        template = template.replace(
          `src="/src/main.tsx"`,
          `src="/src/main.tsx?v=${nanoid()}"`,
        );
        
        // Force Vite to process the template correctly
        const page = await vite.transformIndexHtml(req.originalUrl, template);
        
        // Ensure proper headers for SPA
        res.status(200)
           .set({ 
             "Content-Type": "text/html; charset=utf-8",
             "Cache-Control": "no-cache, no-store, must-revalidate"
           })
           .end(page);
      } catch (e) {
        console.error('SPA middleware error:', e);
        res.status(500).json({ message: "Server error" });
      }
    }
  };
}