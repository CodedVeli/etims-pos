// src/app/layout.js
import { Geist, Geist_Mono } from "next/font/google";
import Link from 'next/link';
import Image from 'next/image';
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "ETIMS POS System",
  description: "Electronic Tax Invoice Management System - Point of Sale",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50`}
      >
        <nav className="bg-white shadow-sm">
          <div className="container mx-auto px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Image
                src="/receipt.svg"
                alt="ETIMS Logo"
                width={24}
                height={24}
                className="text-blue-600"
              />
              <Link href="/" className="font-bold text-xl text-gray-800">
                ETIMS <span className="text-blue-600">POS</span>
              </Link>
            </div>
            <div className="flex gap-6">
              <Link 
                href="/" 
                className="text-gray-600 hover:text-blue-600 transition font-medium"
              >
                Dashboard
              </Link>
              <Link 
                href="/pos" 
                className="text-gray-600 hover:text-blue-600 transition font-medium"
              >
                Sales Terminal
              </Link>
              <Link 
                href="#" 
                className="text-gray-600 hover:text-blue-600 transition font-medium"
              >
                Reports
              </Link>
            </div>
          </div>
        </nav>
        
        {/* Main content */}
        <main>{children}</main>
        
        {/* Footer */}
        <footer className="bg-white border-t ">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center gap-2 mb-4 md:mb-0">
                <Image
                  src="/receipt.svg"
                  alt="ETIMS Logo"
                  width={18}
                  height={18}
                  className="text-gray-500"
                />
                <span className="text-sm text-gray-500">
                  ETIMS POS System v1.0
                </span>
              </div>
              <div className="text-sm text-gray-500">
                © {new Date().getFullYear()} Electronic Tax Invoice Management System
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}