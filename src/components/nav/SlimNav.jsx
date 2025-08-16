import { useState, useEffect } from 'react';
import { CTAButton } from '../shared/CTAButton';

function LogoMark() {
  return (
    <img 
      src="/RR_Icon.png" 
      alt="Restoration Report Logo" 
      className="h-8 w-8 object-contain"
    />
  );
}

export function SlimNav() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 8);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70 border-b border-slate-200 sticky top-0 z-40 transition-shadow duration-200 ${
        isScrolled ? 'shadow-sm' : ''
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <button 
            type="button" 
            onClick={() => window.location.reload()} 
            className="flex items-center gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
          >
            <LogoMark />
            <span className="font-bold text-slate-900 text-sm sm:text-base">Restoration Report</span>
          </button>
          
          <CTAButton to="#signup">Join waitlist</CTAButton>
        </div>
      </div>
    </header>
  );
}
