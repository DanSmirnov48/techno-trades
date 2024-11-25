import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import "./globals.css";
import { AuthProvider } from "./context/AuthContext.tsx";
import { GoogleAuthProvider, QueryProvider, ThemeProvider, HelmetProvider } from "./providers/index.ts";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryProvider>
      <GoogleAuthProvider>
        <BrowserRouter>
          <AuthProvider>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              <HelmetProvider>
                <App />
              </HelmetProvider>
            </ThemeProvider>
          </AuthProvider>
        </BrowserRouter>
      </GoogleAuthProvider>
    </QueryProvider>
  </React.StrictMode>
);
