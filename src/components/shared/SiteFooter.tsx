import Link from "next/link";
import { Megaphone } from "lucide-react";

const quickLinks = [
  { label: "Campaigns", href: "#featured-campaigns" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Sign In", href: "/login" },
  { label: "Register", href: "/register" },
];

const organisationLinks = [
  { label: "Start a Campaign", href: "/register" },
  { label: "Partner With Us", href: "/register" },
  { label: "Business Owners", href: "/register" },
];

const legalLinks = [
  { label: "Terms of Service", href: "/terms" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Contact", href: "/contact" },
];

export function SiteFooter() {
  return (
    <footer className="bg-[#1A365D] py-12 text-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 md:grid-cols-4">
        <div className="space-y-4">
          <Link href="/" className="flex items-center gap-2">
            <Megaphone className="size-5" />
            <span className="text-lg font-bold">SAWA</span>
          </Link>
          <p className="text-sm leading-relaxed text-white/70">
            Community-powered awareness campaigns that create lasting change.
          </p>
          <p className="text-xs text-white/50">© 2026 SAWA. All rights reserved.</p>
        </div>
        <div>
          <h3 className="mb-4 text-sm font-semibold">Quick Links</h3>
          <ul className="space-y-2">
            {quickLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="text-sm text-white/70 transition-colors hover:text-white"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="mb-4 text-sm font-semibold">For Organisations</h3>
          <ul className="space-y-2">
            {organisationLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="text-sm text-white/70 transition-colors hover:text-white"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="mb-4 text-sm font-semibold">Legal</h3>
          <ul className="space-y-2">
            {legalLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="text-sm text-white/70 transition-colors hover:text-white"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
