"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, Plus, X, Camera, Upload, Image as ImageIcon, Check, BadgeCheck, Loader2
} from "lucide-react";

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

const SectionHeader = ({ title }: { title: string }) => (
  <div className="w-full flex justify-center mt-6 mb-3">
    <span className="bg-[#E9EFE3] text-gray-800 px-6 py-1.5 rounded-md text-[14px] font-bold uppercase tracking-wider border border-[#5D9C0E]/20">
      {title}
    </span>
  </div>
);
// ==========================================


export default function ClinicalRegistrationFlow() {
  const router = useRouter();
  
  // View State: 'form' | 'success'
  const [currentView, setCurrentView] = useState<"form" | "success">("form");

  // Form State - Specific to Clinical
  const [formData, setFormData] = useState({
    institutionName: "",
    address: "",
    contactPerson: "",
    phoneNumber: "",
    email: "",
    clinicalStaff: "",
    adminStaff: "",
    offices: "",
    conveniences: "",
    treatmentRooms: "",
    otherFacility: "",
    date: new Date().toISOString().split("T")[0],
  });

  const [equipmentFields, setEquipmentFields] = useState([{ name: "", image: null as string | null }]);
  const [activeModalIndex, setActiveModalIndex] = useState<number | null>(null);
  const [stagedImage, setStagedImage] = useState<string | null>(null);
  
  // Submission States
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingProfile, setIsFetchingProfile] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

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

  // Equipment List Handlers
  const addMoreEquipment = () => {
    setEquipmentFields([...equipmentFields, { name: "", image: null }]);
  };

  const removeEquipmentField = (index: number) => {
    if (equipmentFields.length > 1) {
      setEquipmentFields(equipmentFields.filter((_, i) => i !== index));
    } else {
      setEquipmentFields([{ name: "", image: null }]);
    }
  };

  const handleEquipmentChange = (index: number, value: string) => {
    const updatedFields = [...equipmentFields];
    updatedFields[index].name = value;
    setEquipmentFields(updatedFields);
  };

  // Image Upload Handlers
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setStagedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleConfirmImage = () => {
    if (activeModalIndex !== null && stagedImage) {
      const updatedFields = [...equipmentFields];
      updatedFields[activeModalIndex].image = stagedImage;
      setEquipmentFields(updatedFields);
      closeModal();
    }
  };

  const closeModal = () => {
    setActiveModalIndex(null);
    setStagedImage(null);
  };

  // Backend Submission
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    const payload = {
      ...formData,
      equipments: equipmentFields.filter(eq => eq.name.trim() !== "")
    };

    try {
      const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
      if (!token) {
         throw new Error("Authentication error. Please log in again.");
      }

      // Pointing to your unified pre-assessment endpoint
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
            <h1 className="text-2xl font-bold text-gray-900 mb-1 uppercase tracking-tight">Clinical Registration Form</h1>
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
              <FormInput label="Name of Institution" name="institutionName" value={formData.institutionName} onChange={handleInputChange} placeholder="St. Mary's Clinic" />
              <FormInput label="Address" name="address" value={formData.address} onChange={handleInputChange} placeholder="Type full address here" />
              <FormInput label="Contact person" name="contactPerson" value={formData.contactPerson} onChange={handleInputChange} placeholder="Dr. Samuel" />
              <FormInput label="Phone Number" name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} placeholder="+23470584837585" type="tel" />
              <FormInput label="Email Address" name="email" value={formData.email} onChange={handleInputChange} placeholder="clinic@example.com" type="email" />
            </div>

            <SectionHeader title="SECTION B: Staffing Information" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
              <FormInput label="Number of Clinical Staff" name="clinicalStaff" value={formData.clinicalStaff} onChange={handleInputChange} placeholder="e.g. 12" type="number" />
              <FormInput label="Number of Administrative Staff" name="adminStaff" value={formData.adminStaff} onChange={handleInputChange} placeholder="e.g. 4" type="number" />
            </div>

            <SectionHeader title="SECTION C: Physical Facilities" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
              <FormInput label="Number of Offices" name="offices" value={formData.offices} onChange={handleInputChange} placeholder="e.g. 5" type="number" />
              <FormInput label="Number of Conveniences / Toilets" name="conveniences" value={formData.conveniences} onChange={handleInputChange} placeholder="e.g. 3" type="number" />
              <FormInput label="Number of Treatment Rooms" name="treatmentRooms" value={formData.treatmentRooms} onChange={handleInputChange} placeholder="e.g. 8" type="number" />
              <FormInput label="Other Physical Facilities" name="otherFacility" value={formData.otherFacility} onChange={handleInputChange} placeholder="Gym, Gait Training Room, Workshops, etc." />
            </div>

            <SectionHeader title="SECTION D: Equipment Inventory" />
            <div className="flex flex-col gap-3 w-full">
              <div className="flex justify-between items-end ml-1">
                <label className="text-[13px] font-bold text-gray-700">List of Available Equipment</label>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">Images are Optional</span>
              </div>
              
              {equipmentFields.map((field, index) => (
                <div key={index} className="flex items-center gap-3 w-full animate-in slide-in-from-right-2 duration-300">
                  <div className="relative flex-grow">
                    <input
                      type="text"
                      value={field.name}
                      onChange={(e) => handleEquipmentChange(index, e.target.value)}
                      placeholder="Equipment name"
                      className="w-full px-4 py-3.5 rounded-xl border-2 border-[#CDE1B4] focus:border-[#5D9C0E] outline-none bg-white text-sm"
                    />
                    <button type="button" onClick={() => removeEquipmentField(index)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-300 hover:text-red-500 transition-colors">
                      <X size={18} />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveModalIndex(index)}
                    className="w-[52px] h-[52px] flex-shrink-0 rounded-xl border-2 border-[#CDE1B4] bg-[#F8FCF5] flex items-center justify-center overflow-hidden hover:border-[#5D9C0E] transition-all"
                  >
                    {field.image ? (
                      <img src={field.image} alt="Confirmed" className="w-full h-full object-cover" />
                    ) : (
                      <Camera size={20} className="text-[#5D9C0E]" />
                    )}
                  </button>
                </div>
              ))}

              <button type="button" onClick={addMoreEquipment} className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-[#CDE1B4] hover:border-[#5D9C0E] text-[#5D9C0E] py-3 rounded-xl text-xs font-bold transition-all bg-gray-50/30 hover:bg-[#f8fcf5]">
                <Plus size={16} /> Add Another Equipment
              </button>
            </div>

            <SectionHeader title="SECTION E: Declaration" />
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

        {/* COMPACT IMAGE MODAL */}
        {activeModalIndex !== null && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeModal} />
            <div className="bg-white/95 w-full max-w-[300px] rounded-2xl overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
                <h2 className="text-gray-400 font-bold text-[10px] uppercase tracking-[2px]">Select Image</h2>
                <button onClick={closeModal} className="text-gray-300 hover:text-red-500 transition-colors" type="button">
                  <X size={18} />
                </button>
              </div>

              <div className="px-6 py-6 flex flex-col items-center">
                <div className="w-full aspect-square bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center mb-6 relative overflow-hidden">
                  {stagedImage ? (
                    <img src={stagedImage} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <div className="bg-white p-3 rounded-full shadow-sm">
                        <ImageIcon size={28} className="text-gray-200" />
                      </div>
                      <p className="text-[9px] text-gray-300 font-bold uppercase tracking-widest">Image Optional</p>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2.5 w-full">
                  {stagedImage ? (
                    <button type="button" onClick={handleConfirmImage} className="w-full bg-[#5D9C0E] text-white py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#5D9C0E]/20 hover:bg-[#4a7c0b] transition-all">
                      <Check size={16} /> Press OK
                    </button>
                  ) : (
                    <>
                      <button type="button" className="w-full bg-[#5D9C0E] text-white py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-[#4a7c0b] transition-all">
                        <Camera size={16} /> Open Camera
                      </button>
                      <button type="button" onClick={() => fileInputRef.current?.click()} className="w-full bg-white border-2 border-gray-100 text-gray-600 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-gray-50 transition-all">
                        <Upload size={16} /> Upload from Files
                      </button>
                      <button type="button" onClick={closeModal} className="w-full py-2 text-[10px] text-gray-400 font-bold uppercase hover:text-gray-600 transition-colors">
                        Skip for now
                      </button>
                    </>
                  )}
                  {stagedImage && (
                    <button type="button" onClick={() => setStagedImage(null)} className="text-[9px] text-gray-400 font-bold uppercase tracking-tight hover:text-red-500 transition-colors">
                      Discard and change
                    </button>
                  )}
                </div>
              </div>
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
            </div>
          </div>
        )}
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
