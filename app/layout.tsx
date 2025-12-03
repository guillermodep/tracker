import type { Metadata } from "next";
import "./globals.css";
import Navigation from "@/components/Navigation";

export const metadata: Metadata = {
  title: "J2C Migration Tracker",
  description: "Sistema de gestión de migraciones cloud con vendor management",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <Navigation />
        {children}
      </body>
    </html>
  );
}
