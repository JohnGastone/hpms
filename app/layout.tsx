import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import Navbar from "@/components/navBar";
import { AuthProvider } from "@/context/authContext";
import ReactQueryProvider from "@/context/reactQueryProvider";
import { ThemeProvider } from "@/context/themeContext";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "MediTrack — Hospital Patient Management",
  description: "Day 2: Routing, Lifecycle & API Data — built with Next.js + React",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${montserrat.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-white dark:bg-slate-900 flex flex-col transition-colors duration-200">
        <ThemeProvider>
          <ReactQueryProvider>
            <AuthProvider>
              <Navbar />
              {children}
            </AuthProvider>
          </ReactQueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}