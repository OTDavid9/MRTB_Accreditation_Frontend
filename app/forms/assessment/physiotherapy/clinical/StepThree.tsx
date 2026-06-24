"use client";

import React from "react";
import { Loader2 } from "lucide-react";

interface Category {
  key: string;
  title: string;
}

interface StepThreeProps {
  data: any; 
  categories: Category[];
  updateCategory: (categoryKey: string, index: number, field: string, value: any) => void;
  onPrev: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

export default function StepThree({ data, categories, updateCategory, onPrev, onSubmit, isSubmitting }: StepThreeProps) {

  return (
    <div className="flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-500 w-full">
      <div className="text-center mb-8 max-w-2xl relative z-10">
        <h1 className="text-[22px] md:text-[26px] font-bold text-black mb-1">LIST OF EQUIPMENT</h1>
        <p className="text-[13px] text-gray-600 leading-relaxed">
          Please confirm the availability and quantity of the following equipment across all departments.
        </p>
      </div>

      {categories.map((category) => {
        const equipmentList = data[category.key] || [];

        return (
          <div key={category.key} className="w-full relative flex flex-col items-center mb-10">
            <div className="bg-[#F4F9F2] text-[#5D9C0E] px-8 py-1.5 rounded-md text-[14px] font-bold inline-block mb-4 z-10 uppercase tracking-wider">
              {category.title}
            </div>

            <div className="w-full bg-white rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.03)] border border-[#CDE1B4]/50 relative z-10 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[500px]">
                  <thead>
                    <tr className="border-b-2 border-[#BDE0A6]/50 bg-[#FAFAFA]">
                      <th className="py-2 px-2 font-bold text-gray-700 text-[11px] uppercase tracking-wider w-[50px] text-center border-r border-gray-100">S/N</th>
                      <th className="py-2 px-3 font-bold text-gray-700 text-[11px] uppercase tracking-wider min-w-[200px] border-r border-gray-100">Name of Equipment</th>
                      <th className="py-2 px-2 font-bold text-gray-700 text-[11px] uppercase tracking-wider w-[120px] text-center border-r border-gray-100">Available?</th>
                      <th className="py-2 px-2 font-bold text-gray-700 text-[11px] uppercase tracking-wider w-[120px] text-center">Avail. Qty</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {equipmentList.map((eq: any, index: number) => (
                      <tr key={index} className="hover:bg-[#F8FCF5] transition-colors group">
                        <td className={`py-1 px-2 font-bold text-[11px] text-center border-r border-gray-50 ${eq.isSubItem ? 'text-[#5D9C0E] text-[16px]' : 'text-gray-400'}`}>
                          {eq.sn}
                        </td>
                        
                        <td className={`py-1 px-3 text-[12px] leading-tight border-r border-gray-50 ${eq.isSubItem ? 'pl-8 text-gray-600' : 'font-bold text-gray-800'}`}>
                          {eq.item}
                        </td>

                        {eq.isHeader ? (
                          <>
                            <td className="py-1 px-2 text-center border-r border-gray-50 bg-gray-50/50">
                              <span className="text-[10px] text-gray-400 italic whitespace-nowrap">Select below 👇</span>
                            </td>
                            <td className="py-1 px-2 bg-gray-50/50"></td>
                          </>
                        ) : (
                          <>
                            <td className="py-1 px-2 text-center border-r border-gray-50">
                              <select 
                                value={eq.isAvailable} 
                                onChange={(e) => {
                                  updateCategory(category.key, index, 'isAvailable', e.target.value);
                                  if (e.target.value !== 'Yes') updateCategory(category.key, index, 'availableQuantity', '');
                                }} 
                                className="w-full border border-[#BDE0A6] rounded py-1 px-1.5 outline-none focus:border-[#5D9C0E] text-[11px] text-gray-800 bg-white transition-all cursor-pointer text-center font-medium h-[26px]"
                              >
                                <option value="" disabled>Select...</option>
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                              </select>
                            </td>

                            <td className="py-1 px-2 text-center">
                              {eq.isAvailable === 'Yes' ? (
                                <input 
                                  type="number" 
                                  min="0"
                                  value={eq.availableQuantity} 
                                  onChange={(e) => updateCategory(category.key, index, 'availableQuantity', e.target.value)} 
                                  placeholder="Qty" 
                                  className="w-full border border-[#BDE0A6] rounded py-1 px-2 outline-none focus:border-[#5D9C0E] text-[11px] text-gray-800 bg-white transition-all text-center h-[26px]" 
                                />
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
        );
      })}

      <div className="w-full max-w-2xl bg-[#FAFAFA] border border-[#BDE0A6]/50 rounded-xl p-4 mb-6 z-10 shadow-sm">
        <p className="text-[12px] text-[#066936] font-medium text-center leading-relaxed">
          By clicking submit, you confirm that all provided information is accurate and verified by the institution's authorities.
        </p>
      </div>

      <div className="w-full flex justify-center gap-4 mb-10 z-10">
        <button onClick={onPrev} className="border border-gray-300 text-gray-600 hover:bg-gray-50 px-10 py-2.5 md:px-12 md:py-3 rounded-full font-bold text-[13px] transition-all active:scale-95">
          Previous
        </button>
        <button onClick={onSubmit} disabled={isSubmitting} className="bg-[#066936] hover:bg-[#044c27] text-white px-8 py-2.5 md:px-10 md:py-3 rounded-full font-bold text-[13px] shadow-md transition-all flex items-center gap-2 disabled:opacity-70">
          {isSubmitting ? <><Loader2 size={16} className="animate-spin" /> Submitting...</> : "Submit Final Assessment"}
        </button>
      </div>
    </div>
  );
}