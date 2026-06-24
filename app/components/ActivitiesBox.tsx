"use client";

import React from "react";

// 1. Define the shape of your data for TypeScript
export interface Activity {
  id: string | number;
  action: string;
  category: string;
  date: string;
  status: string;
}

interface ActivitiesBoxProps {
  activities?: Activity[];
}

// 2. Default mock data (matches your original design)
const defaultActivities: Activity[] = [
  { id: 1, action: "Account Creation", category: "Audiology Clinic", date: "July 31, 2025", status: "Successful" },
  { id: 2, action: "Assessment form Submitted", category: "-", date: "-", status: "-" },
  { id: 3, action: "Payment", category: "-", date: "-", status: "-" },
  { id: 4, action: "Accept Visitation", category: "-", date: "-", status: "-" },
];

export default function ActivitiesBox({ activities = defaultActivities }: ActivitiesBoxProps) {
  return (
    <div className="bg-white rounded-[24px] p-5 md:p-6 shadow-sm border border-gray-100 w-full overflow-hidden">
      <h3 className="w-full border-b-[2px] border-gray-200 pb-4 mb-5 font-bold text-gray-800 text-[15px]">
        Activities:
      </h3>
      <div className="w-full overflow-x-auto pb-1">
        <div className="flex flex-col text-[13px] md:text-[12.5px] min-w-[600px] whitespace-nowrap">
          
          {/* 3. Map through the data array automatically */}
          {activities.map((activity, index) => {
            const isLast = index === activities.length - 1;
            
            // Check if this row is a placeholder by checking if the date or status is a "-"
            const isPlaceholder = activity.date === "-" || activity.status === "-";

            return (
              <div
                key={activity.id}
                className={`grid grid-cols-4 gap-4 ${
                  isLast ? "pt-3.5" : "py-3.5 border-b border-gray-100"
                } ${
                  // Apply faded color ONLY if it's a placeholder, otherwise use solid text
                  isPlaceholder ? "text-[#d1d5db]" : "text-gray-700 font-medium"
                }`}
              >
                <div>{activity.action}</div>
                <div>{activity.category}</div>
                <div>{activity.date}</div>
                <div className="text-right pr-2">{activity.status}</div>
              </div>
            );
          })}
          
        </div>
      </div>
    </div>
  );
}