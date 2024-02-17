import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  const url =
    process.env.VITE_ENVIRONMENT === "development"
      ? process.env.VITE_LOCAL_SERVER_URL
      : process.env.VITE_PROD_SERVER_URL;

  return defineConfig({
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      proxy: {
        "/api": {
          target: url,
          changeOrigin: true,
          secure: false,
        },
      },
    },
  });
};
