"use client";

import React, { useState, useEffect } from 'react';
import { Scroll, Feather, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

// Mock data for writings
const SCRIPTURE_POSTS = [
  {
    id: 1,
    title: "The Stillness Between Thoughts",
    date: "February 18, 2024",
    excerpt: "In the space between our thoughts lies a vastness we rarely explore...",
    content: `In the space between our thoughts lies a vastness we rarely explore. When the mind quiets, even momentarily, we glimpse something profound—a stillness that feels both empty and full simultaneously.

I've been sitting with this paradox lately. How can emptiness contain such richness? Perhaps it's because true emptiness isn't absence, but potential. Like a blank page before writing begins, it holds all possible words.

Today, I watched the sunrise through morning fog. The world revealed itself gradually, each layer of mist dissolving to show another dimension of the landscape. It struck me that clarity comes this way too—not all at once, but in gentle unveilings.

We so often rush to fill silence, to occupy emptiness. But what might happen if we learned to dwell there a little longer? To resist the urge to grasp at thoughts as they arise and instead watch them form and dissolve like morning mist?

I'm learning that wisdom doesn't always arrive in thunderous revelation. Sometimes it seeps in quietly during those moments of stillness, when we've temporarily suspended our need to know, to name, to capture.`,
    tags: ["meditation", "awareness", "morning"]
  },
  {
    id: 2,
    title: "Leaves Falling",
    date: "February 10, 2024",
    excerpt: "I watched a single leaf today, its journey from branch to ground...",
    content: `I watched a single leaf today, its journey from branch to ground. How gracefully it surrendered to gravity, not falling straight down but dancing with the currents of air—first rising, then swirling, before finally settling on the earth.

There's a lesson in this I'm still unpacking. Something about the beauty possible in letting go, in working with forces larger than ourselves rather than against them.

The leaf doesn't resist its falling. It doesn't cling desperately to the branch when its time has come. And in that surrender, it creates something beautiful—a moment of perfect, ephemeral artistry that would never exist if it had stayed attached.

I wonder how many things I'm clutching tightly that I should release. How many possibilities for grace I'm denying myself through resistance.

Perhaps wisdom isn't always about building and acquiring. Sometimes it's about releasing our grip and trusting the descent.`,
    tags: ["nature", "surrender", "autumn"]
  },
  {
    id: 3,
    title: "Between Words",
    date: "January 28, 2024",
    excerpt: "Language both reveals and conceals truth. The words we choose...",
    content: `Language both reveals and conceals truth. The words we choose illuminate certain aspects of reality while casting shadows over others. I've been contemplating this paradox lately, especially in my meditation practice.

When I try to describe an experience of deep meditation, language fails me. The moment I reach for words, something essential seems to slip away. The experience becomes less than what it was, reduced to concepts that only approximate its reality.

And yet, without language, how would we share anything of our inner worlds? How would wisdom pass from one mind to another?

Perhaps this is why poetry has always felt closer to truth than prose for me. Poetry doesn't pretend to capture reality fully—it gestures toward it, creating a space where meaning can emerge in the resonance between words.

In the Zen tradition, there's an understanding that truth lies "outside words and letters," yet words and letters are the very vehicles through which this understanding is transmitted. The finger pointing at the moon is not the moon, but without the finger, we might never look up.

I'm learning to hold this tension—to use words while remembering their limitations, to speak while honoring silence, to write while recognizing that the deepest truths lie in the spaces between sentences.`,
    tags: ["language", "meditation", "truth"]
  }
];

const FloatingLeaf = ({ delay }) => {
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

const ScripturesPage = () => {
  const [selectedPost, setSelectedPost] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    setIsVisible(true);
  }, []);

  const leaves = Array.from({ length: 8 }, (_, i) => (
    <FloatingLeaf key={i} delay={i * 1.5} />
  ));

  // Function to add a new scripture post (mock)
  const addScripture = (newPost) => {
    // In a real app, this would be an API call
    console.log("Adding new scripture post:", newPost);
    alert("In a real implementation, this would save your post to a database.");
    // You would typically redirect or update state here
  };

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
        <main className="max-w-6xl mx-auto px-6 py-12">
          {/* Back to Home */}
          <Link href="/">
            <div className="flex items-center text-gold-600 mb-16 hover:text-gold-700 transition-colors group cursor-pointer">
              <ArrowLeft size={16} className="mr-2" />
              <span className="relative">
                return to stillness
                <span className="absolute -bottom-1 left-0 w-full h-px bg-gold-600/30 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
              </span>
            </div>
          </Link>

          {selectedPost ? (
            <div className="space-y-8 animate-fadeIn">
              <button 
                onClick={() => setSelectedPost(null)}
                className="text-gold-600 hover:text-gold-700 transition-colors mb-8 flex items-center"
              >
                <ArrowLeft size={16} className="mr-2" />
                back to all writings
              </button>
              
              <div className="border-l-2 border-gold-600/30 pl-6">
                <h1 className="text-4xl font-light text-gray-900 mb-2">{selectedPost.title}</h1>
                <div className="flex items-center text-gold-600 text-sm mb-8">
                  <span>{selectedPost.date}</span>
                  <div className="flex items-center ml-6 space-x-2">
                    {selectedPost.tags.map(tag => (
                      <span key={tag} className="px-2 py-1 bg-gold-600/10 text-gold-600 rounded-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="prose prose-stone max-w-none">
                {selectedPost.content.split('\n\n').map((paragraph, i) => (
                  <p key={i} className="text-gray-700 leading-relaxed tracking-wide mb-6">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-end mb-16">
                <div className="space-y-6">
                  <div className="flex items-center space-x-3">
                    <Scroll className="text-gold-600" size={32} />
                    <h2 className="text-3xl font-light text-gray-900 tracking-wide">Scriptures</h2>
                  </div>
                  <p className="text-gray-700 max-w-2xl leading-relaxed">
                    Fragments of thought, moments of clarity, and whispers of wisdom—collected 
                    here as they emerge from the stillness.
                  </p>
                </div>
                
                <button 
                  onClick={() => {
                    // In a real app, this would open a form or modal
                    alert("In a real implementation, this would open a form to add a new writing.");
                  }}
                  className="group relative px-6 py-3 bg-gradient-to-r from-gold-600/10 to-transparent text-gold-600 overflow-hidden"
                >
                  <span className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-gold-600 to-transparent transform origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100"></span>
                  add new scripture
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {SCRIPTURE_POSTS.map((post) => (
                  <div 
                    key={post.id}
                    className="bg-white/50 backdrop-blur-sm border-l-2 border-gold-600/30 p-8 transition-all duration-300 hover:shadow-md cursor-pointer"
                    onClick={() => setSelectedPost(post)}
                  >
                    <h3 className="text-2xl font-light text-gray-900 mb-3">{post.title}</h3>
                    <div className="text-gold-600 text-sm mb-4">{post.date}</div>
                    <p className="text-gray-700 mb-6">{post.excerpt}</p>
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map(tag => (
                        <span key={tag} className="px-2 py-1 bg-gold-600/10 text-gold-600 rounded-sm text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="mt-4 text-gold-600 hover:text-gold-700 transition-colors text-sm">
                      read more →
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </main>

        {/* Footer */}
        <footer className="w-full py-6 text-center text-gray-600 text-sm bg-white/50 backdrop-blur-sm mt-24">
          <p>© 2024 · <span className="text-gold-600">crafted with intention</span></p>
        </footer>
      </div>
    </div>
  );
};

export default ScripturesPage;