"use client";

import { z } from "zod";
import { passwordValidation } from "@/validation/registerUser";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ContinueWithGoogleButton from "@/components/continue-with-google-button";
import Link from "next/link";
import { useAuth } from "@/context/auth";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  email: z.string().email(),
  password: passwordValidation,
});

export default function LoginForm({
  onSuccess
}: {
  onSuccess: () => void;
}) {
  const { toast } = useToast();
  const auth = useAuth();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      await auth?.loginWithEmail(data.email, data.password);
      onSuccess?.();
    } catch (error: any) {
      toast({
        title: "Error!",
        description:
          error.code === "auth/invalid-credential"
            ? "Incorrect credentials"
            : "An error occurred",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <fieldset
          disabled={form.formState.isSubmitting}
          className="flex flex-col gap-4"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormControl>
                    <Input {...field} placeholder="Email" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormControl>
                    <Input {...field} placeholder="Password" type="password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <Button type="submit">Login</Button>
          <div>
            Forgotten your password?
            <Link href="/forgot-password" className="pl-2 underline">
              Reset it here.
            </Link>
          </div>
          <div className="text-center pb-5">or</div>
        </fieldset>
      </form>
      <ContinueWithGoogleButton />
    </Form>
  );
}
