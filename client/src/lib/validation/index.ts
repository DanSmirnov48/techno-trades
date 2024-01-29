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
export const ProductCreateValidation = z.object({
    name: z.string().min(1, { message: "This field is required" }).max(1000, { message: "Maximum 1000 characters." }),
    image: z.custom<ProductImage[]>(),
    brand: z.string().min(1, { message: "This field is required" }).max(1000, { message: "Maximum 1000 characters." }),
    category: z.enum(["smartphones", "cameras", "computers", "televisions", "consoles", "audio", "mouse", "keyboard"]),
    description: z.string().max(5000, { message: "Maximum 5000 characters for the description" }),
    price: z.coerce.number().min(0, { message: "Price must be a non-negative number" }),
    countInStock: z.coerce.number().min(0, { message: "Stock must be a non-negative number" }),
    discountedPrice: z.coerce.number().min(1).max(99).optional().or(z.literal(0)),
    isDiscounted: z.boolean(),
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

// ============================================================
// REVIEW
// ============================================================
export const ProductReviewValidation = z.object({
    title: z.string().min(1, { message: "This field is required" }).max(1000, { message: "Maximum 1000 characters." }),
    comment: z.string().min(1, { message: "This field is required" }).max(5000, { message: "Maximum 5000 characters." }),
});

// ============================================================
// USERS TABLE
// ============================================================

export const usersableSchema = z.object({
    _id: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email(),
    role: z.string(),
    photo: z.custom<UserImage>().optional().or(z.literal("")),
})
export type UserType = z.infer<typeof usersableSchema>

// ============================================================
// ORDER TABLE
// ============================================================

const cardDetailsSchema = z.object({
    brand: z.string(),
    country: z.string(),
    exp_month: z.number(),
    exp_year: z.number(),
    last4: z.string(),
});

const shippingDetailsSchema = z.object({
    amount_subtotal: z.number(),
    amount_tax: z.number(),
    amount_total: z.number(),
    shipping_rate: z.string(),
});

export const orderTableSchema = z.object({
    _id: z.string(),
    orderNumber: z.string(),
    user: z.string(),
    customerId: z.string(),
    customerEmail: z.string().email(),
    total: z.number(),
    paymentIntentDetails: z.object({ card: cardDetailsSchema }),
    shippingCost: shippingDetailsSchema,
    createdAt: z.string(),
    deliveryStatus: z.enum(["pending", "shipped", "delivered"]),
    paymentStatus: z.enum(["paid", "unpaid"]),
});

export type OrderType = z.infer<typeof orderTableSchema>