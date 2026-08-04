import Link from "next/link";
import { AuthCard } from "@/features/auth/components/AuthCard";
import { LoginForm } from "@/features/auth/components/LoginForm";
import { OAuthButtons } from "@/features/auth/components/OAuthButtons";
import { ROUTES } from "@/constants/routes";

interface LoginPageProps {
  searchParams: Promise<{ redirect?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { redirect } = await searchParams;
  const redirectTo = redirect || ROUTES.home;
  const isSubscriptionRedirect = redirect === ROUTES.settingsSubscription;

  return (
    <AuthCard
      title="Log in to OmniAI"
      description={
        isSubscriptionRedirect
          ? "Log in to continue to your subscription"
          : "Welcome back — pick up where you left off"
      }
      footer={
        <>
          New here?{" "}
          <Link
            href={`${ROUTES.signup}${redirect ? `?redirect=${encodeURIComponent(redirect)}` : ""}`}
            className="font-medium text-brand-600 hover:underline"
          >
            Sign up
          </Link>
        </>
      }
    >
      <LoginForm redirectTo={redirectTo} />
      <div className="flex items-center gap-2">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs text-muted-foreground">or</span>
        <div className="h-px flex-1 bg-border" />
      </div>
      <OAuthButtons />
    </AuthCard>
  );
}
