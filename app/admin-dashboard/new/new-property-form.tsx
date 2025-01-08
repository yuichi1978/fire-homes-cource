"use client";

import { z } from "zod";
import PropertyForm from "@/components/property-form";
import { propertySchema } from "@/validation/propertySchema";
import { PlusCircleIcon } from "lucide-react";
import { useAuth } from "@/context/auth";
import { createProperty } from "@/app/admin-dashboard/new/actions";
import { savePropertyImages } from "@/app/admin-dashboard/actions";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { ref, uploadBytesResumable, UploadTask } from "firebase/storage";
import { storage } from "@/firebase/client";

export default function NewPropertyForm() {
  const auth = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = async (data: z.infer<typeof propertySchema>) => {
    const token = await auth?.currentUser?.getIdToken();

    if (!token) {
      return;
    }
    const { images, ...rest } = data;
    const response = await createProperty(rest, token);

    if (!!response.error || !response.propertyId) {
      toast({
        title: "Error!",
        description: response.message,
        variant: "destructive",
      });
      return;
    }

    const uploadTasks: UploadTask[] = [];
    const paths: string[] = [];
    images.forEach((image, index) => {
      if (image.file) {
        const path = `properties/${
          response.propertyId
        }/${Date.now()}-${index}-${image.file.name}`;
        paths.push(path);
        const storageRef = ref(storage, path);
        uploadTasks.push(uploadBytesResumable(storageRef, image.file));
      }
    });

    await Promise.all(uploadTasks);
    await savePropertyImages(
      { propertyId: response.propertyId, images: paths },
      token
    );

    toast({
      title: "Success!",
      description: "Property created",
      variant: "success",
    });

    router.push("/admin-dashboard");
  };

  return (
    <div>
      <PropertyForm
        handleSubmit={handleSubmit}
        submitButtonLabel={
          <>
            <PlusCircleIcon /> Create Property
          </>
        }
      />
    </div>
  );
}
