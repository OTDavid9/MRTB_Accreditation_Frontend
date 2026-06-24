"use client";

import React from "react";

interface StepTwoProps {
  data: { spaces: any[] };
  updateData: (data: any) => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function StepTwo({ data, updateData, onNext, onPrev }: StepTwoProps) {
  const { spaces } = data;

  const updateSpace = (index: number, field: string, value: any) => {
    const updated = [...spaces];
    updated[index] = { ...updated[index], [field]: value };
    if (field === 'isAvailable' && value !== 'Yes') {
      updated[index].availableQuantity = '';
      updated[index].floorStructure = '';
    }
    updateData({ spaces: updated });
  };

  return (
    <div className="flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-500 w-full">
      <div className="text-center mb-4 max-w-2xl relative z-10">
        <h1 className="text-[22px] md:text-[26px] font-bold text-black mb-1">PHYSICAL FACILITIES</h1>
        <p className="text-[13px] text-gray-600 leading-relaxed">
          Please evaluate all available spaces, their quantities, and the type of floor structure present.
        </p>
      </div>

      <div className="w-full relative flex flex-col items-center mb-6">
        <div className="bg-[#F4F9F2] text-[#5D9C0E] px-8 py-1.5 rounded-md text-[14px] font-bold inline-block mb-4 z-10 uppercase tracking-wider">
          Space Evaluation
        </div>

        <div className="w-full bg-white rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.03)] border border-[#CDE1B4]/50 relative z-10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[650px]">
              <thead>
                <tr className="border-b-2 border-[#BDE0A6]/50 bg-[#FAFAFA]">
                  <th className="py-2 px-2 font-bold text-gray-700 text-[11px] uppercase tracking-wider w-[50px] text-center border-r border-gray-100">S/N</th>
                  <th className="py-2 px-3 font-bold text-gray-700 text-[11px] uppercase tracking-wider min-w-[250px] border-r border-gray-100">Facility / Item</th>
                  <th className="py-2 px-2 font-bold text-gray-700 text-[11px] uppercase tracking-wider w-[100px] text-center border-r border-gray-100">Available?</th>
                  <th className="py-2 px-2 font-bold text-gray-700 text-[11px] uppercase tracking-wider w-[100px] text-center border-r border-gray-100">Avail. Qty</th>
                  <th className="py-2 px-2 font-bold text-gray-700 text-[11px] uppercase tracking-wider w-[160px] text-center">Floor Structure</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {spaces.map((space: any, index: number) => (
                  <tr key={index} className="hover:bg-[#F8FCF5] transition-colors group">
                    <td className={`py-1 px-2 font-bold text-[11px] text-center border-r border-gray-50 ${space.isSubItem ? 'text-[#5D9C0E] text-[16px]' : 'text-gray-400'}`}>
                      {space.sn}
                    </td>
                    
                    <td className={`py-1 px-3 text-[12px] leading-tight border-r border-gray-50 ${space.isSubItem ? 'pl-8 text-gray-600' : 'font-bold text-gray-800'}`}>
                      {space.item}
                    </td>

                    {space.isHeader ? (
                      <td colSpan={3} className="py-1 px-3 text-[10px] text-gray-400 italic bg-gray-50/50">Please select options below</td>
                    ) : (
                      <>
                        <td className="py-1 px-2 text-center border-r border-gray-50">
                          <select 
                            value={space.isAvailable} 
                            onChange={(e) => updateSpace(index, 'isAvailable', e.target.value)} 
                            className="w-full border border-[#BDE0A6] rounded py-1 px-1.5 outline-none focus:border-[#5D9C0E] text-[11px] text-gray-800 bg-white transition-all cursor-pointer text-center font-medium h-[26px]"
                          >
                            <option value="" disabled>Select...</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                          </select>
                        </td>

                        <td className="py-1 px-2 text-center border-r border-gray-50">
                          {space.isAvailable === 'Yes' ? (
                            <input 
                              type="number" 
                              min="0"
                              value={space.availableQuantity} 
                              onChange={(e) => updateSpace(index, 'availableQuantity', e.target.value)} 
                              placeholder="Qty" 
                              className="w-full border border-[#BDE0A6] rounded py-1 px-2 outline-none focus:border-[#5D9C0E] text-[11px] text-gray-800 bg-white transition-all text-center h-[26px]" 
                            />
                          ) : (
                            <span className="text-gray-300 text-[10px] italic block text-center">-</span>
                          )}
                        </td>

                        <td className="py-1 px-2 text-center">
                          {space.isAvailable === 'Yes' ? (
                            <select 
                              value={space.floorStructure || ''} 
                              onChange={(e) => updateSpace(index, 'floorStructure', e.target.value)} 
                              className="w-full border border-[#BDE0A6] rounded py-1 px-1.5 outline-none focus:border-[#5D9C0E] text-[11px] text-gray-800 bg-white transition-all cursor-pointer text-center font-medium h-[26px]"
                            >
                              <option value="" disabled>Select...</option>
                              <option value="Concrete">Concrete</option>
                              <option value="Tiled">Tiled</option>
                              <option value="Rugged">Rugged</option>
                              <option value="Synthetic">Synthetic</option>
                              <option value="Wooden">Wooden</option>
                            </select>
                          ) : (
                            <span className="text-gray-300 text-[10px] italic block text-center">-</span>
                          )}
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="w-full flex justify-center gap-4 mb-10 z-10">
        <button onClick={onPrev} className="border border-gray-300 text-gray-600 hover:bg-gray-50 px-10 py-2.5 md:px-12 md:py-3 rounded-full font-bold text-[13px] transition-all active:scale-95">
          Previous
        </button>
        <button onClick={onNext} className="bg-[#65A30D] hover:bg-[#528a0c] text-white px-10 py-2.5 md:px-12 md:py-3 rounded-full font-bold text-[13px] shadow-md transition-all active:scale-95">
          Next Section
        </button>
      </div>
    </div>
  );
}