"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Bell, Building2, MapPin, Search, CheckCircle2, ChevronDown, LogOut, Navigation, Loader2 } from 'lucide-react';
import OrganizationDrawer from '../../admin/components/OrganizationDrawer'; // Adjust path if your folder structure differs

interface AssignmentData {
  id: number;
  name: string;
  category: string;
  profession: string;
  state: string;
  lga: string;
  date: string;
  status: string;
}

export default function AccreditationDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"upcoming" | "completed">("upcoming");
  
  // Real Data States
  const [assignments, setAssignments] = useState<AssignmentData[]>([]);
  const [adminProfile, setAdminProfile] = useState({ name: "Loading...", staffId: "..." });
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Drawer State
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  const fetchMyAssignments = async () => {
    setIsLoading(true);
    const token = localStorage.getItem('adminAccessToken') || sessionStorage.getItem('adminAccessToken');
    
    if (!token) {
      router.push('/admin/login');
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/entity/accreditation/assignments`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}`, 'ngrok-skip-browser-warning': 'true' }
      });
      
      if (response.ok) {
        const data = await response.json();
        setAssignments(data.data || []);
        if (data.admin) {
          setAdminProfile(data.admin);
        }
      }
    } catch (error) {
      console.error("Error fetching assignments:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMyAssignments();
  }, [router]);

  const handleLogout = () => {
    if (confirm("Are you sure you want to securely log out?")) {
      localStorage.clear();
      sessionStorage.clear();
      router.push('/admin/login');
    }
  };

  // SMART FILTERING: Handles Search AND Tab switching seamlessly
  const filteredAssignments = assignments.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          app.lga?.toLowerCase().includes(searchQuery.toLowerCase());
    
    // In the future, when reports are submitted, status will be "Completed"
    const isCompleted = app.status === "Completed";
    const matchesTab = activeTab === "completed" ? isCompleted : !isCompleted;

    return matchesSearch && matchesTab;
  });

  return (
    <div className="pb-12 relative w-full max-w-[1200px] mx-auto">
      
      {/* TOP NAVIGATION (NOW WITH REAL USER DATA) */}
      <div className="flex justify-end items-center mb-6 gap-2 md:gap-5 w-full">
        <button className="w-[38px] h-[38px] md:w-[52px] md:h-[52px] bg-white rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-shadow shrink-0">
          <Calendar size={18} className="text-[#65A30D] md:w-5 md:h-5" />
        </button>
        <button className="relative w-[38px] h-[38px] md:w-[52px] md:h-[52px] bg-white rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-shadow shrink-0">
          <Bell size={18} className="text-[#65A30D] md:w-5 md:h-5" />
          <span className="absolute top-2 right-2 md:top-2.5 md:right-2.5 w-2 h-2 md:w-2.5 md:h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        
        <div className="bg-white rounded-full p-1 md:p-1.5 pr-4 md:pr-6 flex items-center gap-2 md:gap-3 shadow-sm w-max cursor-pointer">
          <div className="w-[30px] h-[30px] md:w-[42px] md:h-[42px] rounded-full bg-[#65A30D] flex items-center justify-center text-white shrink-0">
            <Building2 size={14} className="md:w-[18px] md:h-[18px]" />
          </div>
          <div className="flex flex-col pr-1 md:pr-2 hidden sm:flex">
            <span className="text-xs md:text-sm font-bold text-gray-800 leading-tight">{adminProfile.name}</span>
            <span className="text-[10px] md:text-[11px] text-[#65A30D] font-bold">ID: {adminProfile.staffId}</span>
          </div>
          <ChevronDown size={14} className="text-gray-400 ml-1 hidden sm:block" />
        </div>

        <button onClick={handleLogout} className="flex items-center gap-1.5 md:gap-2 bg-red-50 text-red-600 px-3 md:px-4 h-[38px] md:h-[52px] rounded-full shadow-sm hover:bg-red-100 transition-all border border-red-100 font-bold text-xs md:text-[13px] shrink-0">
          <LogOut size={14} className="md:w-4 md:h-4" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>

      {/* HEADER SECTION */}
      <div className="bg-white rounded-[20px] md:rounded-[24px] mb-6 p-5 md:p-8 flex flex-col lg:flex-row justify-between items-start lg:items-center shadow-[0_2px_15px_-3px_rgba(0,0,0,0.02)] w-full">
        <div>
          <h1 className="text-xl md:text-3xl font-bold text-gray-900 mb-1.5 md:mb-2 tracking-tight">Field Dashboard</h1>
          <p className="text-xs md:text-sm text-gray-600 font-medium">
            Review your assigned facilities and manage your upcoming inspections.
          </p>
        </div>
        
        <div className="flex w-full lg:w-auto items-center gap-3 mt-5 lg:mt-0">
          <div className="bg-blue-50 text-blue-700 border border-blue-100 px-5 py-2.5 rounded-xl flex items-center gap-3 shadow-sm w-full lg:w-auto">
             <MapPin size={18} />
             <div>
               <p className="text-[10px] uppercase font-bold tracking-wider opacity-70">Status</p>
               <p className="text-sm font-bold">Field Deployment Active</p>
             </div>
          </div>
        </div>
      </div>

      {/* STATS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-6">
         <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Total Assigned</p>
              <p className="text-2xl font-black text-gray-800">{assignments.length}</p>
            </div>
            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-gray-400"><Building2 size={24} /></div>
         </div>
         <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Pending Inspections</p>
              <p className="text-2xl font-black text-yellow-600">{assignments.filter(a => a.status !== 'Completed').length}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-50 rounded-full flex items-center justify-center text-yellow-600"><Calendar size={24} /></div>
         </div>
         <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Reports Submitted</p>
              <p className="text-2xl font-black text-[#65A30D]">{assignments.filter(a => a.status === 'Completed').length}</p>
            </div>
            <div className="w-12 h-12 bg-[#EEF6DF] rounded-full flex items-center justify-center text-[#65A30D]"><CheckCircle2 size={24} /></div>
         </div>
      </div>

      {/* SMART TABS */}
      <div className="mb-5 md:mb-6 flex flex-wrap gap-2 md:gap-4 w-full">
        <button onClick={() => setActiveTab('upcoming')} className={`px-4 py-2 md:px-6 md:py-3 rounded-full font-bold text-xs md:text-sm flex items-center gap-1.5 transition-all ${activeTab === 'upcoming' ? 'bg-[#65A30D] text-white shadow-md' : 'bg-white text-gray-500 hover:bg-gray-50 shadow-sm border border-gray-100'}`}>
          Upcoming Inspections
        </button>
        <button onClick={() => setActiveTab('completed')} className={`px-4 py-2 md:px-6 md:py-3 rounded-full font-bold text-xs md:text-sm transition-all ${activeTab === 'completed' ? 'bg-[#65A30D] text-white shadow-md' : 'bg-white text-gray-500 hover:bg-gray-50 shadow-sm border border-gray-100'}`}>
          Completed Reports
        </button>
      </div>

      {/* DATA TABLE SECTION */}
      <div className="bg-white rounded-[20px] md:rounded-[24px] shadow-sm border border-gray-100 overflow-hidden min-h-[400px] w-full">
        <div className="overflow-x-auto pb-4 md:pb-8 [&::-webkit-scrollbar]:hidden">
          <div className="min-w-[800px] lg:min-w-[1050px]">
            
            <div className="flex items-center px-6 md:px-8 py-4 md:py-6 border-b border-gray-50">
              <div className="w-[220px] md:w-[260px] text-[13px] md:text-[15px] font-semibold text-gray-400">Facility Name</div>
              <div className="w-[180px] md:w-[200px] text-[13px] md:text-[15px] font-semibold text-gray-400">Category</div>
              <div className="w-[180px] md:w-[200px] text-[13px] md:text-[15px] font-semibold text-gray-400">Location</div>
              <div className="flex-1 text-[13px] md:text-[15px] font-semibold text-gray-400">Scheduled Date</div>
              
              <div className="flex items-center pr-2">
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Search assigned facilities..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-[200px] border border-gray-200 rounded-full py-2 pl-9 pr-4 text-xs md:text-sm outline-none focus:border-[#65A30D]" 
                  />
                </div>
              </div>
            </div>

            <div>
              {isLoading ? (
                <div className="flex justify-center py-16"><Loader2 size={32} className="animate-spin text-[#65A30D]" /></div>
              ) : filteredAssignments.length === 0 ? (
                <div className="flex flex-col justify-center items-center py-16 text-gray-400">
                  <CheckCircle2 size={40} className="mb-3 text-gray-300" />
                  <p className="text-[15px] font-medium text-gray-600">No facilities found here.</p>
                  <p className="text-[13px]">There are no {activeTab} inspections at the moment.</p>
                </div>
              ) : (
                filteredAssignments.map((row, index) => (
                  <div key={row.id} className={`flex items-center px-6 md:px-8 py-4 md:py-5 hover:bg-gray-50/50 transition-colors ${index % 2 !== 0 ? 'bg-[#FAFCF8]' : 'bg-white'}`}>
                    
                    {/* CLICKABLE FACILITY NAME TO OPEN DRAWER */}
                    <div 
                      onClick={() => setSelectedUserId(row.id)}
                      className="w-[220px] md:w-[260px] text-[14px] md:text-[15px] text-[#65A30D] font-bold pr-2 cursor-pointer hover:underline"
                    >
                      {row.name}
                    </div>

                    <div className="w-[180px] md:w-[200px] flex flex-col pr-2">
                      <span className="text-[13px] md:text-[14px] text-gray-700 font-bold">{row.category}</span>
                      <span className="text-[11px] text-gray-400">{row.profession}</span>
                    </div>
                    <div className="w-[180px] md:w-[200px] text-[13px] md:text-[14px] text-gray-500 pr-2 flex items-center gap-1.5">
                      <MapPin size={14} className="text-gray-400" /> {row.lga || 'N/A'}, {row.state || 'N/A'}
                    </div>
                    <div className="flex-1 text-[13px] md:text-[14px] text-gray-800 font-medium">
                      {row.date !== "Not Scheduled" ? new Date(row.date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }) : <span className="text-yellow-600 bg-yellow-50 px-2 py-1 rounded-md text-[11px] font-bold">Pending Date</span>}
                    </div>
                    
                    <div className="pr-4 flex gap-2">
                      {activeTab === 'upcoming' ? (
                        <>
                          <button className="px-4 py-2 border border-gray-200 rounded-lg text-xs md:text-[13px] font-bold text-gray-600 hover:bg-gray-50 transition-colors shadow-sm flex items-center gap-1.5">
                            <Navigation size={14} /> Navigate
                          </button>
                          <button className="px-4 py-2 bg-[#EEF6DF] rounded-lg text-xs md:text-[13px] font-bold text-[#65A30D] hover:bg-[#dceac9] transition-colors shadow-sm">
                            Start Inspection
                          </button>
                        </>
                      ) : (
                        <button className="px-4 py-2 border border-[#65A30D] text-[#65A30D] rounded-lg text-xs md:text-[13px] font-bold hover:bg-[#EEF6DF] transition-colors shadow-sm flex items-center gap-1.5">
                          View Report
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* READ-ONLY ORGANIZATION DRAWER */}
      {selectedUserId && (
        <OrganizationDrawer 
          userId={selectedUserId} 
          adminRole="admin_accreditation" // Passes the specific role so the Drawer automatically disables editing
          onClose={() => setSelectedUserId(null)}
          onRefreshTable={fetchMyAssignments}
        />
      )}

    </div>
  );
}