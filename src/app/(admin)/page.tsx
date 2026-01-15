// import type { Metadata } from "next";
// import { EcommerceMetrics } from "@/components/ecommerce/EcommerceMetrics";
// import React from "react";
// import MonthlyTarget from "@/components/ecommerce/MonthlyTarget";
// import MonthlySalesChart from "@/components/ecommerce/MonthlySalesChart";
// import StatisticsChart from "@/components/ecommerce/StatisticsChart";
// import RecentOrders from "@/components/ecommerce/RecentOrders";
// import DemographicCard from "@/components/ecommerce/DemographicCard";

// export const metadata: Metadata = {
//   title:
//     "Next.js E-commerce Dashboard | TailAdmin - Next.js Dashboard Template",
//   description: "This is Next.js Home for TailAdmin Dashboard Template",
// };

// export default function Ecommerce() {
//   return (
//     <div className="grid grid-cols-12 gap-4 md:gap-6">
//       <div className="col-span-12 space-y-6 xl:col-span-7">
//         <EcommerceMetrics />

//         <MonthlySalesChart />
//       </div>

//       <div className="col-span-12 xl:col-span-5">
//         <MonthlyTarget />
//       </div>

//       <div className="col-span-12">
//         <StatisticsChart />
//       </div>

//       <div className="col-span-12 xl:col-span-5">
//         <DemographicCard />
//       </div>

//       <div className="col-span-12 xl:col-span-7">
//         <RecentOrders />
//       </div>
//     </div>
//   );
// }

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Revour Hotels Portal | TailAdmin - Next.js Dashboard Template",
  description:
    "Manage bookings, guests, staff, and operations seamlessly with the Revour Hotels management portal.",
};

export default function RevourHotelsHome() {
  return (
    <main className="min-h-dvh bg-gray-50 flex items-center justify-center px-6">
      <div className="max-w-3xl text-center space-y-6">
        {/* Brand Title */}
        <h1 className="text-4xl font-bold text-gray-900">
          Welcome to FreshBucket Portal
        </h1>

       

        {/* Supporting text */}
        <p className="text-gray-500">
          From reservations and payments to room availability and staff
          management, Revour Hotels Portal keeps everything in one place.
          Access real-time insights and provide your guests with the best
          experience possible.
        </p>

        {/* Call to Action Buttons */}
        <div className="flex justify-center gap-4 pt-4">
          <a
            href="/hotels"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
          >
            Manage Bookings
          </a>
         
        </div>
      </div>
    </main>
  );
}
