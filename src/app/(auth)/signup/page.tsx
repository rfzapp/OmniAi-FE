import Link from "next/link";
import { AuthCard } from "@/features/auth/components/AuthCard";
import { SignupForm } from "@/features/auth/components/SignupForm";
import { OAuthButtons } from "@/features/auth/components/OAuthButtons";
import { ROUTES } from "@/constants/routes";

interface SignupPageProps {
  searchParams: Promise<{ redirect?: string }>;
}

export default async function SignupPage({ searchParams }: SignupPageProps) {
  const { redirect } = await searchParams;
  const redirectTo = redirect || ROUTES.home;

  return (
    <AuthCard
      title="Create your account"
      description="One interface, unlimited intelligence — free to start"
      footer={
        <>
          Already have an account?{" "}
          <Link
            href={`${ROUTES.login}${redirect ? `?redirect=${encodeURIComponent(redirect)}` : ""}`}
            className="font-medium text-brand-600 hover:underline"
          >
            Log in
          </Link>
        </>
      }
    >
      <SignupForm redirectTo={redirectTo} />
      <div className="flex items-center gap-2">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs text-muted-foreground">or</span>
        <div className="h-px flex-1 bg-border" />
      </div>
      <OAuthButtons />
    </AuthCard>
  );
}
