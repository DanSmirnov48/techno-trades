import { z } from "zod";

// --------------------------------------------REGISTE--------------------------------------------
export const registerSchema = z.object({
  firstName: z.string().min(1, { message: "This field is required" }).max(1000, { message: "Maximum 100 characters." }),
  lastName: z.string().min(1, { message: "This field is required" }).max(1000, { message: "Maximum 100 characters." }),
  email: z.string().email(),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
})

export type RegisterValidationType = z.infer<typeof registerSchema>

// --------------------------------------------SIGNIN--------------------------------------------

export const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
});

export type SignInSchemaType = z.infer<typeof signInSchema>

// --------------------------------------------EMAIL--------------------------------------------

export const userEmailSchema = z.object({
  email: z.string({ required_error: 'Email is requred' }).email(),
});

export type UserEmailSchemaType = z.infer<typeof userEmailSchema>

// --------------------------------------------PASSWORD-RESET--------------------------------------------

export const passwordReset = z.object({
  otp: z.string().min(6, { message: "Otp is required." }),
  newPassword: z.string().min(8, { message: "Password must be at least 8 characters." }),
});

export type PasswordResetType = z.infer<typeof passwordReset>

// --------------------------------------------OTP--------------------------------------------
export const otpSchema = z.object({
  otp: z.string()
})

export type OtpSchemaType = z.infer<typeof otpSchema>