import Link from "next/link";
import { AuthCard } from "@/features/auth/components/AuthCard";
import { ForgotPasswordForm } from "@/features/auth/components/ForgotPasswordForm";
import { ROUTES } from "@/constants/routes";

export default function ForgotPasswordPage() {
  return (
    <AuthCard
      title="Reset your password"
      description="Enter your email and we'll send you a reset link"
      footer={
        <>
          Remembered it?{" "}
          <Link href={ROUTES.login} className="font-medium text-brand-600 hover:underline">
            Log in
          </Link>
        </>
      }
    >
      <ForgotPasswordForm />
    </AuthCard>
  );
}
