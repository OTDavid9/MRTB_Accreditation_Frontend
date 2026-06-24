"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';
import Hero from '@/app/components/Banner';
import Footer from '@/app/components/Footer';

export default function Home() {
  // Color Palette
  const deeperGreen = "#5e9900";
  const overColor = "#1b1e15";
  const innerNewsBg = "#7ead33";
  const innerNewsBorder = "#1b1e15";

  // Animation Variants
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.8, ease: "easeOut" }
  } as const; 

  return (
    <div className="flex flex-col min-h-screen bg-white font-sans overflow-x-hidden">
      
      <Hero />

      <main className="w-full max-w-6xl mx-auto px-6 py-12 md:py-20 space-y-12 md:space-y-32">
        
        {/* SECTION 1: FACILITY ASSESSMENT */}
        <motion.section 
          initial={fadeInUp.initial}
          whileInView={fadeInUp.whileInView}
          viewport={fadeInUp.viewport}
          transition={fadeInUp.transition}
          className="flex flex-col md:flex-row items-center gap-12 lg:gap-20"
        >
          <div className="w-full md:w-1/2 relative group">
            <div className="rounded-[32px] overflow-hidden shadow-xl transition-transform duration-500 group-hover:scale-[1.02]">
              <img 
                src="/bb1.jpg" 
                alt="Facility Assessment" 
                className="w-full h-auto object-cover" 
              />
            </div>
            
            <motion.div 
              initial={{ scale: 0, rotate: -30 }}
              whileInView={{ scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
              style={{ backgroundColor: deeperGreen }}
              className="absolute -bottom-8 -right-4 p-4 rounded-full border-[6px] border-white shadow-xl z-10"
            >
              <ShieldCheck className="text-white" size={38} strokeWidth={2.5} />
            </motion.div>
          </div>

          <div className="w-full md:w-1/2 space-y-5">
            <h2 style={{ color: overColor }} className="text-2xl md:text-3xl font-bold tracking-tight">
              Facility Assessment
            </h2>
            <div className="space-y-4 text-slate-600 leading-relaxed text-sm md:text-base font-medium">
              <p>
                Your environment matters as much as your expertise. MRTB evaluates your facility to ensure it meets required standards for safety, hygiene, equipment, and operational readiness.
              </p>
              <p>
                From infrastructure to essential tools, every detail is assessed to confirm your center is fully equipped to deliver quality radiography services in line with national regulations.
              </p>
            </div>
          </div>
        </motion.section>

        {/* SECTION 2: STAFF VERIFICATION */}
        <motion.section 
          initial={fadeInUp.initial}
          whileInView={fadeInUp.whileInView}
          viewport={fadeInUp.viewport}
          transition={fadeInUp.transition}
          className="flex flex-col md:flex-row-reverse items-center gap-12 lg:gap-20"
        >
          <div className="w-full md:w-1/2 relative group">
            <div className="rounded-[32px] overflow-hidden shadow-xl transition-transform duration-500 group-hover:scale-[1.02]">
              <img 
                src="/bb2.jpg" 
                alt="Staff Verification" 
                className="w-full h-auto object-cover" 
              />
            </div>

            <motion.div 
              initial={{ scale: 0, rotate: 30 }}
              whileInView={{ scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
              style={{ backgroundColor: deeperGreen }}
              className="absolute -bottom-8 -left-4 p-4 rounded-full border-[6px] border-white shadow-xl z-10"
            >
              <ShieldCheck className="text-white" size={38} strokeWidth={2.5} />
            </motion.div>
          </div>

          <div className="w-full md:w-1/2 space-y-5">
            <h2 style={{ color: overColor }} className="text-2xl md:text-3xl font-bold tracking-tight">
              Staff Verification
            </h2>
            <div className="space-y-4 text-slate-600 leading-relaxed text-sm md:text-base font-medium">
              <p>
                Ensure your team meets the highest standards of professional competence. MRTB conducts a thorough review of all personnel, validating qualifications, certifications, and relevant experience.
              </p>
              <p>
                This process guarantees that only skilled, licensed, and ethical practitioners are responsible for patient care, reinforcing trust and accountability across your facility.
              </p>
            </div>
          </div>
        </motion.section>

        {/* SECTION 3: LATEST MRTB NEWS */}
        <motion.section 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="pt-4 md:pt-10"
        >
          <div 
            style={{ backgroundColor: deeperGreen }} 
            className="rounded-[40px] p-8 md:p-12 shadow-2xl"
          >
            <h2 className="text-white text-xl md:text-2xl font-bold text-center mb-10 tracking-tight">
              Latest MRTB News
            </h2>
            
            <div className="space-y-4">
              <div 
                style={{ backgroundColor: innerNewsBg, borderColor: innerNewsBorder }} 
                className="border rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-12 transition-all duration-300 cursor-pointer group hover:!bg-[#1b1e15]"
              >
                <span className="text-white font-bold text-sm md:text-base shrink-0 group-hover:text-[#8dc63f] transition-colors">
                  30.05.2025
                </span>
                <p className="text-white font-semibold text-sm md:text-base leading-snug">
                  Nigeria Embarks on Major Medical Rehabilitation Reform with Backing from Minister, WHO
                </p>
              </div>

              <div 
                style={{ backgroundColor: innerNewsBg, borderColor: innerNewsBorder }} 
                className="border rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-12 transition-all duration-300 cursor-pointer group hover:!bg-[#1b1e15]"
              >
                <span className="text-white font-bold text-sm md:text-base shrink-0 group-hover:text-[#8dc63f] transition-colors">
                  05.02.2025
                </span>
                <p className="text-white font-semibold text-sm md:text-base leading-snug">
                  MRTB 2025 Clinical Pathway Training - Preliminary Level
                </p>
              </div>
            </div>
          </div>
        </motion.section>

      </main>

      <Footer />
    </div>
  );
}