import type { Metadata } from "next";

import { RegisterContainer } from "@/containers/RegisterContainer";

export const metadata: Metadata = {
  title: "Register | SAWA",
  description: "Create your SAWA account",
};

export default function RegisterPage() {
  return (
    <main className="mx-auto max-w-lg px-4 py-10 sm:py-16">
      <RegisterContainer />
    </main>
  );
}
