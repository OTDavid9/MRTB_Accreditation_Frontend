"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowUpRight,
  MessageCircle 
} from 'lucide-react';

const Footer = () => {
  // Brand Color Palette
  const accentYellow = "#d8f22f";
  const deeperGreen = "#5e9900"; 
  const overColor = "#1b1e15";   

  const footerLinks = {
    quickLinks: [
      { name: 'Home', href: '/' },
      { name: 'About MRTB', href: '/about' },
      { name: 'Board Members', href: '/board' },
      { name: 'News & Updates', href: '/news' },
    ],
    services: [
      { name: 'Registration', href: '/registration' },
      { name: 'Accreditation', href: '/accreditation' },
      { name: 'Verification', href: '/verify' },
      { name: 'CPD Programs', href: '/cpd' },
    ],
    legal: [
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
      { name: 'FOI Act', href: '/foi' },
    ]
  };

  const SocialIcons = [
    { 
      name: 'X', 
      href: '#', 
      path: <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" /> 
    },
    { 
      name: 'Instagram', 
      href: '#', 
      path: <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></g> 
    },
    { 
      name: 'Facebook', 
      href: '#', 
      path: <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/> 
    },
    { 
      name: 'WhatsApp', 
      href: '#', 
      icon: <MessageCircle size={18} strokeWidth={1.5} /> 
    }
  ];

  return (
    // Increased pt-12 to pt-24
    <footer style={{ backgroundColor: deeperGreen }} className="text-white pt-24 border-t border-white/10">
      {/* Added pb-20 to the main container */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pb-20">
        
        {/* TOP SECTION - 4 Columns */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-12">
          
          {/* COLUMN 1: BRANDING */}
          <div className="col-span-2 md:col-span-1 space-y-6">
            <Link href="/" className="flex items-center gap-4 group">
              <div className="bg-white p-2 rounded-full w-16 h-16 flex items-center justify-center overflow-hidden shadow-xl transition-transform group-hover:scale-105">
                <Image 
                  src="/logo.png" 
                  alt="MRTB Logo" 
                  width={54} 
                  height={54} 
                  className="object-contain"
                  style={{ height: 'auto' }}
                />
              </div>
              <div className="flex flex-col">
                <span className="text-white font-bold text-2xl leading-none tracking-tight">
                  MRTB Nigeria
                </span>
                <span className="text-[9px] text-white/70 uppercase tracking-[0.2em] font-medium mt-2">
                  Medical Rehabilitation Board
                </span>
              </div>
            </Link>
          </div>

          {/* COLUMN 2: QUICK LINKS */}
          <div className="space-y-6">
            <h4 className="text-white font-bold text-[13px] uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: accentYellow }}></span>
              Explore
            </h4>
            {/* Increased space-y-2 to space-y-5 */}
            <ul className="space-y-5">
              {footerLinks.quickLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-[14px] text-white/80 hover:text-white hover:translate-x-1 flex items-center gap-2 transition-all group">
                    {link.name} <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* COLUMN 3: PORTALS */}
          <div className="space-y-6">
            <h4 className="text-white font-bold text-[13px] uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: accentYellow }}></span>
              Portals
            </h4>
            <ul className="space-y-5">
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-[14px] text-white/80 hover:text-white hover:translate-x-1 flex items-center gap-2 transition-all group">
                    {link.name} <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* COLUMN 4: LEGAL */}
          <div className="space-y-6">
            <h4 className="text-white font-bold text-[13px] uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: accentYellow }}></span>
              Legal
            </h4>
            <ul className="space-y-5">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-[14px] text-white/80 hover:text-white hover:translate-x-1 flex items-center gap-2 transition-all group">
                    {link.name} <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* BOTTOM SECTION: INCREASED HEIGHT */}
      {/* Changed py-3 to py-10 */}
      <div style={{ backgroundColor: overColor }} className="py-10 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          
          <p className="text-[11px] uppercase tracking-widest font-medium text-white/40">
            &copy; {new Date().getFullYear()} MRTB Nigeria. All Rights Reserved.
          </p>

          {/* SOCIAL MEDIA LINKS */}
          <div className="flex gap-8 items-center">
            {SocialIcons.map((social) => (
              <Link 
                key={social.name} 
                href={social.href} 
                className="text-white/40 hover:text-[#8dc63f] transition-all hover:scale-110"
                aria-label={social.name}
              >
                {social.icon ? (
                  social.icon
                ) : (
                  <svg 
                    width="20" 
                    height="20" 
                    viewBox="0 0 24 24" 
                    fill="currentColor" 
                  >
                    {social.path}
                  </svg>
                )}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;