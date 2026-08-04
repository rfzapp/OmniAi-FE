import type { ReactNode } from "react";
import Link from "next/link";
import { Logo } from "@/components/atoms/Logo";
import { ROUTES } from "@/constants/routes";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh w-full flex-col items-center justify-center gap-8 bg-secondary/40 px-4 py-10">
      <Link href={ROUTES.home}>
        <Logo size={28} />
      </Link>
      {children}
    </div>
  );
}
