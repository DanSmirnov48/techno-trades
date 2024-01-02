import { ProductImage, UserImage } from "@/types";
import * as z from "zod";

// ============================================================
// USER
// ============================================================
export const SignupValidation = z.object({
    firstName: z.string().min(1, { message: "This field is required" }).max(1000, { message: "Maximum 100 characters." }),
    lastName: z.string().min(1, { message: "This field is required" }).max(1000, { message: "Maximum 100 characters." }),
    email: z.string().email(),
    password: z.string().min(8, { message: "Password must be at least 8 characters." }),
    passwordConfirm: z.string().min(8, { message: "Password must be at least 8 characters." })
}).refine((data) => {
    return data.password === data.passwordConfirm;
}, {
    message: "Password do not match",
    path: ["passwordConfirm"]
});

export const SigninValidation = z.object({
    email: z.string().email(),
    password: z.string().min(8, { message: "Password must be at least 8 characters." }),
});

export const ProfileUpdateValidation = z.object({
    firstName: z.string().min(2, { message: "Must be at least 2 characters." }),
    lastname: z.string().min(2, { message: "Must be at least 2 characters." }),
    email: z.string().email(),
    photo: z.custom<UserImage>(),
});

export const UpdatePasswordValidation = z.object({
    currentPassword: z.string().min(8, { message: "Password must be at least 8 characters." }),
    newPassword: z.string().min(8, { message: "Password must be at least 8 characters." }),
    newPasswordConfirm: z.string().min(8, { message: "Password must be at least 8 characters." })
}).refine((data) => {
    return data.newPassword === data.newPasswordConfirm;
}, {
    message: "Password do not match",
    path: ["newPasswordConfirm"]
});

// ============================================================
// PRODUCTS & PRODUCTS TABLE
// ============================================================
export const ProductValidation = z.object({
    name: z.string().min(1, { message: "This field is required" }).max(1000, { message: "Maximum 1000 characters." }),
    image: z.custom<ProductImage[]>(),
    brand: z.string().min(1, { message: "This field is required" }).max(1000, { message: "Maximum 1000 characters." }),
    category: z.enum(["smartphones", "cameras", "computers", "televisions", "consoles", "audio", "mouse", "keyboard"]),
    description: z.string().max(5000, { message: "Maximum 5000 characters for the description" }),
    price: z.coerce.number().min(0, { message: "Price must be a non-negative number" }),
    countInStock: z.coerce.number().min(0, { message: "Stock must be a non-negative number" }),
});

export const productTableSchema = z.object({
    _id: z.string(),
    name: z.string().min(1, { message: "This field is required" }).max(1000, { message: "Maximum 1000 characters." }),
    brand: z.string(),
    image: z.custom<ProductImage[]>(),
    category: z.enum(["smartphones", "cameras", "computers", "televisions", "consoles", "audio", "mouse", "keyboard"]),
    description: z.string().max(5000, { message: "Maximum 5000 characters for the description" }),
    price: z.coerce.number().min(0, { message: "Price must be a non-negative number" }),
    countInStock: z.coerce.number().min(0, { message: "Stock must be a non-negative number" }),
    discountedPrice: z.coerce.number().optional().or(z.literal(0)),
    isDiscounted: z.boolean(),
})

export type ProductType = z.infer<typeof productTableSchema>
