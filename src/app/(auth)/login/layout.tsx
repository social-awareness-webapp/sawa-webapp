import { AuthNavbar } from "@/components/shared/AuthNavbar";

export default function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <AuthNavbar />
      {children}
    </>
  );
}
