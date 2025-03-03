"use client";

import React, { ReactNode } from 'react';
import Link from 'next/link';
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { WritingQuote } from '../types/types';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const WRITING_QUOTES: WritingQuote[] = [
  { text: "Write what you know", author: "Mark Twain" },
  { text: "The first draft is just you telling yourself the story", author: "Terry Pratchett" },
  { text: "You can always edit a bad page. You can't edit a blank page", author: "Jodi Picoult" },
  { text: "Write with the door closed, rewrite with the door open", author: "Stephen King" },
  { text: "The scariest moment is always just before you start", author: "Stephen King" }
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <style jsx global>{`
          @keyframes float {
            0% {
              transform: translateY(-5vh) translateX(-10px);
              opacity: 0;
            }
            10% {
              opacity: 1;
            }
            90% {
              opacity: 1;
            }
            100% {
              transform: translateY(105vh) translateX(10px);
              opacity: 0;
            }
          }

          @keyframes swayLeaf {
            0% {
              transform: rotate(-45deg);
            }
            100% {
              transform: rotate(45deg);
            }
          }

          @keyframes spin-slow {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }

          .animate-spin-slow {
            animation: spin-slow 20s linear infinite;
          }
        `}</style>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-stone-50 font-sans relative overflow-hidden`}
      >
        {/* Background Elements */}
        <div className="fixed inset-0 bg-gradient-to-br from-stone-50 via-white to-stone-50"></div>
        <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMSIgZmlsbD0iI2M4YjA3MCIgZmlsbC1vcGFjaXR5PSIwLjEiLz48L3N2Zz4=')] opacity-30"></div>

        {/* Floating Leaves Container */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none" id="leaves-container"></div>

        {/* Zen Circles */}
        <div className="fixed inset-0 flex items-center justify-center opacity-5 pointer-events-none">
          <div className="w-[80vh] h-[80vh] border-8 border-gold-600 rounded-full animate-pulse"></div>
          <div className="absolute w-[40vh] h-[40vh] border-4 border-gold-600 rounded-full"></div>
          <div className="absolute w-[60vh] h-[60vh] border-2 border-gold-600/50 rounded-full"></div>
        </div>

        {/* Gold Banners */}
        <div className="fixed top-0 right-0 w-full h-16 bg-gradient-to-r from-gold-600/5 via-gold-600/10 to-transparent transform -skew-y-6"></div>
        <div className="fixed bottom-0 left-0 w-full h-16 bg-gradient-to-l from-gold-600/5 via-gold-600/10 to-transparent transform skew-y-6"></div>

        {/* Main Content */}
        <div className="relative z-10 transform transition-opacity duration-1000 opacity-100">
          {/* Header */}
          <header className="py-6 px-6 bg-white/80 backdrop-blur-sm sticky top-0 z-20 border-b border-gold-600/10">
            <div className="max-w-6xl mx-auto flex justify-between items-center">
              <h1 className="text-2xl font-light text-gray-900">
                <span className="text-gold-600">Vīgintī Trēs</span> in scriptura
              </h1>
              <nav className="flex gap-12">
                {['journal', 'archive', 'about'].map((item) => (
                  <Link href={`/${item}`} key={item}>
                    <span className="text-gray-800 hover:text-gold-600 transition-colors duration-300 lowercase relative group tracking-wide cursor-pointer">
                      {item}
                      <span className="absolute -bottom-1 left-0 w-full h-px bg-gold-600/30 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                    </span>
                  </Link>
                ))}
              </nav>
            </div>
          </header>

          {/* Page Content */}
          <main className="max-w-6xl mx-auto px-6 py-16">
            {children}
          </main>

          {/* Footer */}
          <footer className="absolute bottom-0 w-full py-4 text-center text-gray-600 text-sm bg-white/50 backdrop-blur-sm">
            <p>© 2024 · <span className="text-gold-600">Thanks for visiting</span></p>
          </footer>
        </div>
      </body>
    </html>
  );
}