import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import "./globals.css";
import { QueryProvider } from "./lib/react-query/QueryProvider.tsx";
import { AuthProvider } from "./context/AuthContext.tsx";
import { Banner, Footer, Helmet, Navbar, ThemeProvider } from "./components/root";
import { HelmetProvider } from 'react-helmet-async';

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryProvider>
      <BrowserRouter>
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <HelmetProvider>
              <Navbar />
              <Helmet>
                <App />
              </Helmet>
            </HelmetProvider>
          </ThemeProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryProvider>
  </React.StrictMode>
);
