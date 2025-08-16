export function SocialProof() {
  // Three short testimonial quotes for authentic social proof
  const testimonials = [
    {
      quote: "Cuts report time from 3 hours to 20 minutes. Game changer.",
      name: "Mike Rodriguez",
      role: "Water Damage Specialist"
    },
    {
      quote: "Adjusters approve our reports on first pass now. Less back-and-forth.",
      name: "Sarah Chen",
      role: "Restoration Project Manager"
    },
    {
      quote: "Clean, professional reports that insurance loves. Wish I had this years ago.",
      name: "David Thompson",
      role: "Fire Restoration Owner"
    }
  ];

  const testimonialCards = (
    <div className="grid md:grid-cols-3 gap-6">
      {testimonials.map((testimonial, index) => (
        <figure key={index} className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
          <blockquote className="text-sm text-slate-700 mb-3">
            "{testimonial.quote}"
          </blockquote>
          <figcaption className="text-xs text-slate-500">
            <div className="font-medium text-slate-900">{testimonial.name}</div>
            <div>{testimonial.role}</div>
          </figcaption>
        </figure>
      ))}
    </div>
  );

  return (
    <section className="py-12 bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-slate-600 text-sm font-medium mb-8">
          Trusted by restoration professionals
        </h2>
        {testimonialCards}
      </div>
    </section>
  );
}
