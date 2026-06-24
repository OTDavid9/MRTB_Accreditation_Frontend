"use client";

import React from 'react';
import { ArrowLeft, User, Stethoscope, Building2, Wrench, FileCheck2 } from 'lucide-react';

interface FullAssessmentViewProps {
  drawerData: any;
  onBack: () => void;
}

export default function FullAssessmentView({ drawerData, onBack }: FullAssessmentViewProps) {
  const data = drawerData?.full_assessment;
  
  if (!data) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-white p-6">
        <p className="text-gray-500">No assessment data available.</p>
        <button onClick={onBack} className="mt-4 text-[#5D9C0E] hover:underline text-sm font-medium">Go Back</button>
      </div>
    );
  }

  // Helper to format the assessment_type string (e.g. "speech_therapy_clinical" -> "Speech Therapy - Clinical")
  const formatDocTitle = (typeStr: string) => {
    if (!typeStr) return "Universal Assessment Document";
    const words = typeStr.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1));
    const category = words.pop(); 
    return `${words.join(' ')} - ${category}`;
  };

  // Group Staff
  const primaryStaff = data.staff?.filter((s: any) => s.type !== 'support_staff') || [];
  const supportStaff = data.staff?.filter((s: any) => s.type === 'support_staff') || [];

  // Helper to render universal item tables (Spaces, Training, Equipment)
  const renderItemTable = (items: any[], isSpace = false) => {
    if (!items || items.length === 0) return <p className="text-xs text-gray-400 italic p-3">No records provided.</p>;

    return (
      <div className="w-full border border-gray-200 rounded-xl overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F8FCF5] border-b border-[#CDE1B4]/50 text-[10px] uppercase tracking-wider text-[#066936]">
                <th className="p-3 font-bold w-12 text-center">S/N</th>
                <th className="p-3 font-bold min-w-[250px]">Item / Description</th>
                <th className="p-3 font-bold text-center w-28">{isSpace ? "Available" : "Status"}</th>
                <th className="p-3 font-bold text-center w-28">Quantity</th>
                {isSpace && <th className="p-3 font-bold min-w-[150px]">Floor Structure</th>}
              </tr>
            </thead>
            <tbody className="text-[11px] text-gray-700 divide-y divide-gray-100">
              {items.map((item: any, idx: number) => {
                if (item.isHeader) {
                  return (
                    <tr key={idx} className="bg-gray-50/80">
                      <td colSpan={isSpace ? 5 : 4} className="p-3 font-bold text-gray-800 text-[12px]">
                        {item.item}
                      </td>
                    </tr>
                  );
                }
                return (
                  <tr key={idx} className={`hover:bg-slate-50 transition-colors ${item.isSubItem ? 'bg-slate-50/50' : ''}`}>
                    <td className="p-3 text-center text-gray-400 font-medium">{item.sn}</td>
                    <td className={`p-3 font-medium ${item.isSubItem ? 'pl-8 text-gray-600' : 'text-gray-800'}`}>
                      {item.item}
                    </td>
                    <td className="p-3 text-center">
                      {item.isAvailable === 'Yes' || item.isAvailable === 'Available' ? (
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-[9px] font-bold uppercase">Yes</span>
                      ) : item.isAvailable === 'No' || item.isAvailable === 'Not Available' ? (
                        <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-[9px] font-bold uppercase">No</span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="p-3 text-center font-semibold text-gray-800">
                      {item.availableQuantity !== '-' && item.availableQuantity ? item.availableQuantity : <span className="text-gray-300">-</span>}
                    </td>
                    {isSpace && (
                      <td className="p-3 text-gray-600">
                        {item.floorStructure !== '-' && item.floorStructure ? item.floorStructure : <span className="text-gray-300">-</span>}
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full h-full overflow-y-auto bg-[#FAFAFA] px-4 py-5 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
        <div>
          <button onClick={onBack} className="flex items-center gap-1.5 text-[#5D9C0E] hover:text-[#4a7c0b] text-[12px] font-bold mb-2 transition-colors">
            <ArrowLeft size={14} /> Back to Dashboard
          </button>
          <h2 className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <FileCheck2 className="text-[#5D9C0E]" /> 
            {formatDocTitle(data.assessment_type)}
          </h2>
        </div>
        <div className="bg-[#EEF6DF] text-[#066936] px-4 py-1.5 rounded-full text-[11px] font-bold border border-[#CDE1B4]/50 shadow-sm hidden sm:block">
          Phase 2 Complete
        </div>
      </div>
      
      <div className="space-y-8 max-w-5xl mx-auto pb-10">
        
        {/* PRIMARY STAFF SECTION */}
        <section>
          <h3 className="text-[13px] text-[#066936] font-bold mb-3 uppercase tracking-wider flex items-center gap-1.5">
            <Stethoscope size={16} /> Primary Practitioners ({primaryStaff.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {primaryStaff.map((p: any, i: number) => (
              <div key={i} className="p-4 bg-white border border-gray-200 shadow-sm rounded-2xl text-[12px] flex flex-col gap-2 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-[#5D9C0E]"></div>
                <div className="text-gray-900 border-b border-gray-100 pb-2 mb-1 font-bold text-[14px] flex justify-between items-center">
                  {p.name || "Unnamed Staff"} 
                  <span className="text-[10px] font-medium bg-slate-100 text-slate-500 px-2 py-0.5 rounded uppercase tracking-wider">{p.gender || "N/A"}</span>
                </div>
                
                <div className="grid grid-cols-2 gap-x-2 gap-y-1.5">
                  <div className="text-gray-500">Designation: <span className="text-gray-800 font-medium block">{p.designation || '-'}</span></div>
                  <div className="text-gray-500">License No: <span className="text-gray-800 font-medium block">{p.license || '-'}</span></div>
                  <div className="text-gray-500 col-span-2">Specialization: <span className="text-gray-800 font-medium block">{p.specialization || p.qualification || '-'}</span></div>
                </div>

                {/* Render Dynamic Nested Arrays (Qualifications, CPDs, etc.) */}
                {p.qualifications && p.qualifications.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-gray-50">
                    <span className="text-[10px] text-gray-400 font-bold uppercase mb-1 block">Qualifications</span>
                    <div className="flex flex-wrap gap-1">
                      {p.qualifications.map((q: any, idx: number) => (
                        <span key={idx} className="bg-blue-50 text-blue-700 border border-blue-100 px-2 py-1 rounded text-[10px] font-medium">
                          {q.title} {q.date ? `(${q.date})` : ''}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {p.cpds && p.cpds.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-gray-50">
                    <span className="text-[10px] text-gray-400 font-bold uppercase mb-1 block">CPD Programmes</span>
                    <ul className="list-disc pl-4 text-gray-600 text-[11px] space-y-0.5 marker:text-gray-300">
                      {p.cpds.map((c: any, idx: number) => <li key={idx}>{c.title}</li>)}
                    </ul>
                  </div>
                )}
              </div>
            ))}
            {primaryStaff.length === 0 && <p className="text-xs text-gray-400 italic">No practitioners listed.</p>}
          </div>
        </section>

        {/* SUPPORT STAFF SECTION */}
        <section>
          <h3 className="text-[13px] text-[#066936] font-bold mb-3 uppercase tracking-wider flex items-center gap-1.5">
            <User size={16} /> Support Staff ({supportStaff.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {supportStaff.map((s: any, i: number) => (
              <div key={i} className="p-3 bg-white border border-gray-200 shadow-sm rounded-xl text-[11px] flex flex-col gap-1.5">
                <div className="text-gray-800 border-b border-gray-100 pb-1.5 mb-1 font-bold">{s.name || "Unnamed"} ({s.gender || "N/A"})</div>
                <div className="flex justify-between"><span className="text-gray-500">Rank:</span> <span className="font-medium text-gray-800">{s.rank || '-'}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Qualification:</span> <span className="font-medium text-gray-800 truncate max-w-[120px]" title={s.qualification}>{s.qualification || '-'}</span></div>
                <div className="flex flex-col mt-1"><span className="text-gray-500 mb-0.5">Job Description:</span> <span className="text-gray-800 bg-slate-50 p-1.5 rounded border border-gray-100">{s.jobDescription || '-'}</span></div>
              </div>
            ))}
            {supportStaff.length === 0 && <p className="text-xs text-gray-400 italic">No support staff listed.</p>}
          </div>
        </section>

        {/* SPACES SECTION */}
        <section>
          <h3 className="text-[13px] text-[#066936] font-bold mb-3 uppercase tracking-wider flex items-center gap-1.5">
            <Building2 size={16} /> Space Evaluation
          </h3>
          {renderItemTable(data.spaces, true)}
        </section>

        {/* CLINICAL TRAINING SECTION (If applicable) */}
        {data.clinicalTraining && data.clinicalTraining.length > 0 && (
          <section>
            <h3 className="text-[13px] text-[#066936] font-bold mb-3 uppercase tracking-wider flex items-center gap-1.5">
              <Building2 size={16} /> Clinical / Institutional Requirements
            </h3>
            {renderItemTable(data.clinicalTraining, false)}
          </section>
        )}

        {/* EQUIPMENT SECTION */}
        <section>
          <h3 className="text-[13px] text-[#066936] font-bold mb-3 uppercase tracking-wider flex items-center gap-1.5">
            <Wrench size={16} /> Equipment Inventory
          </h3>
          {renderItemTable(data.equipment, false)}
        </section>

      </div>
    </div>
  );
}
