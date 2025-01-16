import { z } from "zod";

export const passwordValidation = z.string().refine(
  (value) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    return regex.test(value);
  },
  {
    message: "Password must contain at least & characters, at",
  }
);

export const registerUserSchema = z
  .object({
    email: z.string().email(),
    name: z.string().min(2, "Name must be at least 2 characters"),
    password: passwordValidation,
    passwordConfirm: z.string(),
  })
  .superRefine((data, context) => {
    if (data.password !== data.passwordConfirm) {
      context.addIssue({
        message: "Password do not match",
        path: ["passwordConfirm"],
        code: "custom",
      });
    }
  });
