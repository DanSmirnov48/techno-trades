import mongoose, { model, Model, Query, Schema, Types } from 'mongoose';
import slugify from 'slugify'

enum RATING_CHOICES {
    ONE = 1,
    TWO = 2,
    THREE = 3,
    FOUR = 4,
    FIVE = 5,
}

interface IReview {
    name: string;
    rating: RATING_CHOICES
    title: string;
    comment: string;
    user: Types.ObjectId;
}

interface IProduct extends Document {
    user: Types.ObjectId;
    name: string;
    slug: string;
    description?: string;
    price: number;
    isDiscounted: boolean;
    discountedPrice?: number;
    category?: string;
    brand?: string;
    countInStock: number;
    image: Array<{
        key: string;
        name: string;
        url: string;
    }>;
    reviews: IReview[];
    reviewsCount: number;
    avgRating: number;
}

const reviewSchema = new Schema<IReview>({
    title: { type: String, required: true },
    comment: { type: String, required: true },
    rating: RATING_CHOICES,
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
}, { timestamps: true });

const ProductSchema = new Schema<IProduct>({
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    name: { type: String, required: true, maxlength: 500 },
    slug: { type: String },
    description: { type: String },
    price: { type: Number, required: true, default: 0 },
    isDiscounted: { type: Boolean, required: true, default: false },
    discountedPrice: { type: Number },
    category: { type: String },
    brand: { type: String },
    countInStock: { type: Number, required: true, default: 0 },
    image: [
        {
            key: { type: String, required: true },
            name: { type: String, required: true },
            url: { type: String, required: true },
        },
    ],
    reviews: [reviewSchema],
}, { timestamps: true });

ProductSchema.pre('save', async function (next) {
    try {
        if (this.isModified('name') || this.isNew) {
            const newSlug = slugify(this.name, { lower: true, strict: true });
            this.slug = newSlug;
        }
        next();
    } catch (error: any) {
        next(error)
    }
});

ProductSchema.virtual('reviewsCount').get(function (this: IProduct) {
    return this.reviews.length;
});

ProductSchema.virtual('avgRating').get(function (this: IProduct) {
    const reviews = this.reviews
    return reviews.reduce((sum, item) => sum + (item["rating"] || 0), 0) / reviews.length || 0;
});

const Product = model<IProduct>('Product', ProductSchema);

export { IProduct, Product, IReview, RATING_CHOICES }