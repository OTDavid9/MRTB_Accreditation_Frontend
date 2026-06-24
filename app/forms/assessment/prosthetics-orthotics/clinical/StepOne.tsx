"use client";

import React, { useRef } from "react";
import { Upload, Trash2, X } from "lucide-react";

interface StepOneProps {
  data: any;
  updateData: (data: any) => void;
  onNext: () => void;
}

const InputField = ({ label, placeholder, value, onChange, type = "text", options }: any) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-[14px] text-gray-800 font-medium">{label}</label>
    {type === "select" ? (
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-[#BDE0A6] rounded-md p-3 outline-none focus:ring-2 focus:ring-[#5D9C0E]/50 text-[14px] text-gray-700 bg-white transition-all cursor-pointer"
      >
        <option value="" disabled>{placeholder}</option>
        {options?.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
      </select>
    ) : (
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-[#BDE0A6] rounded-md p-3 outline-none focus:ring-2 focus:ring-[#5D9C0E]/50 text-[14px] text-gray-700 placeholder:text-gray-400 bg-transparent transition-all"
      />
    )}
  </div>
);

const FileUploadBlock = ({ file, onUpload, onRemove }: { file: string, onUpload: (name: string) => void, onRemove: () => void }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type === "application/pdf" || selectedFile.name.endsWith(".pdf")) onUpload(selectedFile.name);
      else alert("Invalid file type. Please upload a PDF.");
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 mt-2">
      <div className="flex flex-col items-center justify-center shrink-0">
        <div onClick={() => fileInputRef.current?.click()} className="flex flex-col items-center justify-center cursor-pointer hover:opacity-80 transition-opacity">
          <Upload size={22} className="text-gray-400 mb-1" />
          <span className="text-[#5D9C0E] text-[13px] font-medium">Upload file</span>
        </div>
        <span className="text-[10px] text-gray-400 mt-1 font-medium">PDF only</span>
        <input type="file" accept=".pdf,application/pdf" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
      </div>
      {file ? (
        <div className="flex-1 w-full bg-[#FAFAFA] border border-gray-100 p-4 rounded-lg flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3 w-full">
            <img src="https://upload.wikimedia.org/wikipedia/commons/8/87/PDF_file_icon.svg" alt="PDF" className="w-6 h-6 shrink-0" />
            <div className="flex flex-col w-full min-w-0">
              <span className="text-[12px] text-gray-600 font-medium mb-1 truncate">{file}</span>
              <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                <div className="bg-[#78C822] w-full h-full rounded-full"></div>
              </div>
              <span className="text-[10px] text-gray-400 mt-1">100% done</span>
            </div>
          </div>
          <button type="button" onClick={onRemove} className="text-gray-400 hover:text-red-500 ml-4 transition-colors shrink-0"><Trash2 size={16} /></button>
        </div>
      ) : (
        <div className="flex-1 w-full bg-[#FAFAFA] border border-gray-100 border-dashed p-4 rounded-lg flex items-center justify-center shadow-sm text-gray-400 text-xs italic">
          No document uploaded yet.
        </div>
      )}
    </div>
  );
};

export default function StepOne({ data, updateData, onNext }: StepOneProps) {
  const { prosthetists, supportStaff } = data;

  const addProsthetist = () => updateData({ ...data, prosthetists: [...prosthetists, { id: Date.now(), name: '', gender: '', qualification: '', designation: '', license: '', cpds: [{ id: Date.now() + 1, title: '' }], pgCerts: [{ id: Date.now() + 2, title: '' }] }] });
  const removeProsthetist = (id: number) => updateData({ ...data, prosthetists: prosthetists.filter((p: any) => p.id !== id) });
  const updateProsthetist = (id: number, field: string, value: any) => updateData({ ...data, prosthetists: prosthetists.map((p: any) => p.id === id ? { ...p, [field]: value } : p) });
  
  const addListReq = (pId: number, listField: string) => updateData({ ...data, prosthetists: prosthetists.map((p: any) => p.id === pId ? { ...p, [listField]: [...p[listField], { id: Date.now(), title: '' }] } : p) });
  const removeListReq = (pId: number, rId: number, listField: string) => updateData({ ...data, prosthetists: prosthetists.map((p: any) => p.id === pId ? { ...p, [listField]: p[listField].filter((q: any) => q.id !== rId) } : p) });
  const updateListReq = (pId: number, rId: number, listField: string, field: string, val: string) => updateData({ ...data, prosthetists: prosthetists.map((p: any) => p.id === pId ? { ...p, [listField]: p[listField].map((q: any) => q.id === rId ? { ...q, [field]: val } : q) } : p) });

  const addSupport = () => updateData({ ...data, supportStaff: [...supportStaff, { id: Date.now(), name: '', gender: '', qualification: '', designation: '', jobDescription: '' }] });
  const removeSupport = (id: number) => updateData({ ...data, supportStaff: supportStaff.filter((s: any) => s.id !== id) });
  const updateSupport = (id: number, field: string, value: any) => updateData({ ...data, supportStaff: supportStaff.map((s: any) => s.id === id ? { ...s, [field]: value } : s) });

  return (
    <div className="flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-10 max-w-2xl relative z-10">
        <h1 className="text-[26px] font-bold text-black mb-3">STAFF ACCREDITATION</h1>
        <p className="text-[14px] text-gray-600 leading-relaxed">
          The Clinical forms should be completed by each Prosthetist & Orthotist prior to the screening exercise.
        </p>
      </div>

      {/* --- PROSTHETISTS & ORTHOTISTS SECTION --- */}
      <div className="w-full relative flex flex-col items-center mb-12">
        <div className="bg-[#F4F9F2] text-[#5D9C0E] px-8 py-2.5 rounded-md text-[15px] font-bold inline-block mb-6 z-10 tracking-wider">
          i. Prosthetists & Orthotists
        </div>

        <div className="w-full flex flex-col gap-6 relative z-10">
          {prosthetists.map((prosthetist: any, index: number) => (
            <div key={prosthetist.id} className="w-full bg-white p-6 md:p-8 rounded-2xl shadow-[0px_4px_20px_rgba(0,0,0,0.03)] border border-gray-50">
              {prosthetists.length > 1 && (
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
                  <h3 className="font-bold text-gray-700">Practitioner #{index + 1}</h3>
                  <button onClick={() => removeProsthetist(prosthetist.id)} className="text-red-400 hover:text-red-600 flex items-center gap-1 text-xs font-bold transition-colors">
                    <X size={14} /> Remove
                  </button>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <InputField label="Names" placeholder="Type here" value={prosthetist.name} onChange={(v: string) => updateProsthetist(prosthetist.id, 'name', v)} />
                <InputField label="Sex (Gender)" type="select" placeholder="Select Gender" options={["Male", "Female"]} value={prosthetist.gender} onChange={(v: string) => updateProsthetist(prosthetist.id, 'gender', v)} />
                <InputField label="Qualification" placeholder="Type here" value={prosthetist.qualification} onChange={(v: string) => updateProsthetist(prosthetist.id, 'qualification', v)} />
                <InputField label="Designation" placeholder="Type here" value={prosthetist.designation} onChange={(v: string) => updateProsthetist(prosthetist.id, 'designation', v)} />
                <InputField label="MRTB License No" placeholder="Type here" value={prosthetist.license} onChange={(v: string) => updateProsthetist(prosthetist.id, 'license', v)} />
              </div>

              {/* Dynamic PG Certificates List */}
              <div className="mb-6 p-5 bg-[#FAFAFA] rounded-xl border border-gray-100">
                <label className="text-[14px] text-gray-800 font-medium mb-3 block">PG Certificate(s) obtained since 1st Degree</label>
                <div className="space-y-3">
                  {prosthetist.pgCerts.map((cert: any) => (
                    <div key={cert.id} className="flex items-center gap-3">
                      <input type="text" placeholder="Certificate Name" value={cert.title} onChange={(e) => updateListReq(prosthetist.id, cert.id, 'pgCerts', 'title', e.target.value)} className="flex-1 border border-[#BDE0A6] rounded-md p-2.5 outline-none focus:ring-2 focus:ring-[#5D9C0E]/50 text-[13px] bg-white transition-all" />
                      {prosthetist.pgCerts.length > 1 && (
                        <button onClick={() => removeListReq(prosthetist.id, cert.id, 'pgCerts')} className="p-2.5 text-gray-400 hover:text-red-500 shrink-0"><Trash2 size={16} /></button>
                      )}
                    </div>
                  ))}
                </div>
                <button onClick={() => addListReq(prosthetist.id, 'pgCerts')} className="mt-3 text-[13px] text-[#78C822] font-medium hover:underline">+ Add another PG Certificate</button>
              </div>

              {/* Dynamic CPDs List */}
              <div className="p-5 bg-[#FAFAFA] rounded-xl border border-gray-100">
                <label className="text-[14px] text-gray-800 font-medium mb-3 block">CPD Programmes Attended over past twelve (12) months</label>
                <div className="space-y-3">
                  {prosthetist.cpds.map((cpd: any) => (
                    <div key={cpd.id} className="flex items-center gap-3">
                      <input type="text" placeholder="Title of CPD program" value={cpd.title} onChange={(e) => updateListReq(prosthetist.id, cpd.id, 'cpds', 'title', e.target.value)} className="flex-1 border border-[#BDE0A6] rounded-md p-2.5 outline-none focus:ring-2 focus:ring-[#5D9C0E]/50 text-[13px] bg-white transition-all" />
                      {prosthetist.cpds.length > 1 && (
                        <button onClick={() => removeListReq(prosthetist.id, cpd.id, 'cpds')} className="p-2.5 text-gray-400 hover:text-red-500 shrink-0"><Trash2 size={16} /></button>
                      )}
                    </div>
                  ))}
                </div>
                <button onClick={() => addListReq(prosthetist.id, 'cpds')} className="mt-3 text-[13px] text-[#78C822] font-medium hover:underline">+ Add another CPD</button>
              </div>

            </div>
          ))}
        </div>
        <div className="w-full flex justify-end mt-4 z-10">
          <button onClick={addProsthetist} className="border border-[#78C822] text-[#78C822] px-4 py-2 rounded-md text-[14px] font-medium hover:bg-[#F4F9F2] transition-colors">+ Add More Practitioners</button>
        </div>
      </div>

      {/* --- SUPPORT STAFF SECTION --- */}
      <div className="w-full relative flex flex-col items-center mb-12">
        <div className="bg-[#F4F9F2] px-8 py-2.5 rounded-md text-[15px] font-bold inline-block mb-2 z-10 text-[#5D9C0E] tracking-wider">
          ii. Support Staff Accreditation
        </div>

        <div className="w-full flex flex-col gap-6 relative z-10">
          {supportStaff.map((staff: any, index: number) => (
            <div key={staff.id} className="w-full bg-white p-6 md:p-8 rounded-2xl shadow-[0px_4px_20px_rgba(0,0,0,0.03)] border border-gray-50">
              {supportStaff.length > 1 && (
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
                  <h3 className="font-bold text-gray-700">Support Staff #{index + 1}</h3>
                  <button onClick={() => removeSupport(staff.id)} className="text-red-400 hover:text-red-600 flex items-center gap-1 text-xs font-bold transition-colors">
                    <X size={14} /> Remove
                  </button>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField label="Names" placeholder="Type here" value={staff.name} onChange={(v: string) => updateSupport(staff.id, 'name', v)} />
                <InputField label="Sex (Gender)" type="select" placeholder="Select Gender" options={["Male", "Female"]} value={staff.gender} onChange={(v: string) => updateSupport(staff.id, 'gender', v)} />
                <InputField label="Qualification" placeholder="Type here" value={staff.qualification} onChange={(v: string) => updateSupport(staff.id, 'qualification', v)} />
                <InputField label="Designation" placeholder="Type here" value={staff.designation} onChange={(v: string) => updateSupport(staff.id, 'designation', v)} />
                <div className="md:col-span-2">
                  <InputField label="Job Description" placeholder="Brief description" value={staff.jobDescription} onChange={(v: string) => updateSupport(staff.id, 'jobDescription', v)} />
                </div>
              </div>

            </div>
          ))}
        </div>
        <div className="w-full flex justify-end mt-4 z-10">
          <button onClick={addSupport} className="border border-[#78C822] text-[#78C822] px-4 py-2 rounded-md text-[14px] font-medium hover:bg-[#F4F9F2] transition-colors">+ Add More Support Staff</button>
        </div>
      </div>

      <div className="w-full flex justify-center mb-10">
        <button onClick={onNext} className="bg-[#65A30D] hover:bg-[#528a0c] text-white px-10 py-2.5 md:px-12 md:py-3 rounded-full font-bold text-[14px] shadow-md transition-all active:scale-95">
          Next Section
        </button>
      </div>
    </div>
  );
}