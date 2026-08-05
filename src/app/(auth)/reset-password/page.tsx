import Link from "next/link";
import { AuthCard } from "@/features/auth/components/AuthCard";
import { ResetPasswordForm } from "@/features/auth/components/ResetPasswordForm";
import { ROUTES } from "@/constants/routes";

export default function ResetPasswordPage() {
  return (
    <AuthCard
      title="Set a new password"
      description="Choose a new password for your account"
      footer={
        <>
          Remembered your password?{" "}
          <Link href={ROUTES.login} className="font-medium text-brand-600 hover:underline">
            Log in
          </Link>
        </>
      }
    >
      <ResetPasswordForm />
    </AuthCard>
  );
}
