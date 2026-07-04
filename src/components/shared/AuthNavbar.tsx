import Link from "next/link";
import { Megaphone } from "lucide-react";

export function AuthNavbar() {
  return (
    <header className="h-14 border-b border-slate-100 bg-white">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <Megaphone className="size-5 text-[#1A365D]" />
          <span className="font-bold text-[#1A365D]">SAWA</span>
        </Link>
        <Link
          href="/"
          className="text-sm text-slate-500 transition-colors hover:text-[#1A365D]"
        >
          ← Back to Home
        </Link>
      </div>
    </header>
  );
}
