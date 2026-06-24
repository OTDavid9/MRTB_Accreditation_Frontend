"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, BadgeCheck, Loader2 } from "lucide-react";

// ==========================================
// Reusable Components
// ==========================================
const FormInput = ({ 
  label, 
  placeholder, 
  name, 
  value, 
  onChange, 
  type = "text" 
}: { 
  label: string; 
  placeholder: string; 
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string; 
}) => (
  <div className="flex flex-col gap-1 w-full">
    <label className="text-[13px] font-bold text-gray-700 ml-1">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required
      className="w-full px-4 py-3 rounded-xl border-2 border-[#CDE1B4] focus:border-[#5D9C0E] outline-none transition-all bg-white/80 text-sm placeholder:text-gray-300"
    />
  </div>
);

const FormSelect = ({ 
  label, 
  name, 
  value, 
  onChange, 
  options,
  placeholder = "Select an option"
}: { 
  label: string; 
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { label: string; value: string }[]; 
  placeholder?: string;
}) => (
  <div className="flex flex-col gap-1 w-full">
    <label className="text-[13px] font-bold text-gray-700 ml-1">{label}</label>
    <div className="relative w-full">
      <select
        name={name}
        value={value}
        onChange={onChange}
        required
        className={`w-full px-4 py-3 rounded-xl border-2 border-[#CDE1B4] focus:border-[#5D9C0E] outline-none transition-all bg-white/80 text-sm appearance-none cursor-pointer ${value ? 'text-gray-900' : 'text-gray-400'}`}
        style={{ 
          backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%235D9C0E' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`, 
          backgroundRepeat: 'no-repeat', 
          backgroundPosition: 'right 1rem center', 
          backgroundSize: '1.2em' 
        }}
      >
        <option value="" disabled>{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="text-gray-900">
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  </div>
);

const SectionHeader = ({ title }: { title: string }) => (
  <div className="w-full flex justify-center mt-6 mb-3">
    <span className="bg-[#E9EFE3] text-gray-800 px-6 py-1.5 rounded-md text-[14px] font-bold uppercase tracking-wider border border-[#5D9C0E]/20">
      {title}
    </span>
  </div>
);

// ==========================================

export default function AcademicRegistrationFlow() {
  const router = useRouter();
  
  // View State: 'form' | 'success'
  const [currentView, setCurrentView] = useState<"form" | "success">("form");

  // Form State - Simplified for Academics
  const [formData, setFormData] = useState({
    institutionName: "",
    address: "",
    contactPerson: "",
    phoneNumber: "",
    email: "",
    purpose: "", 
    programme: "",
    date: new Date().toISOString().split("T")[0],
  });
  
  // Submission States
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingProfile, setIsFetchingProfile] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Fetch user data to pre-fill the form
  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');

      if (!token) {
        router.push('/auth/login');
        return;
      }

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/entity/profile`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, 
            'ngrok-skip-browser-warning': 'true'
          }
        });

        if (response.ok) {
          const data = await response.json();
          const profile = data.data || data; 

          setFormData(prev => ({
            ...prev,
            institutionName: profile.name || "",
            email: profile.email || "",
            phoneNumber: profile.phone || ""
          }));
        }
      } catch (error) {
        console.error("Failed to fetch profile for pre-fill:", error);
      } finally {
        setIsFetchingProfile(false);
      }
    };

    fetchUserProfile();
  }, [router]);

  // Form Handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Backend Submission
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    // Payload for Academics (No equipment list needed)
    const payload = { ...formData };

    try {
      const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
      if (!token) {
         throw new Error("Authentication error. Please log in again.");
      }

      // You might want to point this to a specific academic endpoint later, 
      // but keeping your standard pre-assessment route for now!
      const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/forms/pre-assessment`;
      
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, 
          "ngrok-skip-browser-warning": "true"
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to submit registration. Please try again.");
      }

      setCurrentView("success");
    } catch (error) {
      console.error("Submission Error:", error);
      setErrorMsg(error instanceof Error ? error.message : "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };


  if (isFetchingProfile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <Loader2 size={40} className="animate-spin text-[#5D9C0E]" />
      </div>
    );
  }

  // --- RENDER FORM ---
  if (currentView === "form") {
    return (
      <div className="min-h-screen bg-white font-sans pb-20 relative" style={{ fontFamily: "'Outfit', sans-serif" }}>
        <div 
          className="fixed inset-0 pointer-events-none flex items-center justify-center z-0 opacity-[0.04]"
          style={{ backgroundImage: "url('/logo.png')", backgroundRepeat: 'no-repeat', backgroundPosition: 'center', backgroundSize: '400px' }} 
        />

        <header className="flex items-center justify-between px-6 py-4 sticky top-0 bg-white/90 backdrop-blur-md z-20 shadow-[0_4px_20px_-5px_rgba(0,0,0,0.1)] border-b border-gray-100">
          <button className="text-gray-600 hover:text-gray-900 transition" onClick={() => window.history.back()} type="button">
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center justify-center">
            <img src="/logo.png" alt="Logo" className="h-10 w-auto object-contain" />
          </div>
          <div className="w-6" />
        </header>

        <main className="max-w-4xl mx-auto px-6 pt-6 relative z-10">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-1 uppercase tracking-tight">Academic Registration Form</h1>
            <p className="text-sm text-gray-500 font-medium">Kindly fill the form and confirm your details are entered correctly</p>
          </div>

          {errorMsg && (
            <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl mb-6 text-sm font-medium">
              {errorMsg}
            </div>
          )}

          <form className="space-y-1" onSubmit={handleFormSubmit}>
            <SectionHeader title="SECTION A: Institution's Information" />
           
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
              <FormInput label="Name of Institution" name="institutionName" value={formData.institutionName} onChange={handleInputChange} placeholder="Multi-Henry University" />
              <FormInput label="Address" name="address" value={formData.address} onChange={handleInputChange} placeholder="Type full address here" />
              <FormInput label="Contact person" name="contactPerson" value={formData.contactPerson} onChange={handleInputChange} placeholder="Prof. Samuel" />
              <FormInput label="Phone Number" name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} placeholder="+23470584837585" type="tel" />
              <FormInput label="Email Address" name="email" value={formData.email} onChange={handleInputChange} placeholder="example@gmail.com" type="email" />
              
              <FormSelect 
                label="Purpose of request" 
                name="purpose" 
                value={formData.purpose} 
                onChange={handleInputChange} 
                placeholder="Select request purpose"
                options={[
                  { label: "Pre-accreditation", value: "Pre-accreditation" },
                  { label: "Accreditation", value: "Accreditation" },
                ]} 
              />
              
              <FormSelect 
                label="Programme" 
                name="programme" 
                value={formData.programme} 
                onChange={handleInputChange} 
                placeholder="Select programme type"
                options={[
                  { label: "Doctors", value: "Doctors" },
                  { label: "Bachelors", value: "Bachelors" },
                  { label: "Diploma", value: "Diploma" },
                ]} 
              />
            </div>

            <SectionHeader title="SECTION B: Declaration" />
            <div className="space-y-4">
              <p className="text-[16px] md:text-[18px] text-gray-700 leading-tight italic font-bold">
                "I hereby declare that the information provided above is true and accurate to the best of my knowledge. 
                I understand that submission of false information may result in disqualification or revocation of accreditation."
              </p>
              <div className="w-full md:w-1/3">
                <label className="text-[13px] font-bold text-gray-700 ml-1">Date</label>
                <input 
                  type="date" 
                  name="date"
                  value={formData.date} 
                  onChange={handleInputChange}
                  className="w-full mt-1 px-4 py-3 rounded-xl border-2 border-[#CDE1B4] text-sm text-gray-600 outline-none font-semibold" 
                  required
                />
              </div>
            </div>

            <div className="flex justify-center pt-8">
              <button 
                type="submit" 
                disabled={isLoading}
                className="bg-[#5D9C0E] flex items-center justify-center gap-2 hover:bg-[#4a7c0b] text-white px-20 py-3 rounded-full font-bold text-sm shadow-lg transition-all transform hover:scale-[1.02] active:scale-100 disabled:opacity-70 disabled:hover:scale-100"
              >
                {isLoading ? <><Loader2 size={18} className="animate-spin" /> Submitting...</> : "Submit Application"}
              </button>
            </div>
          </form>
        </main>
      </div>
    );
  }

  // --- RENDER COMPACT SUCCESS MODAL ---
  if (currentView === "success") {
    return (
      <div className="min-h-screen bg-[#E5E5E5] flex items-center justify-center p-4 font-sans" style={{ fontFamily: "'Outfit', sans-serif" }}>
        <div className="bg-white/95 rounded-2xl p-6 md:p-8 flex flex-col items-center max-w-[300px] w-full shadow-lg animate-in zoom-in-95 duration-300">
          <div className="mb-2 text-[#3BAA54]">
            <BadgeCheck size={64} fill="#3BAA54" stroke="white" strokeWidth={1} />
          </div>
          <h2 className="text-[#3BAA54] text-[20px] font-bold mb-4">Successful</h2>
          <button
            type="button"
            onClick={() => {
              router.push("/dashboard?status=under_review");
            }}
            className="w-full py-2.5 rounded-full border border-gray-300 text-[#5D9C0E] font-bold text-sm hover:bg-gray-50 transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return null;
}
