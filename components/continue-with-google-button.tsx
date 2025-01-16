"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth";
import { useRouter } from "next/navigation";

export default function ContinueWithGoogleButton() {
  const router = useRouter();
  const auth = useAuth();

  return (
    <Button
      variant="outline"
      onClick={async () => {
        try {
          await auth?.loginWithGoogle();
          router.refresh();
        } catch (error) {
          console.log(error)
        }
      }}
      className="w-full"
    >
      Continue with google
    </Button>
  );
}
