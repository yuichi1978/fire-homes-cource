"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth";
import { useRouter } from "next/navigation";

export default function ContinueWithGoogleButton() {
  const router = useRouter();
  const auth = useAuth();
  return (
    <Button
      onClick={async () => {
        await auth?.loginWithGoogle();
        router.refresh();
      }}
      className="w-full"
    >
      Continue with google
    </Button>
  );
}
