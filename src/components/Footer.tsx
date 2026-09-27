import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#06070a] border-t border-white/10 text-stone-400 py-16 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
        {/* Brand Column */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-full border border-[#C9A24B] flex items-center justify-center font-serif text-sm text-[#C9A24B]">M</span>
            <span className="font-serif text-2xl font-bold tracking-tight text-white">
              Meridian Estates
            </span>
          </div>
          <p className="text-stone-300 text-xs sm:text-sm max-w-sm leading-relaxed">
            Azure Bay’s premier architectural real estate advisory specializing in bespoke coastal sanctuaries, oceanfront cliffside villas, and luxury sky penthouses.
          </p>
          <div className="text-[11px] font-mono text-stone-500 space-y-1">
            <p>Coastal Property Registration: MRE-AZB-9901</p>
            <p>Direct Escrow & Title Protection</p>
          </div>
        </div>

        {/* Sectors Column */}
        <div>
          <h4 className="text-xs font-mono uppercase tracking-widest text-stone-200 mb-4">
            Azure Bay Enclaves
          </h4>
          <ul className="space-y-2 text-xs text-stone-400">
            <li>Coral Ridge Coastal Bluffs</li>
            <li>Marina Crest Sky Residences</li>
            <li>Palm Heights Parkland Manors</li>
            <li>Old Harbour District Lofts</li>
            <li>Peninsula Point Promontory</li>
          </ul>
        </div>

        {/* Private Client Desk */}
        <div>
          <h4 className="text-xs font-mono uppercase tracking-widest text-stone-200 mb-4">
            Private Client Desk
          </h4>
          <div className="space-y-2 text-xs text-stone-400">
            <p>Ocean Spire, Marina Crest, Azure Bay</p>
            <p>Direct: +92 300 0000000</p>
            <p>Email: hello@example.com</p>
            <p>WhatsApp: +92 300 0000000</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-[11px] text-stone-500 font-mono gap-4">
        <div>
          © {new Date().getFullYear()} Meridian Estates. All rights reserved.
        </div>
        <div className="text-center sm:text-right">
          {/* USER SPECIFICATION: Add a small footer line: "Demo website. All names, places and prices are fictional." */}
          <span className="text-[#DFBF6D]/80 font-medium">Demo website. All names, places and prices are fictional.</span>
        </div>
      </div>
    </footer>
  );
};
