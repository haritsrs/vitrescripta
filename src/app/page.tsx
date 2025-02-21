"use client";

import React, { useState, useEffect } from 'react';
import { Wind, Feather } from 'lucide-react';
import Link from 'next/link';

const MEDITATION_QUOTES = [
  { text: "Silence is not empty, it is full of answers", author: "Ancient Proverb" },
  { text: "In the pause between breaths, wisdom grows", author: "Zen Teaching" },
  { text: "The present moment holds infinite riches", author: "Thich Nhat Hanh" },
  { text: "Peace comes from within, do not seek it without", author: "Buddha" },
  { text: "Every morning we are born again", author: "Buddhist Wisdom" }
];

const FloatingLeaf = ({ delay }: { delay: number }) => {
  const startPosition = Math.random() * 100;
  const duration = 15 + Math.random() * 10;
  const size = 16 + Math.random() * 16;
  const swayDuration = 3 + Math.random() * 2;

  return (
    <div 
      className="absolute"
      style={{
        left: `${startPosition}%`,
        animationName: 'float',
        animationDuration: `${duration}s`,
        animationTimingFunction: 'linear',
        animationIterationCount: 'infinite',
        animationDelay: `${delay}s`,
        top: '-24px'
      }}
    >
      <Feather 
        size={size} 
        className="text-gold-600/40 animate-spin-slow transform"
        style={{
          animationName: 'swayLeaf',
          animationDuration: `${swayDuration}s`,
          animationTimingFunction: 'ease-in-out',
          animationIterationCount: 'infinite',
          animationDirection: 'alternate'
        }}
      />
    </div>
  );
};

const LandingPage = () => {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [quote, setQuote] = useState(MEDITATION_QUOTES[0]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setQuote(MEDITATION_QUOTES[Math.floor(Math.random() * MEDITATION_QUOTES.length)]);
    setIsVisible(true);
  }, []);

  const handleSectionHover = (section: string | null) => {
    setActiveSection(section);
  };

  const leaves = Array.from({ length: 12 }, (_, i) => (
    <FloatingLeaf key={i} delay={i * 1.5} />
  ));

  return (
    <div className="min-h-screen bg-stone-50 font-sans relative overflow-hidden">
      {/* CSS for Animations */}
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

      {/* Background Elements */}
      <div className="fixed inset-0 bg-gradient-to-br from-stone-50 via-white to-stone-50"></div>
      <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMSIgZmlsbD0iI2M4YjA3MCIgZmlsbC1vcGFjaXR5PSIwLjEiLz48L3N2Zz4=')] opacity-30"></div>

      {/* Floating Leaves */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {leaves}
      </div>

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
      <div className={`relative z-10 transform transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        {/* Header */}
        <header className="py-8 px-6 bg-white/80 backdrop-blur-sm sticky top-0 z-20 border-b border-gold-600/10">
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

        {/* Main Content */}
        <main className="max-w-6xl mx-auto px-6 py-24">
          <div className="grid grid-cols-12 gap-16">
            {/* Left Content */}
            <div className="col-span-7 space-y-16">
              <div 
                className="space-y-8 transform transition-all duration-500"
                onMouseEnter={() => handleSectionHover('main')}
                onMouseLeave={() => handleSectionHover(null)}
                style={{
                  opacity: activeSection && activeSection !== 'main' ? 0.5 : 1,
                  transform: activeSection && activeSection !== 'main' ? 'translateY(10px)' : 'translateY(0)'
                }}
              >
                <Wind className="text-gold-600" size={32} />
                <h2 className="text-5xl font-light text-gray-900 leading-relaxed tracking-wide">
                  Where thoughts flow
                  <br />
                  like autumn leaves on
                  <br />
                  <span className="text-gold-600">still water</span>
                </h2>
                <div className="relative">
                  <div className="absolute -left-3 top-0 bottom-0 w-1 bg-gradient-to-b from-gold-600/50 to-transparent"></div>
                  <p className="text-gray-700 text-lg leading-relaxed tracking-wide pl-6">
                    A space for contemplation and written meditation, 
                    where ideas drift between consciousness and paper.
                  </p>
                </div>
              </div>

              {/* Quote of the Day */}
              <div className="bg-white/50 backdrop-blur-sm p-8 rounded-sm border-l-2 border-gold-600/30">
                <blockquote className="text-gray-700 italic">
                  &ldquo;{quote.text}&rdquo;
                  <footer className="mt-2 text-sm text-gold-600">— {quote.author}</footer>
                </blockquote>
              </div>

              <div className="pt-8">
                <button className="group relative px-8 py-4 bg-gradient-to-r from-gold-600/10 to-transparent text-gold-600 overflow-hidden">
                  <span className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-gold-600 to-transparent transform origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100"></span>
                  begin reading
                </button>
              </div>
            </div>

            {/* Right Content */}
            <div className="col-span-5 flex items-center">
              <div className="space-y-12 w-full">
                {['Reflection', 'Observation', 'Connection'].map((item, index) => (
                  <div 
                    key={item}
                    className="relative p-6 transform transition-all duration-500 bg-gradient-to-r hover:from-gold-600/5 hover:to-transparent"
                    onMouseEnter={() => handleSectionHover(item.toLowerCase())}
                    onMouseLeave={() => handleSectionHover(null)}
                    style={{
                      opacity: activeSection && activeSection !== item.toLowerCase() ? 0.5 : 1,
                      transform: `translateY(${activeSection && activeSection !== item.toLowerCase() ? '10px' : '0'})`,
                      transitionDelay: `${index * 100}ms`
                    }}
                  >
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-12 bg-gradient-to-b from-gold-600/30 to-transparent"></div>
                    <h3 className="text-xl text-gray-900 mb-2 pl-4 tracking-wide">
                      {item}
                    </h3>
                    <p className="text-gray-700 text-sm leading-relaxed pl-4">
                      {index === 0 && "Through stillness, we find clarity"}
                      {index === 1 && "In silence, truth emerges"}
                      {index === 2 && "Between words, meaning flows"}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="absolute bottom-0 w-full py-6 text-center text-gray-600 text-sm bg-white/50 backdrop-blur-sm">
          <p>© 2024 · <span className="text-gold-600">crafted with intention</span></p>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;