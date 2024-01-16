import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { Star } from "@smastrom/react-rating";
import { Product } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const convertFileToUrl = (file: File) => URL.createObjectURL(file);

export function formatDate(input: string | number): string {
  const date = new Date(input)
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

export function formatPrice(
  price: number | string,
  options: {
    currency?: 'USD' | 'EUR' | 'GBP' | 'BDT'
    notation?: Intl.NumberFormatOptions['notation']
  } = {}
) {
  const { currency = 'USD', notation = 'standard' } = options

  const numericPrice =
    typeof price === 'string' ? parseFloat(price) : price

  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency,
    notation,
    maximumFractionDigits: 2,
  }).format(numericPrice)
}

export const calculateDiscountPercentage = ({ normalPrice, discountedPrice }: { normalPrice: number, discountedPrice?: number }) => {
  const discountAmount = discountedPrice !== undefined ? normalPrice - discountedPrice : 0;

  const discountPercentage = discountedPrice !== undefined
    ? (discountAmount / normalPrice) * 100
    : 0;

  const formatPercentage = (percentage: number): string => {
    const roundedPercentage = Math.round(percentage);
    return roundedPercentage % 1 === 0 ? roundedPercentage.toString() + '%' : percentage.toFixed(2) + '%';
  };

  return Math.round(discountPercentage);
};

export const isProductAddedWithinNDays = ({product, nDays} : {product: Product, nDays: number}): boolean => {
  const currentDate = new Date();
  const nDaysAgo = new Date();
  nDaysAgo.setDate(currentDate.getDate() - nDays);

  const productCreatedAt = new Date(product.createdAt);
  return productCreatedAt >= nDaysAgo;
}

export const ratingStyle = {
  itemShapes: Star,
  activeFillColor: "#ffb700",
  inactiveFillColor: "#fbf1a9",
};