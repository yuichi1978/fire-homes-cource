"use client";

import { HeartIcon } from "lucide-react";
import { addFavourite } from "@/app/property-search/actions";
import { useAuth } from "@/context/auth";
import { useRouter } from "next/navigation";
import { removeFavourite } from "@/app/property-search/actions";
import { useToast } from "@/hooks/use-toast";

export default function ToggleFavouritesButton({
  propertyId,
  isFavourite,
}: {
  propertyId: string;
  isFavourite: boolean;
}) {
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  return (
    <button
      className="absolute top-0 right-0 z-10 p-2 bg-white rounded-bl-lg"
      onClick={async () => {
        const tokenResult = await auth?.currentUser?.getIdTokenResult();
        if (!tokenResult) {
          router.push("/login");
          return;
        }

        if (isFavourite) {
          // remove favourite
          await removeFavourite(propertyId, tokenResult.token);
        } else {
          await addFavourite(propertyId, tokenResult.token);
        }

        toast({
          title: `Property ${
            isFavourite ? "remove from" : "added to"
          } favourites`,
          variant: "success",
        });

        router.refresh();
      }}
    >
      <HeartIcon
        className="text-block"
        fill={isFavourite ? "#db2777" : "white"}
      />
    </button>
  );
}
