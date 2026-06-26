import { z, email } from "zod";

// validator for registering user
export const registerPostRequestSchema = z.object({
  firstname: z.string().nonempty(),
  lastname: z.string().nonempty(),
  email: z.string().email().nonempty(),
  password: z.string().min(6).nonempty(),
});

// validator for login user
export const loginPostRequestSchema = z.object({
  email: z.string().email().nonempty(),
  password: z.string().min(6).nonempty(),
});

// validating urls input
export const createUrlPostRequestSchema = z.object({
  url: z.string().nonempty(),
  code: z.string().optional(),
});
