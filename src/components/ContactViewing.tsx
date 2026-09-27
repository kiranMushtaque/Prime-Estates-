import React, { useState } from 'react';
import { Calendar, Phone, Mail, MapPin, CheckCircle2, Clock, Send, ShieldCheck } from 'lucide-react';
import { TextReveal } from './TextReveal';
import { MagneticButton } from './MagneticButton';

interface ContactViewingProps {
  initialPropertyTitle?: string;
}

export const ContactViewing: React.FC<ContactViewingProps> = ({ initialPropertyTitle = '' }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    propertyType: 'Coastal Villas & Mansions',
    budgetPkr: 'PKR 20 - 35 Crore',
    preferredDate: '',
    notes: initialPropertyTitle ? `Inquiring about ${initialPropertyTitle}` : ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [bookingRef, setBookingRef] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate instant secure processing
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setBookingRef(`MRE-AZB-${Math.floor(1000 + Math.random() * 9000)}`);
    }, 700);
  };

  return (
    <section id="contact" className="py-24 bg-[#090a0f] text-white relative overflow-hidden border-t border-white/5">
      {/* Ambient gradient */}
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#C9A24B]/5 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Agency Credentials & Private Office Info (5 cols) */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <span className="text-xs font-mono tracking-widest text-[#C9A24B] uppercase block mb-2">
                CONFIDENTIAL ENGAGEMENT
              </span>
              <div className="mb-4">
                <TextReveal
                  text="Schedule a Private Viewing"
                  as="h2"
                  className="font-serif text-3xl md:text-5xl font-bold text-white"
                />
              </div>
              <p className="text-stone-300 text-sm leading-relaxed">
                Whether you wish to tour The Cliffside Villa in person or preview unlisted off-market coastal holdings across Azure Bay, our senior partners are at your service.
              </p>
            </div>

            {/* Office Contact Cards */}
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-[#12141c]/80 border border-white/10 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-[#C9A24B]/30 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-[#C9A24B]" />
                </div>
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-stone-400 block mb-0.5">
                    Azure Bay Private Office
                  </span>
                  <p className="text-sm font-semibold text-white">
                    Level 12, Ocean Spire, Marina Crest Boulevard, Azure Bay
                  </p>
                  <p className="text-xs text-stone-400 mt-0.5">
                    Coastal Pavilion: Coral Ridge Sea Promenade
                  </p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[#12141c]/80 border border-white/10 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-[#C9A24B]/30 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-[#C9A24B]" />
                </div>
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-stone-400 block mb-0.5">
                    Direct Partner Line & WhatsApp
                  </span>
                  <a href="tel:+923000000000" className="text-sm font-semibold text-white hover:text-[#DFBF6D]">
                    +92 300 0000000
                  </a>
                  <p className="text-xs text-stone-400 mt-0.5">
                    Mon - Sun: 9:00 AM – 9:00 PM PKT
                  </p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[#12141c]/80 border border-white/10 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-[#C9A24B]/30 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-[#C9A24B]" />
                </div>
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-stone-400 block mb-0.5">
                    Private Correspondence
                  </span>
                  <a href="mailto:hello@example.com" className="text-sm font-semibold text-white hover:text-[#DFBF6D]">
                    hello@example.com
                  </a>
                  <p className="text-xs text-stone-400 mt-0.5">
                    Encrypted Escrow & Advisory Services
                  </p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[#12141c]/80 border border-white/10 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-[#C9A24B]/30 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5 text-[#C9A24B]" />
                </div>
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-stone-400 block mb-0.5">
                    Verified Title & Escrow
                  </span>
                  <p className="text-sm font-semibold text-white">
                    Guaranteed Clear Coastal Title · Legal Escrow Representation
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: "Book a Viewing" Form (7 cols) */}
          <div className="lg:col-span-7 bg-[#12141c] rounded-3xl border border-[#C9A24B]/30 p-8 sm:p-10 shadow-2xl backdrop-blur-xl relative">
            {isSubmitted ? (
              <div className="py-12 flex flex-col items-center text-center animate-fadeIn">
                <div className="w-16 h-16 rounded-full bg-[#C9A24B]/20 border border-[#C9A24B] flex items-center justify-center mb-6">
                  <CheckCircle2 className="w-8 h-8 text-[#C9A24B]" />
                </div>
                <span className="text-xs font-mono text-[#DFBF6D] uppercase tracking-widest block mb-2">
                  CONFIRMATION RECEIVED
                </span>
                <h3 className="font-serif text-3xl font-bold text-white mb-2">
                  Viewing Request Reserved
                </h3>
                <p className="text-stone-300 text-sm max-w-md mb-6 leading-relaxed">
                  Thank you, <span className="text-white font-semibold">{formData.fullName}</span>. A Meridian Estates private viewing director will contact you on{' '}
                  <span className="text-white font-mono">{formData.phone}</span> within 2 hours to confirm your private escort.
                </p>

                <div className="p-4 rounded-xl bg-black/50 border border-white/10 text-xs font-mono text-stone-400 mb-8">
                  <span>BOOKING REFERENCE: </span>
                  <span className="text-[#DFBF6D] font-bold">{bookingRef}</span>
                </div>

                <button
                  onClick={() => setIsSubmitted(false)}
                  className="px-6 py-2.5 rounded-xl border border-white/20 hover:border-[#C9A24B] text-xs font-mono tracking-wider uppercase text-white hover:text-[#C9A24B] transition-colors cursor-pointer"
                >
                  Schedule Another Appointment
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Name */}
                  <div>
                    <label className="block text-xs font-mono uppercase text-stone-300 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Tariq Mansoor"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 focus:border-[#C9A24B] focus:outline-none text-sm text-white placeholder-stone-600 transition-colors"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-xs font-mono uppercase text-stone-300 mb-2">
                      Phone / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+92 300 0000000"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 focus:border-[#C9A24B] focus:outline-none text-sm text-white placeholder-stone-600 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Property Type */}
                  <div>
                    <label className="block text-xs font-mono uppercase text-stone-300 mb-2">
                      Property Category
                    </label>
                    <select
                      value={formData.propertyType}
                      onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 focus:border-[#C9A24B] focus:outline-none text-sm text-white transition-colors"
                    >
                      <option value="Coastal Villas & Mansions">Coastal Villas & Mansions</option>
                      <option value="Marina Sky Penthouses">Marina Sky Penthouses</option>
                      <option value="Prime Seafront Plots">Prime Seafront Plots</option>
                      <option value="Commercial & Marinas">Commercial & Marina Assets</option>
                    </select>
                  </div>

                  {/* Budget in PKR */}
                  <div>
                    <label className="block text-xs font-mono uppercase text-stone-300 mb-2">
                      Budget Bracket (PKR)
                    </label>
                    <select
                      value={formData.budgetPkr}
                      onChange={(e) => setFormData({ ...formData, budgetPkr: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 focus:border-[#C9A24B] focus:outline-none text-sm text-white transition-colors"
                    >
                      <option value="PKR 10 - 20 Crore">PKR 10 - 20 Crore</option>
                      <option value="PKR 20 - 35 Crore">PKR 20 - 35 Crore</option>
                      <option value="PKR 35 - 60 Crore">PKR 35 - 60 Crore</option>
                      <option value="PKR 60 Crore+">PKR 60 Crore + (Bespoke Coastal Mansions)</option>
                    </select>
                  </div>
                </div>

                {/* Preferred Date */}
                <div>
                  <label className="block text-xs font-mono uppercase text-stone-300 mb-2">
                    Preferred Viewing Date
                  </label>
                  <input
                    type="date"
                    value={formData.preferredDate}
                    onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 focus:border-[#C9A24B] focus:outline-none text-sm text-white transition-colors"
                  />
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-xs font-mono uppercase text-stone-300 mb-2">
                    Special Inquiries or Preferred Enclave
                  </label>
                  <textarea
                    rows={3}
                    placeholder="e.g. Inquiring about The Cliffside Villa in Coral Ridge, or waterfront penthouses with yacht berth..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 focus:border-[#C9A24B] focus:outline-none text-sm text-white placeholder-stone-600 transition-colors"
                  />
                </div>

                {/* Submit CTA */}
                <MagneticButton
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-[#C9A24B] to-[#DFBF6D] hover:from-[#b8913d] hover:to-[#ceaf5e] text-black font-semibold text-sm tracking-wider uppercase shadow-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Confirming Reservation...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4 text-black" />
                      <span>Confirm Private Viewing Request</span>
                    </>
                  )}
                </MagneticButton>

                <p className="text-center text-[11px] text-stone-500 font-mono">
                  All inquiries treated with strict diplomatic confidentiality. No third-party spam.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
