"use client";
import React, { useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useSidebar } from "../context/SidebarContext";
import {
  ChevronDownIcon,
  UserIcon,
  HorizontaLDots,
} from "../icons/index";
import { AlarmOffRounded, Apple, Hotel, OfflineShareRounded } from "@mui/icons-material";
import SidebarWidget from "./SidebarWidget";

// Cleaned data-only nav config
const navItems = [
  { icon: <UserIcon />, name: "Users", path: "/users" },
  { icon: <Apple />, name: "Products", path: "/products" },
  { icon: <AlarmOffRounded />, name: "Orders", path: "/orders" },
  { icon: <OfflineShareRounded />, name: "cupons", path: "/cupons" },
  // { icon: <AlarmOffRounded />, name: "Order Details", path: "/orderdetails" },
  // { icon: <Hotel />, name: "Hotel Unavailable", path: "/hotelunavailable" },
  // { icon: <Hotel />, name: "Hotel Edit", path: "/hoteledit" },
  // { icon: <Hotel />, name: "Reserved Schedule", path: "/reservedHotelsSchedule" },
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const pathname = usePathname();
  const router = useRouter();

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const isActive = useCallback((path: string) => path === pathname, [pathname]);

  const toggleMenu = (index: number) => {
    setOpenIndex(prev => (prev === index ? null : index));
  };

  const handleLogout = () => {
    localStorage.clear();
    router.push("/signin");
  };

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 z-50
      ${isExpanded || isMobileOpen || isHovered ? "w-[290px]" : "w-[90px]"}
      ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
      lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* HEADER / LOGO */}
      <div className={`py-8 flex ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"}`}>
        <Link href="/">
          {/* {isExpanded || isHovered || isMobileOpen ? (
            <>
              <Image src="/images/logo/logodata123.png" alt="Logo" width={150} height={40} className="dark:hidden" />
              <Image src="/images/logo/logodata123.png" alt="Logo" width={150} height={40} className="hidden dark:block" />
            </>
          ) : (
            <Image src="/images/logo/logodata123.png" alt="Logo" width={32} height={32} />
          )} */}
         <h1 className="text-5xl">Fresh Buckets</h1> 
        </Link>
      </div>

      {/* NAVIGATION */}
      <div className="flex flex-col overflow-y-auto no-scrollbar">
        <nav className="mb-6">
          <h2 className={`mb-4 text-xs uppercase text-gray-400 flex ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"}`}>
            {isExpanded || isHovered || isMobileOpen ? "Menu" : <HorizontaLDots />}
          </h2>

          <ul className="flex flex-col gap-4">
            {navItems.map((nav, index) => (
              <li key={index}>
                <Link
                  href={nav.path}
                  className={`menu-item group ${isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"}`}
                >
                  <span className={`${isActive(nav.path) ? "menu-item-icon-active" : "menu-item-icon-inactive"}`}>
                    {nav.icon}
                  </span>
                  {(isExpanded || isHovered || isMobileOpen) && <span className="menu-item-text">{nav.name}</span>}
                </Link>
              </li>
            ))}

            {/* LOGOUT */}
            <li>
              <button onClick={handleLogout} className="menu-item group text-red-600 hover:text-red-800">
                <span className="menu-item-icon-inactive"><UserIcon /></span>
                {(isExpanded || isHovered || isMobileOpen) && <span className="menu-item-text">Logout</span>}
              </button>
            </li>
          </ul>
        </nav>

        {isExpanded || isHovered || isMobileOpen ? <SidebarWidget /> : null}
      </div>
    </aside>
  );
};

export default AppSidebar;