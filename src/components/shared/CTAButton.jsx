import { analytics } from '../../lib/analytics';

export function CTAButton({ 
  to = "#signup", 
  onClick, 
  children = "Join waitlist",
  className = "",
  variant = "primary"
}) {
  const baseClasses = "inline-flex items-center justify-center px-6 py-3 rounded-lg font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 transition-colors";
  
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-600 shadow-sm",
    secondary: "bg-white text-blue-600 border-2 border-blue-600 hover:bg-blue-50 focus-visible:ring-blue-600"
  };

  const handleClick = (e) => {
    // Track analytics
    analytics.ctaClick(to);
    
    if (onClick) {
      onClick(e);
    } else if (to.startsWith('#')) {
      e.preventDefault();
      const element = document.querySelector(to);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const combinedClasses = `${baseClasses} ${variants[variant]} ${className}`;

  if (to.startsWith('#')) {
    return (
      <button
        type="button"
        onClick={handleClick}
        className={combinedClasses}
        data-analytics="cta"
      >
        {children}
      </button>
    );
  }

  return (
    <a
      href={to}
      onClick={handleClick}
      className={combinedClasses}
      data-analytics="cta"
    >
      {children}
    </a>
  );
}
