import { CTAButton } from './CTAButton';

export function SectionCTA({ 
  title = "Ready to streamline your reports?",
  description = "Join restoration professionals who save hours on every claim.",
  className = ""
}) {
  return (
    <div className={`bg-slate-100 rounded-xl p-8 text-center ${className}`}>
      <h3 className="text-xl font-semibold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-600 mb-6">{description}</p>
      <CTAButton to="#signup">Join waitlist</CTAButton>
    </div>
  );
}
