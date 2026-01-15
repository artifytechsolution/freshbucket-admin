// "use client";
// import React, { useState, useEffect } from "react";
// import { motion, AnimatePresence, PanInfo } from "framer-motion";
// import { FiArrowUpRight, FiChevronLeft, FiChevronRight } from "react-icons/fi";

// // ================= DATA =================
// const features = [
//   {
//     id: "01",
//     title: "Heritage Weaves",
//     tagline: "The Art of Mulmul",
//     description: "Krambica specializes in authentic Mulmul cotton, a fabric so light it was once known as 'woven wind' by Indian royalty.",
//     image: "https://images.unsplash.com/photo-1617391764618-976239dfc82d?q=80&w=2070&auto=format&fit=crop",
//   },
//   {
//     id: "02",
//     title: "Hand-Block Magic",
//     tagline: "Artisan Crafted",
//     description: "No digital prints here. Our fabrics are hand-stamped by master artisans in Jaipur, giving every inch a human touch.",
//     image: "https://images.unsplash.com/photo-1605218427368-35b0f2a00e47?q=80&w=2060&auto=format&fit=crop",
//   },
//   {
//     id: "03",
//     title: "Slow Fashion",
//     tagline: "Consciously Created",
//     description: "We produce in small batches to minimize waste. Fashion that feels good on your skin and better for the earth.",
//     image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?q=80&w=2070&auto=format&fit=crop",
//   },
//   {
//     id: "04",
//     title: "Tailored Freedom",
//     tagline: "Fits Like a Dream",
//     description: "Silhouettes designed for movement. Breathable, relaxed, yet effortlessly chic for the modern Indian woman.",
//     image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=2459&auto=format&fit=crop",
//   },
// ];

// const WhyChooseUs = () => {
//   const [active, setActive] = useState(0);
//   const [isAutoPlaying, setIsAutoPlaying] = useState(true);

//   // Auto-rotate logic
//   useEffect(() => {
//     if (!isAutoPlaying) return;
//     const timer = setInterval(() => {
//       setActive((prev) => (prev + 1) % features.length);
//     }, 5000);
//     return () => clearInterval(timer);
//   }, [isAutoPlaying]);

//   // Handle Swipe on Mobile
//   const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
//     if (info.offset.x > 50) {
//       // Swipe Right (Previous)
//       setActive((prev) => (prev === 0 ? features.length - 1 : prev - 1));
//     } else if (info.offset.x < -50) {
//       // Swipe Left (Next)
//       setActive((prev) => (prev + 1) % features.length);
//     }
//   };

//   return (
//     <section className="relative py-12 lg:py-32 bg-[#FDFCF8] overflow-hidden text-[#1A1A1A]">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
//         {/* HEADER */}
//         <div className="mb-10 lg:mb-24 flex flex-col lg:flex-row items-start lg:items-end justify-between gap-6 border-b border-[#E5E0D8] pb-6 lg:pb-8">
//           <div>
//             <span className="block text-[#8B9D83] font-medium tracking-widest text-xs uppercase mb-2">
//               Our Philosophy
//             </span>
//             <h2 className="text-3xl sm:text-4xl lg:text-6xl font-serif leading-tight">
//               Why <span className="italic text-[#6B7B64]">Krambica?</span>
//             </h2>
//           </div>
//           <p className="max-w-md text-[#555] text-sm lg:text-base leading-relaxed">
//             We don't just sell clothes; we craft experiences. Discover the pillars that define our commitment to elegance and quality.
//           </p>
//         </div>

//         {/* CONTENT GRID */}
//         {/* On Mobile: Flex Column Reverse (Text below Image) OR Standard Column. 
//             I chose Standard Column but moved Image to TOP visually on mobile for better context. */}
//         <div 
//           className="flex flex-col lg:grid lg:grid-cols-12 gap-8 lg:gap-20 items-start"
//           onMouseEnter={() => setIsAutoPlaying(false)}
//           onMouseLeave={() => setIsAutoPlaying(true)}
//         >
          
//           {/* MOBILE IMAGE CONTAINER (Visible First on Mobile) */}
//           <div className="w-full lg:col-span-7 relative h-[400px] sm:h-[500px] lg:h-[700px] order-1 lg:order-2">
//             <div className="relative w-full h-full rounded-2xl lg:rounded-t-[100px] lg:rounded-b-[20px] overflow-hidden shadow-2xl shadow-[#6B7B64]/10 touch-pan-y">
              
//               <AnimatePresence mode="wait">
//                 <motion.img
//                   key={active}
//                   src={features[active].image}
//                   alt={features[active].title}
//                   initial={{ scale: 1.1, opacity: 0 }}
//                   animate={{ scale: 1, opacity: 1 }}
//                   exit={{ scale: 1.05, opacity: 0 }}
//                   transition={{ duration: 0.7, ease: "easeOut" }}
//                   // Add drag for swipe support
//                   drag="x"
//                   dragConstraints={{ left: 0, right: 0 }}
//                   dragElastic={0.2}
//                   onDragEnd={handleDragEnd}
//                   className="absolute inset-0 w-full h-full object-cover cursor-grab active:cursor-grabbing"
//                 />
//               </AnimatePresence>

//               {/* OVERLAY GRADIENT */}
//               <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
              
//               {/* MOBILE OVERLAY TEXT (Since list is below, show title on image for context) */}
//               <div className="absolute bottom-4 left-4 lg:hidden text-white pointer-events-none">
//                 <p className="text-xs uppercase tracking-widest opacity-80 mb-1">
//                   {features[active].tagline}
//                 </p>
//                 <p className="text-xl font-serif">
//                   {features[active].title}
//                 </p>
//               </div>

//               {/* MOBILE NAVIGATION ARROWS */}
//               <div className="absolute bottom-4 right-4 flex gap-2 lg:hidden">
//                  <button 
//                     onClick={(e) => { e.stopPropagation(); setActive(active === 0 ? features.length - 1 : active - 1); }}
//                     className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white active:bg-white/40"
//                  >
//                    <FiChevronLeft />
//                  </button>
//                  <button 
//                     onClick={(e) => { e.stopPropagation(); setActive((active + 1) % features.length); }}
//                     className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white active:bg-white/40"
//                  >
//                    <FiChevronRight />
//                  </button>
//               </div>

//               {/* DESKTOP ROTATING BADGE (Hidden on Mobile) */}
//               <div className="hidden lg:block absolute bottom-10 right-10 pointer-events-none">
//                 <div className="relative w-32 h-32 flex items-center justify-center">
//                    <motion.div 
//                      animate={{ rotate: 360 }}
//                      transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
//                      className="absolute inset-0"
//                    >
//                      <svg viewBox="0 0 100 100" className="w-full h-full fill-[#FDFCF8]">
//                        <path id="circlePath" d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" fill="none" />
//                        <text fontSize="13.5" fontWeight="bold" letterSpacing="2px">
//                          <textPath href="#circlePath">KRAMBICA • EST 2018 • PURE •</textPath>
//                        </text>
//                      </svg>
//                    </motion.div>
//                    <div className="w-12 h-12 bg-[#FDFCF8] rounded-full flex items-center justify-center shadow-lg text-[#6B7B64]">
//                      <FiArrowUpRight className="text-xl" />
//                    </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* LEFT: TEXT NAVIGATION (Below image on Mobile, Left on Desktop) */}
//           <div className="w-full lg:col-span-5 flex flex-col gap-2 order-2 lg:order-1">
//             {features.map((item, index) => {
//               const isActive = active === index;

//               return (
//                 <div
//                   key={item.id}
//                   onMouseEnter={() => setActive(index)}
//                   onClick={() => setActive(index)}
//                   className="group relative cursor-pointer"
//                 >
//                   <motion.div
//                     className={`relative pl-6 lg:pl-8 pr-4 py-5 lg:py-6 border-l-2 transition-colors duration-500 ${
//                       isActive ? "border-[#6B7B64] bg-[#F4F1EB]" : "border-[#E5E0D8] hover:border-[#D0C8BC]"
//                     }`}
//                   >
//                     {/* Active Indicator Line */}
//                     {isActive && (
//                       <motion.div
//                         layoutId="activeIndicator"
//                         className="absolute left-[-2px] top-0 bottom-0 w-[2px] bg-[#2A3B28] z-10"
//                       />
//                     )}

//                     <div className="flex items-center justify-between mb-2">
//                       <span className={`text-[10px] lg:text-xs font-bold tracking-widest uppercase ${isActive ? "text-[#6B7B64]" : "text-[#999]"}`}>
//                         {item.id}
//                       </span>
//                       {/* Hide arrow on mobile to save space, show on desktop */}
//                       <motion.div
//                         animate={{ rotate: isActive ? 45 : 0, opacity: isActive ? 1 : 0 }}
//                         className="text-[#6B7B64] hidden lg:block"
//                       >
//                          <FiArrowUpRight className="text-xl" />
//                       </motion.div>
//                     </div>

//                     <h3 className={`text-lg lg:text-2xl font-serif transition-colors duration-300 ${isActive ? "text-[#1A1A1A]" : "text-[#888] group-hover:text-[#555]"}`}>
//                       {item.title}
//                     </h3>

//                     {/* Expandable Content */}
//                     <motion.div
//                       initial={false}
//                       animate={{ height: isActive ? "auto" : 0, opacity: isActive ? 1 : 0 }}
//                       className="overflow-hidden"
//                     >
//                       <div className="pt-3 lg:pt-4">
//                         <p className="text-[#6B7B64] text-[10px] lg:text-xs font-semibold uppercase tracking-wide mb-1 lg:mb-2">
//                           {item.tagline}
//                         </p>
//                         <p className="text-[#555] text-sm leading-relaxed font-light">
//                           {item.description}
//                         </p>
//                       </div>
//                     </motion.div>
//                   </motion.div>
//                 </div>
//               );
//             })}
//           </div>

//         </div>
//       </div>
//     </section>
//   );
// };

// export default WhyChooseUs;

"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiAsterisk } from "react-icons/fi";

// ================= DATA CONFIGURATION =================
const features = [
  {
    id: "01",
    title: "Trendsetting Designs",
    description: "Ahead of the curve with styles that define the season.",
    // Replace with your active image
    image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=1770&auto=format&fit=crop",
  },
  {
    id: "02",
    title: "Sustainable Fashion",
    description: "Eco-friendly choices you'll love and feel good about.",
    image: "https://images.unsplash.com/photo-1550614000-4b9519e02a48?q=80&w=1770&auto=format&fit=crop",
  },
  {
    id: "03",
    title: "Quality Craftsmanship",
    description: "Garments made to last with attention to every detail.",
    image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=1770&auto=format&fit=crop",
  },
  {
    id: "04",
    title: "Inclusive Sizing",
    description: "Fashion for every body, ensuring the perfect fit for all.",
    image: "https://images.unsplash.com/photo-1605763240004-7d93b172d7cd?q=80&w=1770&auto=format&fit=crop",
  },
  {
    id: "05",
    title: "Customer-Centric",
    description: "We're with you every step of the way.",
    image: "https://images.unsplash.com/photo-1554412933-514a83d2f3c8?q=80&w=1770&auto=format&fit=crop",
  },
];

// ================= SECTION 1: WHY CHOOSE (INTERACTIVE) =================
const WhyChooseSection = () => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section className="py-16 lg:py-24 bg-[#FFFCF5] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-xs font-bold tracking-[0.2em] text-gray-500 uppercase mb-3">
            Values
          </p>
          <h2 className="text-4xl lg:text-5xl text-gray-800">
            Why Choose <span className="text-[#F4C45D] font-serif">Krambica</span>
          </h2>
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          
          {/* LEFT: Text List */}
          <div className="w-full lg:w-1/2 flex flex-col gap-8 lg:pl-10">
            {features.map((item, index) => {
              const isActive = activeTab === index;
              return (
                <div 
                  key={item.id}
                  onClick={() => setActiveTab(index)}
                  className="group cursor-pointer flex items-start gap-6 lg:gap-8"
                >
                  <span className={`text-2xl font-medium pt-1 transition-colors duration-300 ${
                    isActive ? "text-gray-800" : "text-gray-400"
                  }`}>
                    {item.id}
                  </span>
                  <div>
                    <h3 className={`text-2xl lg:text-3xl transition-colors duration-300 mb-2 ${
                      isActive 
                        ? "text-[#5F6F52] font-medium" // Active Green
                        : "text-gray-600 font-normal group-hover:text-gray-800"
                    }`}>
                      {item.title}
                    </h3>
                    <p className="text-gray-500 text-sm lg:text-base font-light">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* RIGHT: Image Display */}
          <div className="w-full lg:w-1/2 h-[400px] lg:h-[600px] relative">
            <AnimatePresence mode="wait">
              <motion.img
                key={activeTab}
                src={features[activeTab].image}
                alt={features[activeTab].title}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0 w-full h-full object-cover rounded-2xl shadow-lg"
              />
            </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
  );
};

// ================= SECTION 2: GLAMOUR COLLECTION (BANNER) =================
const GlamourCollectionSection = () => {
  return (
    <section className="py-20 bg-[#FFFCF5]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* LEFT IMAGE (Arch Top Right) */}
          <div className="lg:col-span-4 relative h-[400px] lg:h-[550px]">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1964&auto=format&fit=crop"
              alt="Collection Model 1"
              // The specific rounded corner from your 2nd image
              className="w-full h-full object-cover shadow-xl rounded-tl-xl rounded-bl-xl rounded-tr-[120px] rounded-br-xl"
            />
          </div>

          {/* CENTER GRAPHIC & TEXT */}
          <div className="lg:col-span-4 text-center flex flex-col items-center justify-center relative z-10">
            {/* Decorative Flower/Star Icon */}
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="text-[#F4C45D] text-8xl lg:text-9xl mb-8 opacity-80"
            >
              {/* <FiAsterisk /> */}
            </motion.div>

            <span className="text-[#F4C45D] font-bold tracking-[0.2em] uppercase text-xs mb-4 block">
              A Glamour Collection
            </span>
            
            <p className="text-gray-600 text-lg leading-relaxed max-w-xs mx-auto mb-2">
              A limited-edition range that embodies elegance, grace, and timeless beauty.
            </p>
            
            <p className="text-gray-500 italic font-serif">
              Only at Krambica
            </p>
          </div>

          {/* RIGHT IMAGE (Arch Top Left) */}
          <div className="lg:col-span-4 relative h-[300px] lg:h-[400px] mt-10 lg:mt-32">
             <img
              src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1964&auto=format&fit=crop"
              alt="Collection Model 2"
              // The specific rounded corner from your 2nd image (Mirrored)
              className="w-full h-full object-cover shadow-xl rounded-tr-xl rounded-br-xl rounded-tl-[120px] rounded-bl-xl"
            />
          </div>

        </div>
      </div>
    </section>
  );
};

// ================= MAIN EXPORT =================
const KrambicaPage = () => {
  return (
    <div className="w-full">
      {/* <WhyChooseSection /> */}
      <GlamourCollectionSection />
    </div>
  );
};

export default KrambicaPage;