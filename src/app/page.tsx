'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Palette, Brush, Sparkles } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

export default function Home() {
  const heroTextRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    // Set initial states
    gsap.set('.hero-char', { y: 100, opacity: 0.1 });
    gsap.set('.hero-subtitle', { y: 100, opacity: 0 });
    gsap.set('.hero-buttons', { y: 100, opacity: 0 });
    gsap.set('.product-image', { y: 100, opacity: 0.3 });

    // Create timeline
    const tl = gsap.timeline({ delay: 0.5 });

    // Animate hero text with split characters
    tl.to('.hero-char', {
      y: 0,
      opacity: 1,
      duration: 1.2,
      stagger: 0.03,
      ease: 'power3.out'
    });

    // Animate subtitle
    tl.to('.hero-subtitle', {
      y: 0,
      opacity: 1,
      duration: 1,
      ease: 'power3.out'
    }, '-=0.5');

    // Animate buttons
    tl.to('.hero-buttons', {
      y: 0,
      opacity: 1,
      duration: 0.8,
      ease: 'power3.out'
    }, '-=0.3');

    // Animate images with stagger from center
    tl.to('.product-image', {
      y: 0,
      opacity: 1,
      duration: 1.5,
      stagger: {
        from: 'center',
        amount: 0.8
      },
      ease: 'power3.out'
    }, '-=0.5');

  }, []);

  const splitText = (text: string) => {
    return text.split('').map((char, index) => (
      <span key={index} className="hero-char inline-block font-serif">
        {char === ' ' ? '\u00A0' : char}
      </span>
    ));
  };

  const handleGetStarted = () => {
    if (isLoaded) {
      if (user) {
        router.push('/artworks');
      } else {
        router.push('/auth/sign-in');
      }
    }
  };

  const handleBrowseGallery = () => {
    router.push('/artworks');
  };

  return (
    <div className="min-h-screen w-screen bg-neutral-50 relative overflow-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 py-4">
        <div className="max-w-7xl mx-auto px-6 py-4 bg-white/40 ring-8 ring-white/20 backdrop-blur-lg border rounded-full">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Palette className="h-8 w-8 text-black" />
              <span className="text-xl font-bold text-black font-serif">ArtSpace</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8 tracking-tighter">
              <a href="#" className="text-neutral-600 hover:text-black transition-colors">Home</a>
              <a href="/artworks" className="text-neutral-600 hover:text-black transition-colors">Gallery</a>
              <a href="/exhibitions" className="text-neutral-600 hover:text-black transition-colors">Exhibitions</a>
              <a href="/auctions" className="text-neutral-600 hover:text-black transition-colors">Auctions</a>
              <a href="#" className="text-neutral-600 hover:text-black transition-colors">About</a>
            </div>
            
            <Button onClick={handleGetStarted}>
              {user ? 'Dashboard' : 'Get Started'}
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section with Misty Background */}
      <div className="relative h-[70vh] flex items-center justify-center">
        {/* Misty Background - Takes full 70vh */}
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-200/60 via-neutral-100/40 to-transparent">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.9)_0%,transparent_70%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(163,163,163,0.2)_0%,transparent_50%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(212,212,212,0.3)_0%,transparent_60%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_80%,rgba(245,245,245,0.8)_0%,transparent_40%)]"></div>
        </div>

        <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
          <div ref={heroTextRef} className="mb-8">
            <h1 className="text-4xl md:text-6xl font-bold font-serif text-black mb-3 leading-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
              {splitText('Where Art Meets')}
              <br />
              {splitText('Opportunity.')}
            </h1>
          </div>
          
          <div ref={subtitleRef} className="hero-subtitle mb-6 tracking-tight">
            <p className="text-base text-neutral-700 mb-1">
              Discover, showcase, and sell your artwork in a vibrant community.
            </p>
            <p className="text-base text-neutral-600">
              Connect with collectors worldwide. No gallery fees. No boundaries.
            </p>
          </div>
          
          <div ref={buttonsRef} className="hero-buttons flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="flex items-center gap-2" onClick={handleGetStarted}>
              <span>{user ? 'Go to Dashboard' : 'Start Selling'}</span>
              <Brush className="h-4 w-4" />
            </Button>
            <Button variant="secondary" onClick={handleBrowseGallery}>
              Browse Gallery
            </Button>
          </div>
        </div>
      </div>

      {/* Artwork Images */}
      <div ref={imagesRef} className="relative z-10 w-full -mt-16">
        <div className="flex items-end justify-center space-x-2 md:space-x-3 px-4 max-w-none overflow-x-hidden">
          {/* Image 1 - Smallest */}
          <div className="product-image w-24 h-40 md:w-32 md:h-52 lg:w-36 lg:h-60 rounded-lg overflow-hidden shadow-lg flex-shrink-0">
            <img 
              src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop&crop=center"
              alt="Abstract Art"
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Image 2 - Small */}
          <div className="product-image w-32 h-52 md:w-40 md:h-64 lg:w-48 lg:h-80 rounded-lg overflow-hidden shadow-lg flex-shrink-0">
            <img 
              src="https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=600&fit=crop&crop=center"
              alt="Contemporary Art"
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Image 3 - Medium */}
          <div className="product-image w-40 h-64 md:w-52 md:h-84 lg:w-60 lg:h-96 rounded-lg overflow-hidden shadow-lg flex-shrink-0">
            <img 
              src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=600&fit=crop&crop=center"
              alt="Modern Sculpture"
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Image 4 - Largest (Center) */}
          <div className="product-image w-48 h-80 md:w-64 md:h-104 lg:w-72 lg:h-120 rounded-lg overflow-hidden shadow-xl flex-shrink-0">
            <img 
              src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=600&fit=crop&crop=center"
              alt="Featured Artwork"
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Image 5 - Medium */}
          <div className="product-image w-40 h-64 md:w-52 md:h-84 lg:w-60 lg:h-96 rounded-lg overflow-hidden shadow-lg flex-shrink-0">
            <img 
              src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=400&h=600&fit=crop&crop=center"
              alt="Digital Art"
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Image 6 - Small */}
          <div className="product-image w-32 h-52 md:w-40 md:h-64 lg:w-48 lg:h-80 rounded-lg overflow-hidden shadow-lg flex-shrink-0">
            <img 
              src="https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=600&fit=crop&crop=center"
              alt="Mixed Media"
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Image 7 - Smallest */}
          <div className="product-image w-24 h-40 md:w-32 md:h-52 lg:w-36 lg:h-60 rounded-lg overflow-hidden shadow-lg flex-shrink-0">
            <img 
              src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=600&fit=crop&crop=center"
              alt="Fine Art"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <div className="mt-24 mb-12 text-center">
        <p className="text-neutral-500 mb-8">Trusted by artists and collectors worldwide</p>
        <div className="flex justify-center items-center space-x-8 opacity-60">
          <div className="text-neutral-400 font-semibold">Artists</div>
          <div className="text-neutral-400 font-semibold">Collectors</div>
          <div className="text-neutral-400 font-semibold">Galleries</div>
          <div className="text-neutral-400 font-semibold">Museums</div>
          <div className="text-neutral-400 font-semibold">Curators</div>
        </div>
      </div>
    </div>
  );
}