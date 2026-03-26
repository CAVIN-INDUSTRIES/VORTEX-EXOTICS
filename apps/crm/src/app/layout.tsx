import type { Metadata } from "next";
import { AuthProvider } from "@/contexts/AuthContext";
import { TenantThemeProvider } from "@/components/TenantThemeProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "VEX CRM",
  description: "Staff portal — leads, orders, inventory, customers",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <TenantThemeProvider>
          <AuthProvider>{children}</AuthProvider>
        </TenantThemeProvider>
      </body>
    </html>
  );
}
