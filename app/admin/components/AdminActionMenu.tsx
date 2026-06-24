import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical, Edit2, Ban, CheckCircle, Trash2, Building } from 'lucide-react';

interface AdminActionMenuProps {
  admin: any;
  onEdit: (admin: any) => void;
  onToggleStatus: (admin: any) => void;
  onAssign: (admin: any) => void;
  onDelete: (admin: any) => void;
}

export default function AdminActionMenu({ admin, onEdit, onToggleStatus, onAssign, onDelete }: AdminActionMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-gray-400 hover:text-[#65A30D] hover:bg-[#EEF6DF] rounded-full transition-colors"
      >
        <MoreVertical size={18} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-[110%] w-[220px] bg-white border border-gray-100 rounded-xl shadow-lg z-50 py-2 animate-in fade-in zoom-in-95 duration-200">
          
          <button onClick={() => { onEdit(admin); setIsOpen(false); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            <Edit2 size={15} className="text-gray-400" /> Edit Admin Details
          </button>
          
          <button onClick={() => { onAssign(admin); setIsOpen(false); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            <Building size={15} className="text-gray-400" /> Assign Organization
          </button>

          <div className="w-full h-[1px] bg-gray-100 my-1"></div>

          <button onClick={() => { onToggleStatus(admin); setIsOpen(false); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            {admin.status === 'Active' ? (
              <><Ban size={15} className="text-yellow-600" /> Suspend Access</>
            ) : (
              <><CheckCircle size={15} className="text-[#65A30D]" /> Restore Access</>
            )}
          </button>

          <button onClick={() => { onDelete(admin); setIsOpen(false); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] font-medium text-red-600 hover:bg-red-50 transition-colors">
            <Trash2 size={15} className="text-red-500" /> Permanently Delete
          </button>

        </div>
      )}
    </div>
  );
}
