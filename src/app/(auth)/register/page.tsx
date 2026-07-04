import type { Metadata } from "next";
import Link from "next/link";

import { RegisterContainer } from "@/containers/RegisterContainer";

export const metadata: Metadata = {
  title: "Register | SAWA",
  description: "Create your SAWA account",
};

export default function RegisterPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <RegisterContainer />
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
