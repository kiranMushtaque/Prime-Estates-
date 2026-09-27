import React, { useState, useEffect, useRef } from 'react';
import { Calculator, ArrowRight, DollarSign, PieChart, ShieldCheck } from 'lucide-react';
import { TextReveal } from '../TextReveal';
import { MagneticButton } from '../MagneticButton';

interface EmiCalculatorProps {
  onScheduleViewing?: (propertyTitle?: string) => void;
  onScheduleConsultation?: () => void;
}

export const EmiCalculator: React.FC<EmiCalculatorProps> = ({
  onScheduleViewing,
  onScheduleConsultation
}) => {
  // Price in Crores (PKR)
  const [priceCrore, setPriceCrore] = useState<number>(28.5);
  // Down payment percentage
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(25);
  // Loan tenure in years
  const [loanYears, setLoanYears] = useState<number>(20);
  // Annual interest rate percentage
  const [interestRate, setInterestRate] = useState<number>(11.5);

  // Animated EMI monthly value
  const [animatedEmi, setAnimatedEmi] = useState<number>(0);
  const emiTargetRef = useRef<number>(0);
  const emiAnimRef = useRef<number | null>(null);

  // Calculations: 1 Crore = 10,000,000 PKR
  const propertyPricePkr = priceCrore * 10000000;
  const downPaymentAmountPkr = propertyPricePkr * (downPaymentPercent / 100);
  const principalPkr = propertyPricePkr - downPaymentAmountPkr;

  const monthlyRate = interestRate / 100 / 12;
  const totalMonths = loanYears * 12;

  let calculatedEmi = 0;
  if (principalPkr > 0 && monthlyRate > 0 && totalMonths > 0) {
    const factor = Math.pow(1 + monthlyRate, totalMonths);
    calculatedEmi = Math.round((principalPkr * monthlyRate * factor) / (factor - 1));
  }

  const totalRepaymentPkr = calculatedEmi * totalMonths;
  const totalInterestPkr = Math.max(0, totalRepaymentPkr - principalPkr);

  // Principal vs Interest ratio
  const principalRatio = totalRepaymentPkr > 0 ? (principalPkr / totalRepaymentPkr) * 100 : 50;
  const interestRatio = 100 - principalRatio;

  // Animated count-up for monthly EMI
  useEffect(() => {
    emiTargetRef.current = calculatedEmi;
    const startValue = animatedEmi;
    const targetValue = calculatedEmi;
    const startTime = performance.now();
    const duration = 600; // ms

    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(startValue + (targetValue - startValue) * eased);
      setAnimatedEmi(current);

      if (progress < 1) {
        emiAnimRef.current = requestAnimationFrame(step);
      }
    };

    if (emiAnimRef.current) cancelAnimationFrame(emiAnimRef.current);
    emiAnimRef.current = requestAnimationFrame(step);

    return () => {
      if (emiAnimRef.current) cancelAnimationFrame(emiAnimRef.current);
    };
  }, [calculatedEmi]);

  // Format currency helpers
  const formatPkr = (amount: number) => {
    if (amount >= 10000000) {
      return `PKR ${(amount / 10000000).toFixed(2)} Crore`;
    }
    if (amount >= 100000) {
      return `PKR ${(amount / 100000).toFixed(2)} Lakh`;
    }
    return `PKR ${amount.toLocaleString('en-PK')}`;
  };

  const formatMonthly = (amount: number) => {
    if (amount >= 100000) {
      return `${(amount / 100000).toFixed(2)} Lakh`;
    }
    return `${amount.toLocaleString('en-PK')}`;
  };

  // SVG Donut Chart Parameters
  const radius = 64;
  const strokeWidth = 18;
  const circumference = 2 * Math.PI * radius;
  const principalDash = (principalRatio / 100) * circumference;
  const interestDash = circumference - principalDash;

  return (
    <section id="calculator" className="py-24 bg-[#07080c] relative text-white overflow-hidden border-t border-white/5">
      {/* Ambient background glows */}
      <div className="absolute top-1/3 left-1/4 w-[500px] h-[350px] bg-[#C9A24B]/5 blur-[120px] pointer-events-none rounded-full" />
      <div className="absolute bottom-10 right-1/4 w-[400px] h-[300px] bg-[#DFBF6D]/5 blur-[100px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono tracking-widest text-[#C9A24B] uppercase block mb-2">
            PRIVATE WEALTH ADVISORY
          </span>
          <div className="mb-3">
            <TextReveal
              text="Coastal Acquisition & Mortgage Estimator"
              as="h2"
              className="font-serif text-3xl md:text-5xl font-bold text-white tracking-tight"
            />
          </div>
          <p className="text-stone-300 text-sm md:text-base leading-relaxed">
            Model confidential high-yield coastal financing with automated principal vs interest allocation for Azure Bay holdings.
          </p>

          {/* Quick preset chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
            <span className="text-xs text-stone-400 font-mono">Villa Presets:</span>
            <button
              type="button"
              onClick={() => {
                setPriceCrore(28.5);
                setDownPaymentPercent(25);
              }}
              className={`px-3 py-1 rounded-full text-xs font-mono transition-colors cursor-pointer ${
                priceCrore === 28.5
                  ? 'bg-[#C9A24B] text-black font-semibold'
                  : 'bg-white/5 hover:bg-white/10 text-stone-300 border border-white/10'
              }`}
            >
              The Cliffside Villa (PKR 28.5 Cr)
            </button>
            <button
              type="button"
              onClick={() => {
                setPriceCrore(14.8);
                setDownPaymentPercent(20);
              }}
              className={`px-3 py-1 rounded-full text-xs font-mono transition-colors cursor-pointer ${
                priceCrore === 14.8
                  ? 'bg-[#C9A24B] text-black font-semibold'
                  : 'bg-white/5 hover:bg-white/10 text-stone-300 border border-white/10'
              }`}
            >
              Marina Sky Penthouse (PKR 14.8 Cr)
            </button>
            <button
              type="button"
              onClick={() => {
                setPriceCrore(45.0);
                setDownPaymentPercent(30);
              }}
              className={`px-3 py-1 rounded-full text-xs font-mono transition-colors cursor-pointer ${
                priceCrore === 45.0
                  ? 'bg-[#C9A24B] text-black font-semibold'
                  : 'bg-white/5 hover:bg-white/10 text-stone-300 border border-white/10'
              }`}
            >
              Coral Bluff Haven (PKR 45.0 Cr)
            </button>
          </div>
        </div>

        {/* 2-Column Grid: Sliders on Left, Payment + Donut on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Sliders Container (7 Cols) */}
          <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-[#12141c]/80 border border-white/10 shadow-2xl backdrop-blur-xl space-y-6">
            {/* 1. Property Price Slider */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-mono uppercase text-stone-300 tracking-wider">
                  Property Acquisition Value
                </label>
                <span className="font-display font-bold text-lg text-[#DFBF6D]">
                  PKR {priceCrore.toFixed(1)} Crore
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="60"
                step="0.5"
                value={priceCrore}
                onChange={(e) => setPriceCrore(parseFloat(e.target.value))}
                className="w-full h-2 rounded-lg bg-black/60 accent-[#C9A24B] cursor-pointer"
              />
              <div className="flex justify-between text-[11px] font-mono text-stone-400 mt-1">
                <span>PKR 5 Cr</span>
                <span>PKR 30 Cr</span>
                <span>PKR 60 Cr</span>
              </div>
            </div>

            {/* 2. Down Payment Slider */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-mono uppercase text-stone-300 tracking-wider">
                  Initial Down Payment ({downPaymentPercent}%)
                </label>
                <span className="font-display font-bold text-base text-white">
                  {formatPkr(downPaymentAmountPkr)}
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="50"
                step="1"
                value={downPaymentPercent}
                onChange={(e) => setDownPaymentPercent(parseInt(e.target.value, 10))}
                className="w-full h-2 rounded-lg bg-black/60 accent-[#C9A24B] cursor-pointer"
              />
              <div className="flex justify-between text-[11px] font-mono text-stone-400 mt-1">
                <span>10% (Minimum)</span>
                <span>25% (Standard)</span>
                <span>50% (Equity Plus)</span>
              </div>
            </div>

            {/* 3. Loan Term Slider */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-mono uppercase text-stone-300 tracking-wider">
                  Tenure / Financing Horizon
                </label>
                <span className="font-display font-bold text-base text-white">
                  {loanYears} Years ({loanYears * 12} Months)
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="30"
                step="1"
                value={loanYears}
                onChange={(e) => setLoanYears(parseInt(e.target.value, 10))}
                className="w-full h-2 rounded-lg bg-black/60 accent-[#C9A24B] cursor-pointer"
              />
              <div className="flex justify-between text-[11px] font-mono text-stone-400 mt-1">
                <span>5 Years</span>
                <span>15 Years</span>
                <span>30 Years</span>
              </div>
            </div>

            {/* 4. Interest Rate Slider */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-mono uppercase text-stone-300 tracking-wider">
                  Annual Benchmark Rate (KIBOR Linked)
                </label>
                <span className="font-display font-bold text-base text-white">
                  {interestRate.toFixed(2)}% p.a.
                </span>
              </div>
              <input
                type="range"
                min="6.0"
                max="18.0"
                step="0.25"
                value={interestRate}
                onChange={(e) => setInterestRate(parseFloat(e.target.value))}
                className="w-full h-2 rounded-lg bg-black/60 accent-[#C9A24B] cursor-pointer"
              />
              <div className="flex justify-between text-[11px] font-mono text-stone-400 mt-1">
                <span>6.0%</span>
                <span>12.0%</span>
                <span>18.0%</span>
              </div>
            </div>

            {/* Principal Balance summary */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-stone-300">
              <span className="flex items-center gap-1.5 font-mono">
                <ShieldCheck className="w-4 h-4 text-[#C9A24B]" />
                Financed Loan Amount:
              </span>
              <span className="font-bold text-white font-mono">
                {formatPkr(principalPkr)}
              </span>
            </div>
          </div>

          {/* Results & SVG Donut Chart Card (5 Cols) */}
          <div className="lg:col-span-5 p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#12141c] to-[#090a0f] border border-[#C9A24B]/40 shadow-[0_16px_50px_rgba(0,0,0,0.9),0_0_30px_rgba(201,162,75,0.2)] backdrop-blur-xl flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-mono tracking-widest text-[#DFBF6D] uppercase block mb-1">
                ESTIMATED MONTHLY COMMITMENT
              </span>

              {/* Animated Monthly Payment */}
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-xs font-mono text-[#C9A24B]">PKR</span>
                <span className="font-display font-bold text-4xl sm:text-5xl text-white tracking-tight tabular-nums">
                  {formatMonthly(animatedEmi)}
                </span>
                <span className="text-xs text-stone-400 font-mono">/ mo</span>
              </div>
              <p className="text-[11px] text-stone-400 mb-6">
                Calculated over {loanYears} years at {interestRate}% fixed benchmark.
              </p>

              {/* SVG Donut Chart (Principal vs Interest) */}
              <div className="p-4 rounded-2xl bg-black/40 border border-white/5 flex flex-col sm:flex-row items-center justify-around gap-6 mb-6">
                {/* SVG Visual */}
                <div className="relative w-36 h-36 flex items-center justify-center shrink-0">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
                    {/* Background circle track */}
                    <circle
                      cx="80"
                      cy="80"
                      r={radius}
                      fill="transparent"
                      stroke="#1e2330"
                      strokeWidth={strokeWidth}
                    />

                    {/* Interest Arc (Slate Blue / Dark Gold) */}
                    <circle
                      cx="80"
                      cy="80"
                      r={radius}
                      fill="transparent"
                      stroke="#856321"
                      strokeWidth={strokeWidth}
                      strokeDasharray={`${circumference}`}
                      strokeDashoffset="0"
                      strokeLinecap="round"
                    />

                    {/* Principal Arc (Gleaming Gold #C9A24B) */}
                    <circle
                      cx="80"
                      cy="80"
                      r={radius}
                      fill="transparent"
                      stroke="#C9A24B"
                      strokeWidth={strokeWidth}
                      strokeDasharray={`${principalDash} ${interestDash}`}
                      strokeDashoffset="0"
                      strokeLinecap="round"
                      className="transition-all duration-500 ease-out"
                    />
                  </svg>

                  {/* Centered Donut Label */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-xs font-mono font-bold text-white">
                      {principalRatio.toFixed(0)}%
                    </span>
                    <span className="text-[9px] font-mono text-stone-400 uppercase tracking-wider">
                      Equity
                    </span>
                  </div>
                </div>

                {/* Donut Legend */}
                <div className="space-y-3 text-xs w-full sm:w-auto">
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#C9A24B]" />
                      <span className="text-stone-300 font-medium">Principal Financed:</span>
                    </div>
                    <div className="font-mono text-white text-xs pl-4 font-bold">
                      {formatPkr(principalPkr)} ({principalRatio.toFixed(1)}%)
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#856321]" />
                      <span className="text-stone-300 font-medium">Total Interest:</span>
                    </div>
                    <div className="font-mono text-[#DFBF6D] text-xs pl-4 font-bold">
                      {formatPkr(totalInterestPkr)} ({interestRatio.toFixed(1)}%)
                    </div>
                  </div>
                </div>
              </div>

              {/* Total Outflow */}
              <div className="space-y-2 py-3 border-y border-white/10 text-xs mb-6 font-mono">
                <div className="flex justify-between text-stone-300">
                  <span>Total Repayment:</span>
                  <span className="font-bold text-white">{formatPkr(totalRepaymentPkr)}</span>
                </div>
                <div className="flex justify-between text-stone-400 text-[11px]">
                  <span>Total Months:</span>
                  <span>{totalMonths} installments</span>
                </div>
              </div>
            </div>

            {/* Action Button: Scroll down to Contact */}
            <MagneticButton
              onClick={() => {
                if (onScheduleConsultation) {
                  onScheduleConsultation();
                } else if (onScheduleViewing) {
                  onScheduleViewing(`Custom Financing: PKR ${priceCrore.toFixed(1)} Cr Plan`);
                }
                const contactEl = document.getElementById('contact');
                contactEl?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full py-3.5 px-5 rounded-xl bg-gradient-to-r from-[#C9A24B] to-[#DFBF6D] hover:from-[#b8913d] hover:to-[#ceaf5e] text-black font-semibold text-xs tracking-wider uppercase transition-all duration-300 shadow-xl flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Apply Plan to Private Viewing</span>
              <ArrowRight className="w-4 h-4" />
            </MagneticButton>
          </div>
        </div>
      </div>
    </section>
  );
};
