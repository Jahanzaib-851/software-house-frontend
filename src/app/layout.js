import "@/app/globals.css";
import { Inter } from "next/font/google";
import ClientWrapper from "./ClientWrapper"; // ✅ Correct Import

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Nexus | Software House Asset Management",
  description: "Next-generation asset and inventory tracking system",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} bg-[#F8FAFC] text-slate-900 min-h-screen antialiased`}>
        {/* Poora project ab ClientWrapper ke control mein hai */}
        <ClientWrapper>
          <main className="relative">
            {children}
          </main>
        </ClientWrapper>
      </body>
    </html>
  );
}