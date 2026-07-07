import { RegisterNavbar } from "@/components/shared/RegisterNavbar";

export default function RegisterLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <RegisterNavbar />
      {children}
    </>
  );
}
