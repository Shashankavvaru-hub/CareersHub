"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion, Variants } from 'motion/react';
import { ArrowRight, LayoutTemplate, Zap, Shield, Search, Smartphone, CheckCircle } from 'lucide-react';
import SpinningBorderButton from '@/components/ui/spinning-border-button';

const handleWordEnter = (e: React.MouseEvent<HTMLSpanElement>) => {
  e.currentTarget.style.textShadow = '0 0 20px rgba(203, 213, 225, 0.5)';
};

const handleWordLeave = (e: React.MouseEvent<HTMLSpanElement>) => {
  e.currentTarget.style.textShadow = 'none';
};

const Word = ({ children, delay, className = "" }: { children: React.ReactNode, delay: number, className?: string }) => (
  <span 
    className={`word-animate ${className}`} 
    data-delay={delay}
    onMouseEnter={handleWordEnter}
    onMouseLeave={handleWordLeave}
    style={{ animation: `word-appear 0.8s ease-out forwards ${delay}ms` }}
  >
    {children}
  </span>
);

export default function DigitalSerenity() {
  const gradientRef = useRef<HTMLDivElement>(null);
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);
  const [scrolled, setScrolled] = useState(false);
  const floatingElementsRef = useRef<(HTMLDivElement | null)[]>([]);
  
  const prefersReducedMotion = useReducedMotion();

  // Track mouse without re-rendering using Ref
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (gradientRef.current) {
        gradientRef.current.style.left = `${e.clientX}px`;
        gradientRef.current.style.top = `${e.clientY}px`;
        gradientRef.current.style.opacity = '1';
      }
    };
    const handleMouseLeave = () => {
      if (gradientRef.current) {
        gradientRef.current.style.opacity = '0';
      }
    };
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  // Global click for ripples
  useEffect(() => {
    if (prefersReducedMotion) return;
    const handleClick = (e: MouseEvent) => {
      if ((e.target as HTMLElement).tagName === 'A' || (e.target as HTMLElement).closest('a') || (e.target as HTMLElement).closest('button')) return;
      
      const newRipple = { id: Date.now(), x: e.clientX, y: e.clientY };
      setRipples(prev => [...prev, newRipple]);
      setTimeout(() => setRipples(prev => prev.filter(r => r.id !== newRipple.id)), 1000);
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [prefersReducedMotion]);

  // Handle Scroll for floating elements
  useEffect(() => {
    const handleScroll = () => {
      if (!scrolled) {
        setScrolled(true);
        floatingElementsRef.current.forEach((el, index) => {
          if (el) {
            setTimeout(() => {
              el.style.animationPlayState = 'running';
              el.style.opacity = '1'; 
            }, (parseFloat(el.style.animationDelay || "0") * 1000) + index * 100);
          }
        });
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  const pageStyles = `
    #mouse-gradient-react {
      position: fixed;
      pointer-events: none;
      border-radius: 9999px;
      background-image: radial-gradient(circle, rgba(156, 163, 175, 0.05), rgba(107, 114, 128, 0.05), transparent 70%);
      transform: translate(-50%, -50%);
      will-change: left, top, opacity;
      transition: opacity 300ms ease-out;
      opacity: 0;
      z-index: 10;
    }
    @keyframes word-appear { 
      0% { opacity: 0; transform: translateY(30px) scale(0.8); filter: blur(10px); } 
      50% { opacity: 0.8; transform: translateY(10px) scale(0.95); filter: blur(2px); } 
      100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); } 
    }
    @keyframes grid-draw { 0% { stroke-dashoffset: 1000; opacity: 0; } 50% { opacity: 0.3; } 100% { stroke-dashoffset: 0; opacity: 0.15; } }
    @keyframes pulse-glow { 0%, 100% { opacity: 0.1; transform: scale(1); } 50% { opacity: 0.3; transform: scale(1.1); } }
    .word-animate { display: inline-block; opacity: 0; margin: 0 0.1em; transition: color 0.3s ease, transform 0.3s ease; }
    .word-animate:hover { color: #cbd5e1; transform: translateY(-2px); }
    .grid-line { stroke: #94a3b8; stroke-width: 0.5; opacity: 0; stroke-dasharray: 5 5; stroke-dashoffset: 1000; animation: grid-draw 2s ease-out forwards; }
    .detail-dot { fill: #cbd5e1; opacity: 0; animation: pulse-glow 3s ease-in-out infinite; }
    .corner-element-animate { position: absolute; width: 40px; height: 40px; border: 1px solid rgba(203, 213, 225, 0.2); opacity: 0; animation: word-appear 1s ease-out forwards; }
    .text-decoration-animate { position: relative; }
    .text-decoration-animate::after { content: ''; position: absolute; bottom: -4px; left: 0; width: 0; height: 1px; background: linear-gradient(90deg, transparent, #cbd5e1, transparent); animation: underline-grow 2s ease-out forwards; animation-delay: 2s; }
    @keyframes underline-grow { to { width: 100%; } }
    .floating-element-animate { position: absolute; width: 2px; height: 2px; background: #cbd5e1; border-radius: 50%; opacity: 0; animation: float 4s ease-in-out infinite; animation-play-state: paused; }
    @keyframes float { 0%, 100% { transform: translateY(0) translateX(0); opacity: 0.2; } 25% { transform: translateY(-10px) translateX(5px); opacity: 0.6; } 50% { transform: translateY(-5px) translateX(-3px); opacity: 0.4; } 75% { transform: translateY(-15px) translateX(7px); opacity: 0.8; } }
    @keyframes float-particle { 0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0.1; } 50% { transform: translateY(-30px) translateX(15px); opacity: 0.4; } }
    .bg-particle { position: absolute; background: #cbd5e1; border-radius: 50%; animation: float-particle 10s infinite ease-in-out; }
    .ripple-effect { position: fixed; width: 4px; height: 4px; background: rgba(203, 213, 225, 0.6); border-radius: 50%; transform: translate(-50%, -50%); pointer-events: none; animation: pulse-glow 1s ease-out forwards; z-index: 9999; }
  `;

  // Animation variants
  const fadeIn: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } }
  };
  
  const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  return (
    <>
      <style>{pageStyles}</style>
      <div className="bg-gradient-to-br from-slate-900 via-black to-slate-800 text-slate-100 font-sans overflow-x-hidden relative">
        
        {/* --- SECTION 1: HERO --- */}
        <section className="relative min-h-screen flex flex-col justify-between items-center px-6 py-10 sm:px-8 sm:py-12 md:px-16 md:py-20">
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40 mix-blend-screen" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <defs>
              <pattern id="gridReactDarkResponsive" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(100, 116, 139, 0.1)" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#gridReactDarkResponsive)" />
            <line x1="0" y1="20%" x2="100%" y2="20%" className="grid-line" style={{ animationDelay: '0.5s' }} />
            <line x1="0" y1="80%" x2="100%" y2="80%" className="grid-line" style={{ animationDelay: '1s' }} />
            <line x1="20%" y1="0" x2="20%" y2="100%" className="grid-line" style={{ animationDelay: '1.5s' }} />
            <line x1="80%" y1="0" x2="80%" y2="100%" className="grid-line" style={{ animationDelay: '2s' }} />
            <circle cx="20%" cy="20%" r="2" className="detail-dot" style={{ animationDelay: '3s' }} />
            <circle cx="80%" cy="20%" r="2" className="detail-dot" style={{ animationDelay: '3.2s' }} />
            <circle cx="20%" cy="80%" r="2" className="detail-dot" style={{ animationDelay: '3.4s' }} />
            <circle cx="80%" cy="80%" r="2" className="detail-dot" style={{ animationDelay: '3.6s' }} />
          </svg>

          {/* Corner Elements */}
          <div className="corner-element-animate top-4 left-4 sm:top-6 sm:left-6 md:top-8 md:left-8" style={{ animationDelay: '4s' }}>
            <div className="absolute top-0 left-0 w-2 h-2 bg-slate-300 opacity-30 rounded-full"></div>
          </div>
          <div className="corner-element-animate top-4 right-4 sm:top-6 sm:right-6 md:top-8 md:right-8" style={{ animationDelay: '4.2s' }}>
            <div className="absolute top-0 right-0 w-2 h-2 bg-slate-300 opacity-30 rounded-full"></div>
          </div>
          <div className="corner-element-animate bottom-4 left-4 sm:bottom-6 sm:left-6 md:bottom-8 md:left-8" style={{ animationDelay: '4.4s' }}>
            <div className="absolute bottom-0 left-0 w-2 h-2 bg-slate-300 opacity-30 rounded-full"></div>
          </div>
          <div className="corner-element-animate bottom-4 right-4 sm:bottom-6 sm:right-6 md:bottom-8 md:right-8" style={{ animationDelay: '4.6s' }}>
            <div className="absolute bottom-0 right-0 w-2 h-2 bg-slate-300 opacity-30 rounded-full"></div>
          </div>

          <div className="floating-element-animate" ref={(el) => { floatingElementsRef.current[0] = el; }} style={{ top: '25%', left: '15%', animationDelay: '0.5s' }}></div>
          <div className="floating-element-animate" ref={(el) => { floatingElementsRef.current[1] = el; }} style={{ top: '60%', left: '85%', animationDelay: '1s' }}></div>
          <div className="floating-element-animate" ref={(el) => { floatingElementsRef.current[2] = el; }} style={{ top: '40%', left: '10%', animationDelay: '1.5s' }}></div>
          <div className="floating-element-animate" ref={(el) => { floatingElementsRef.current[3] = el; }} style={{ top: '75%', left: '90%', animationDelay: '2s' }}></div>

          <div className="text-center w-full flex justify-between items-center relative z-20">
            <h2 className="text-xs sm:text-sm font-mono font-light text-slate-300 tracking-[0.2em] flex gap-2">
              <span className="font-bold text-white tracking-widest font-playfair uppercase">Whitecarrot</span>
            </h2>
            <div className="flex gap-4">
              <Link href="/login" className="text-sm font-mono tracking-wider opacity-80 hover:opacity-100 transition-colors">
                SIGN IN
              </Link>
            </div>
          </div>

          <div className="text-center max-w-5xl mx-auto relative z-20 flex flex-col items-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-extralight leading-tight tracking-tight text-slate-50">
              <div className="mb-4 md:mb-6">
                <Word delay={700}>Build</Word>
                <Word delay={850}>your</Word>
                <Word delay={1000}>careers</Word>
                <Word delay={1150}>page,</Word>
              </div>
              <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-thin text-slate-300 leading-relaxed tracking-wide text-decoration-animate">
                <Word delay={1400}>where</Word>
                <Word delay={1550}>talent</Word>
                <Word delay={1700}>connects</Word>
                <Word delay={1850}>and</Word>
                <Word delay={2000}>culture</Word>
                <Word delay={2150}>awakens</Word>
                <Word delay={2300}>within</Word>
                <Word delay={2450}>the</Word>
                <Word delay={2600}>brand.</Word>
              </div>
            </h1>
            
            <div className="mt-12 opacity-0" style={{ animation: 'word-appear 1s ease-out forwards', animationDelay: '3s' }}>
              <Link href="/dashboard" className="group relative inline-flex items-center gap-2 px-8 py-3 rounded-full bg-slate-100 text-slate-900 font-medium tracking-wide hover:bg-white transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:-translate-y-1">
                Start Building Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          <div className="text-center relative z-20 pb-12">
            <div className="mb-4 w-12 sm:w-16 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent opacity-30 mx-auto"></div>
            <h2 className="text-xs sm:text-sm font-mono font-light text-slate-300 uppercase tracking-[0.2em] opacity-80">
              <Word delay={3000}>Attract.</Word>
              <Word delay={3200}>Engage.</Word>
              <Word delay={3400}>Hire.</Word>
            </h2>
            <div className="mt-6 flex justify-center space-x-4 opacity-0" style={{ animation: 'word-appear 1s ease-out forwards', animationDelay: '4.2s' }}>
              <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }} className="w-1 h-1 bg-slate-300 rounded-full opacity-40"></motion.div>
              <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2, delay: 0.2, ease: "easeInOut" }} className="w-1 h-1 bg-slate-300 rounded-full opacity-60"></motion.div>
              <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2, delay: 0.4, ease: "easeInOut" }} className="w-1 h-1 bg-slate-300 rounded-full opacity-40"></motion.div>
            </div>
          </div>
        </section>

        {/* --- PARTICLES CONTAINER FOR SECTIONS 2, 3, 4 --- */}
        <div className="relative">
          <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            {[
              { top: '10%', left: '15%', size: 'w-1 h-1', delay: '0s', duration: '12s' },
              { top: '25%', left: '85%', size: 'w-2 h-2', delay: '2s', duration: '15s' },
              { top: '40%', left: '20%', size: 'w-1 h-1', delay: '1s', duration: '10s' },
              { top: '55%', left: '75%', size: 'w-1.5 h-1.5', delay: '4s', duration: '18s' },
              { top: '70%', left: '10%', size: 'w-1 h-1', delay: '3s', duration: '14s' },
              { top: '85%', left: '80%', size: 'w-2 h-2', delay: '5s', duration: '20s' },
              { top: '95%', left: '30%', size: 'w-1 h-1', delay: '1.5s', duration: '11s' },
              { top: '15%', left: '50%', size: 'w-1 h-1', delay: '2.5s', duration: '13s' },
              { top: '65%', left: '45%', size: 'w-1.5 h-1.5', delay: '0.5s', duration: '16s' },
            ].map((p, i) => (
              <div 
                key={i}
                className={`bg-particle ${p.size}`}
                style={{ top: p.top, left: p.left, animationDelay: p.delay, animationDuration: p.duration }}
              />
            ))}
          </div>

          <div className="relative z-10">

            {/* --- SECTION 2: DEMO LINKS --- */}
            <section className="relative py-24 px-6 md:px-12 lg:px-24 bg-black/40 backdrop-blur-sm border-t border-white/5">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="max-w-6xl mx-auto"
          >
            <motion.div variants={fadeIn} className="text-center mb-16">
              <h3 className="text-3xl md:text-4xl font-light mb-4">See it in action</h3>
              <p className="text-slate-400 max-w-2xl mx-auto">Explore live careers pages built with our platform. Clean, responsive, and ready for candidates.</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { name: 'Acme Technologies', role: 'Tech Startup', slug: 'acme-technologies', color: 'from-slate-200/20 to-slate-400/10', border: 'hover:border-slate-300/50' },
                { name: 'Orbit Systems', role: 'Enterprise', slug: 'orbit-systems', color: 'from-slate-200/20 to-slate-400/10', border: 'hover:border-slate-300/50' },
                { name: 'Nova Labs', role: 'Creative Agency', slug: 'nova-labs', color: 'from-slate-200/20 to-slate-400/10', border: 'hover:border-slate-300/50' },
              ].map((demo, i) => (
                <Link href={`/${demo.slug}/careers`} key={i}>
                  <motion.div variants={fadeIn} className="group cursor-pointer h-full">
                    <div className={`p-8 rounded-2xl h-full bg-slate-100/10 border border-slate-300/30 ${demo.border} transition-all duration-500 hover:bg-slate-200/10 hover:-translate-y-2 hover:shadow-[0_0_40px_rgba(255,255,255,0.15)] relative overflow-hidden`}>
                      <div className={`absolute inset-0 bg-gradient-to-br ${demo.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                      <div className="relative z-10 flex flex-col h-full">
                        <LayoutTemplate className="w-8 h-8 text-slate-200 mb-6 group-hover:text-white transition-colors" />
                        <h4 className="text-xl font-medium mb-1 text-white">{demo.name}</h4>
                        <p className="text-slate-300 text-sm mb-6">{demo.role}</p>
                        <div className="mt-auto flex items-center justify-start transition-opacity duration-300">
                          <SpinningBorderButton>View Demo</SpinningBorderButton>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </motion.div>
        </section>

        {/* --- SECTION 3: HOW IT WORKS --- */}
        <section className="relative py-24 px-6 md:px-12 lg:px-24">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="max-w-5xl mx-auto"
          >
            <motion.div variants={fadeIn} className="text-center mb-20">
              <h3 className="text-3xl md:text-5xl font-light mb-6">From zero to live in <span className="font-medium text-slate-100">minutes</span></h3>
              <p className="text-slate-400 text-lg">No coding required. Just your brand and your open roles.</p>
            </motion.div>

            <div className="flex flex-col md:flex-row gap-8 lg:gap-12 relative">
              <div className="hidden md:block absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-y-1/2 z-0"></div>
              
              {[
                { step: '01', title: 'Set your brand', desc: 'Upload your logo and pick your colors. The page automatically adapts to match your identity.' },
                { step: '02', title: 'Add content', desc: 'Drag and drop pre-built sections for Culture, About Us, Benefits, and automatically synced Jobs.' },
                { step: '03', title: 'Save, preview, then publish', desc: 'Work safely in draft mode, preview your changes, and push them live with a single click.' }
              ].map((item, i) => (
                <motion.div key={i} variants={fadeIn} className="flex-1 relative z-10">
                  <div className="bg-slate-900/80 backdrop-blur-md border border-white/10 p-8 rounded-3xl text-center transition-all duration-500 hover:border-slate-500/50 hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(255,255,255,0.05)] group">
                    <div className="w-16 h-16 mx-auto bg-slate-800 text-slate-300 rounded-full flex items-center justify-center text-xl font-mono font-bold mb-6 group-hover:bg-slate-700 group-hover:text-white transition-colors shadow-[0_0_15px_rgba(255,255,255,0.05)] group-hover:shadow-[0_0_25px_rgba(255,255,255,0.15)] group-hover:scale-110">
                      {item.step}
                    </div>
                    <h4 className="text-xl font-medium mb-3">{item.title}</h4>
                    <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* --- SECTION 4: FEATURES GRID --- */}
        <section className="relative py-24 px-6 md:px-12 lg:px-24 bg-black/40 backdrop-blur-sm border-t border-white/5">
           <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="max-w-6xl mx-auto"
          >
            <motion.div variants={fadeIn} className="mb-16 text-center">
              <h3 className="text-3xl md:text-4xl font-light mb-4">Everything you need</h3>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: Smartphone, title: 'Mobile First', desc: 'Pages look incredible on every device, from massive desktop monitors to the smallest smartphones.' },
                { icon: Zap, title: 'Lightning Fast', desc: 'Optimized delivery ensures your page loads instantly, reducing candidate drop-off rates.' },
                { icon: Search, title: 'SEO Ready', desc: 'Automatically generated metadata and semantic HTML means your jobs get found on Google.' },
                { icon: Shield, title: 'Secure & Isolated', desc: 'Enterprise-grade multi-tenant architecture keeps your company data strictly isolated.' },
                { icon: LayoutTemplate, title: 'Beautiful Sections', desc: 'High-converting layouts for Culture, Jobs, and Media, designed by industry experts.' },
                { icon: CheckCircle, title: 'Drafts & Previews', desc: 'Work safely in draft mode. Only publish when you are 100% happy with how it looks.' },
              ].map((feat, i) => (
                <motion.div key={i} variants={fadeIn} className="p-6 rounded-2xl bg-white/5 border border-white/5 transition-all duration-500 hover:bg-white/10 hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(255,255,255,0.05)] hover:border-slate-500/30 group">
                  <feat.icon className="w-6 h-6 text-slate-300 mb-4 group-hover:scale-110 transition-transform" />
                  <h4 className="text-lg font-medium mb-2">{feat.title}</h4>
                  <p className="text-slate-400 text-sm leading-relaxed">{feat.desc}</p>
                </motion.div>
              ))}
            </div>

            <motion.div variants={fadeIn} className="mt-24 text-center pb-12 border-b border-white/10">
               <h3 className="text-4xl md:text-5xl font-extralight mb-8">Ready to transform your hiring?</h3>
               <Link href="/dashboard" className="inline-flex items-center gap-2 px-10 py-4 rounded-full bg-slate-100 text-slate-900 font-semibold tracking-wide hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:scale-105 hover:bg-white transition-all duration-300">
                Create Your Page
              </Link>
            </motion.div>

            <div className="mt-12 text-center text-sm text-slate-500 flex flex-col md:flex-row justify-between items-center gap-4">
              <p>© 2026 Whitecarrot Careers. All rights reserved.</p>
              <div className="flex gap-6">
                <Link href="#" className="hover:text-slate-300 transition-colors">Privacy</Link>
                <Link href="#" className="hover:text-slate-300 transition-colors">Terms</Link>
              </div>
            </div>
          </motion.div>
        </section>
          </div>
        </div>


        {/* Responsive Mouse Gradient Size & Blur */}
        <div 
          id="mouse-gradient-react"
          ref={gradientRef}
          className="w-60 h-60 blur-xl sm:w-80 sm:h-80 sm:blur-2xl md:w-96 md:h-96 md:blur-3xl"
        ></div>

      </div>
    </>
  );
}
