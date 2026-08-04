import { Button } from "@/components/atoms/Button";

export function OAuthButtons() {
  return (
    <div className="flex flex-col gap-2">
      <Button type="button" variant="outline" className="w-full justify-center gap-2">
        Continue with Google
      </Button>
      <Button type="button" variant="outline" className="w-full justify-center gap-2">
        Continue with GitHub
      </Button>
    </div>
  );
}
