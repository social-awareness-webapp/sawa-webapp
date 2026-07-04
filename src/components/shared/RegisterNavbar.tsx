import Link from "next/link";
import { Megaphone } from "lucide-react";

export function RegisterNavbar() {
  return (
    <header className="h-14 border-b border-slate-100 bg-white">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <Megaphone className="size-5 text-[#1A365D]" />
          <span className="font-bold text-[#1A365D]">SAWA</span>
        </Link>
        <p className="text-sm text-slate-500">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-[#2B6CB0] hover:underline"
          >
            Sign in →
          </Link>
        </p>
      </div>
    </header>
  );
}
