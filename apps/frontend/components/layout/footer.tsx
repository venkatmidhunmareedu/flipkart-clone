import Link from "next/link";

const footerSections = [
  {
    title: "ABOUT",
    links: ["Contact Us", "About Us", "Careers", "Press"],
  },
  {
    title: "HELP",
    links: ["Payments", "Shipping", "Returns", "FAQ"],
  },
  {
    title: "CONSUMER POLICY",
    links: ["Cancellation", "Terms", "Privacy Policy"],
  },
];

export function Footer() {
  return (
    <footer className="mt-auto bg-[#172337] text-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:grid-cols-2 lg:grid-cols-4">
        {footerSections.map((section) => (
          <div key={section.title}>
            <h3 className="mb-3 text-xs font-medium tracking-wide text-[#878787]">{section.title}</h3>
            <ul className="space-y-2">
              {section.links.map((link) => (
                <li key={link}>
                  <span className="text-sm text-white/90">{link}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <h3 className="mb-3 text-xs font-medium tracking-wide text-[#878787]">SOCIAL</h3>
          <div className="flex gap-3 text-sm text-white/90">
            <Link href="#" aria-label="Facebook">
              Facebook
            </Link>
            <Link href="#" aria-label="Twitter">
              Twitter
            </Link>
            <Link href="#" aria-label="YouTube">
              YouTube
            </Link>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 px-4 py-4 text-center text-sm text-[#878787]">
        © 2026 Flipkart Clone — SDE Assignment
      </div>
    </footer>
  );
}
