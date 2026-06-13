const footerSections = [
  {
    title: "ABOUT",
    links: ["Contact Us", "About Us", "Careers", "Flipkart Stories", "Press"],
  },
  {
    title: "GROUP COMPANIES",
    links: ["Myntra", "Cleartrip", "Shopsy"],
  },
  {
    title: "HELP",
    links: ["Payments", "Shipping", "Cancellation & Returns", "FAQ"],
  },
  {
    title: "CONSUMER POLICY",
    links: ["Cancellation & Returns", "Terms Of Use", "Security", "Privacy", "Sitemap"],
  },
];

export function Footer() {
  return (
    <footer className="mt-auto bg-[var(--footer-bg,#172337)] text-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:grid-cols-2 lg:grid-cols-5">
        {footerSections.map((section) => (
          <div key={section.title}>
            <h3 className="mb-3 text-xs font-medium tracking-wide text-[#878787]">{section.title}</h3>
            <ul className="space-y-2">
              {section.links.map((link) => (
                <li key={link}>
                  <span className="cursor-default text-sm text-white/90 hover:underline">{link}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <h3 className="mb-3 text-xs font-medium tracking-wide text-[#878787]">
            Mail Us
          </h3>
          <p className="text-sm leading-relaxed text-white/90">
            Flipkart Internet Private Limited, Buildings Alyssa, Begonia &amp; Clove Embassy Tech
            Village, Bengaluru, 560103, Karnataka, India
          </p>
        </div>
      </div>

      <div className="border-t border-white/10 px-4 py-4 text-center text-sm text-[#878787]">
        © 2007–2026 Flipkart Clone — SDE Assignment
      </div>
    </footer>
  );
}
