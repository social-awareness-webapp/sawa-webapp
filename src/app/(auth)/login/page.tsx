import type { Metadata } from "next";
import { Suspense } from "react";

import { LoginContainer } from "@/containers/LoginContainer";

export const metadata: Metadata = {
  title: "Login | SAWA",
  description: "Sign in to your SAWA account",
};

export default function LoginPage() {
  return (
    <main className="mx-auto max-w-md px-4 py-16">
      <Suspense>
        <LoginContainer />
      </Suspense>
    </main>
  );
}
