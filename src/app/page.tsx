"use client";

import React, { useState } from 'react';
import { Pen, ScrollText, BookOpen } from 'lucide-react';

const LandingPage = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="min-h-screen bg-white flex flex-col font-serif relative overflow-hidden">
      {/* Gold Gradient Overlay */}
      <div 
        className={`absolute top-0 right-0 w-2/3 h-full bg-gradient-to-bl from-gold-500/20 to-transparent transition-all duration-700 ease-in-out 
        ${isHovered ? 'rotate-6 scale-105' : 'rotate-0'}`}
      ></div>

      {/* Deconstructed Layout */}
      <div 
        className="container mx-auto grid grid-cols-12 gap-4 flex-grow relative z-10"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Header Fragment */}
        <header className="col-span-12 py-8 flex justify-between items-center">
          <h1 className="text-4xl font-extrabold tracking-widest text-gold-600 uppercase transform -skew-x-6">
            Vīgintī Trēs in Scriptura
          </h1>
          <nav className="space-x-6">
            <a href="#" className="text-gray-800 hover:text-gold-600 text-lg relative group">
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gold-600 transition-all duration-300 group-hover:w-full"></span>
              Reflections
            </a>
            <a href="#" className="text-gray-800 hover:text-gold-600 text-lg relative group">
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gold-600 transition-all duration-300 group-hover:w-full"></span>
              Archives
            </a>
          </nav>
        </header>

        {/* Content Blocks */}
        <div className="col-span-7 space-y-8 mt-16">
          <div className="flex items-center space-x-6">
            <Pen className="text-gold-600 transform -rotate-12" size={50} />
            <h2 className="text-6xl font-bold text-gray-800 tracking-wide transform -skew-x-3">
              Unfolding
              <br />
              <span className="text-gold-600">Consciousness</span>
            </h2>
          </div>

          <p className="text-xl text-gray-700 leading-relaxed tracking-wide opacity-80">
            A fragmentary exploration of thought, where words dance between reality and imagination, creating landscapes of meaning.
          </p>

          <div className="flex space-x-6">
            <a 
              href="/writings" 
              className="relative group overflow-hidden px-8 py-4 border border-gold-600 text-gold-600 uppercase tracking-wider"
            >
              <span className="absolute inset-0 bg-gold-600 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 z-0"></span>
              <span className="relative z-10 group-hover:text-white transition-colors">
                Explore Writings
              </span>
            </a>
          </div>
        </div>

        {/* Experimental Quote Block */}
        <div className="col-span-5 mt-16 relative">
          <div className="bg-gray-50 shadow-2xl p-8 border-l-4 border-gold-600 transform -rotate-3 hover:rotate-0 transition-transform">
            <blockquote className="italic text-xl text-gray-800 mb-6 relative">
              <span className="absolute -left-6 top-0 text-gold-600 text-5xl opacity-30">"</span>
              Thoughts are but ephemeral sculptures, carved in the marble of momentary perception.
              <span className="absolute -right-6 bottom-0 text-gold-600 text-5xl opacity-30">"</span>
            </blockquote>
          </div>
        </div>
      </div>

      {/* Minimalist Footer */}
      <footer className="py-6 text-center relative z-10">
        <p className="text-gray-600 tracking-wide">
          © MMXXIV Vīgintī Trēs in Scriptura
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;