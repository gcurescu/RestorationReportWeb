export function SocialProof() {
  const testimonials = [
    {
      quote: "Cuts our report time from 3 hours to under 20 minutes. Our adjuster actually called to compliment the format.",
      name: "James Kowalski",
      role: "Owner",
      company: "Great Lakes Restoration",
      location: "Chicago, IL",
    },
    {
      quote: "First-pass approval rate went up immediately. The PDF format is exactly what adjusters want to see.",
      name: "Maria Delgado",
      role: "Project Manager",
      company: "SunState Mitigation",
      location: "Phoenix, AZ",
    },
    {
      quote: "I was doing reports at midnight. Now I generate them on-site before I leave the job.",
      name: "Derek Holt",
      role: "Crew Lead",
      company: "BlueLine Restoration Services",
      location: "Atlanta, GA",
    },
  ];

  return (
    <section className="py-12 bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-slate-600 text-sm font-medium mb-8">
          Trusted by restoration professionals
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <figure key={index} className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm flex flex-col">
              <blockquote className="text-sm text-slate-700 mb-4 leading-relaxed flex-1">
                "{testimonial.quote}"
              </blockquote>
              <figcaption className="text-xs text-slate-500 border-t border-slate-100 pt-3">
                <div className="font-semibold text-slate-900">{testimonial.name}</div>
                <div>{testimonial.role}, {testimonial.company}</div>
                <div className="text-slate-400 mt-0.5">{testimonial.location}</div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
