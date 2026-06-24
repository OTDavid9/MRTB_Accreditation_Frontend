import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface PreAssessmentViewProps {
  drawerData: any;
  onBack: () => void;
}

export default function PreAssessmentView({ drawerData, onBack }: PreAssessmentViewProps) {
  const data = drawerData?.pre_assessment;
  if (!data) return null;

  return (
    <div className="w-full h-full overflow-y-auto bg-white px-3 py-5 md:p-6 font-sans">
      <button onClick={onBack} className="flex items-center gap-1.5 text-[#5D9C0E] hover:text-[#4a7c0b] font-bold text-sm mb-4 transition-colors">
        <ArrowLeft size={16} /> Back to Profile Summary
      </button>
      <h2 className="text-lg font-bold text-[#066936] mb-4 border-b border-gray-100 pb-2">Phase 1: Pre-assessment Document</h2>
      
      <div className="space-y-4">
        {/* A. INSTITUTION INFO (UNIVERSAL) */}
        <section>
          <h3 className="text-xs text-[#5D9C0E] font-bold mb-2 uppercase tracking-wider">A. Institution Info</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-[#f8fcf5] p-3 rounded-lg border border-[#CDE1B4]/50">
            <div><span className="text-gray-400 font-bold block uppercase mb-0.5">Name</span> <span className="text-gray-900 font-medium">{data.institutionName || 'N/A'}</span></div>
            <div><span className="text-gray-400 font-bold block uppercase mb-0.5">Contact</span> <span className="text-gray-900 font-medium">{data.contactPerson || 'N/A'}</span></div>
            <div><span className="text-gray-400 font-bold block uppercase mb-0.5">Phone</span> <span className="text-gray-900 font-medium">{data.phoneNumber || 'N/A'}</span></div>
            <div><span className="text-gray-400 font-bold block uppercase mb-0.5">Email</span> <span className="text-gray-900 font-medium">{data.email || 'N/A'}</span></div>
            
            {/* CONDITIONAL: ACADEMIC FIELDS */}
            {data.purpose && <div><span className="text-gray-400 font-bold block uppercase mb-0.5">Purpose</span> <span className="text-gray-900 font-medium">{data.purpose}</span></div>}
            {data.programme && <div><span className="text-gray-400 font-bold block uppercase mb-0.5">Programme</span> <span className="text-gray-900 font-medium">{data.programme}</span></div>}
            
            <div className="sm:col-span-2"><span className="text-gray-400 font-bold block uppercase mb-0.5">Address</span> <span className="text-gray-900 font-medium break-words">{data.address || 'N/A'}</span></div>
          </div>
        </section>

        {/* CONDITIONAL: CLINICAL STAFFING & FACILITIES */}
        {(data.clinicalStaff || data.adminStaff || data.offices || data.conveniences || data.treatmentRooms) && (
          <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {(data.clinicalStaff || data.adminStaff) && (
              <div>
                <h3 className="text-xs text-[#5D9C0E] font-bold mb-2 uppercase tracking-wider">B. Staffing</h3>
                <div className="bg-[#f8fcf5] p-3 rounded-lg space-y-2 text-xs border border-[#CDE1B4]/50">
                  <div className="flex justify-between border-b border-gray-200 pb-1"><span className="text-gray-500 font-medium">Clinical Staff</span> <span className="text-gray-900 font-bold">{data.clinicalStaff || '0'}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500 font-medium">Admin Staff</span> <span className="text-gray-900 font-bold">{data.adminStaff || '0'}</span></div>
                </div>
              </div>
            )}
            
            {(data.offices || data.conveniences || data.treatmentRooms) && (
              <div>
                <h3 className="text-xs text-[#5D9C0E] font-bold mb-2 uppercase tracking-wider">C. Facilities</h3>
                <div className="bg-[#f8fcf5] p-3 rounded-lg space-y-2 text-xs border border-[#CDE1B4]/50">
                  <div className="flex justify-between border-b border-gray-200 pb-1"><span className="text-gray-500 font-medium">Offices</span> <span className="text-gray-900 font-bold">{data.offices || '0'}</span></div>
                  <div className="flex justify-between border-b border-gray-200 pb-1"><span className="text-gray-500 font-medium">Conveniences</span> <span className="text-gray-900 font-bold">{data.conveniences || '0'}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500 font-medium">Treatment Rooms</span> <span className="text-gray-900 font-bold">{data.treatmentRooms || '0'}</span></div>
                  {data.otherFacility && (
                    <div className="flex justify-between border-t border-gray-200 pt-1 mt-1"><span className="text-gray-500 font-medium">Others</span> <span className="text-gray-900 font-bold text-right ml-2">{data.otherFacility}</span></div>
                  )}
                </div>
              </div>
            )}
          </section>
        )}
        
        {/* CONDITIONAL: CLINICAL EQUIPMENT INVENTORY */}
        {data.equipments && data.equipments.length > 0 && (
          <section>
            <h3 className="text-xs text-[#5D9C0E] font-bold mb-2 uppercase tracking-wider">D. Equipment Inventory ({data.equipments.length})</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {data.equipments.map((eq: any, idx: number) => (
                <div key={idx} className="flex items-center gap-2 bg-white p-2 rounded-lg border border-[#CDE1B4]/50 shadow-sm">
                  <div className="w-8 h-8 bg-gray-50 rounded flex items-center justify-center border border-gray-100 overflow-hidden shrink-0">
                    {eq.image ? <img src={eq.image} alt={eq.name} className="w-full h-full object-cover" /> : <span className="text-[7px] text-gray-400 text-center leading-tight">No<br/>Img</span>}
                  </div>
                  <span className="text-gray-800 font-medium text-[11px] leading-tight truncate">{eq.name}</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}