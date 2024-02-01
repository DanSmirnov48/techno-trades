import mongoose, { Schema, Types } from 'mongoose';
import slugify from 'slugify'

interface IReview {
    name: string;
    rating: number;
    title: string;
    comment: string;
    user: Types.ObjectId;
}

export interface IProduct extends Document {
    user: Types.ObjectId;
    slug: string;
    name: string;
    image: Array<{
        key: string;
        name: string;
        url: string;
    }>;
    brand?: string;
    category?: string;
    description?: string;
    reviews: IReview[];
    rating: number;
    numReviews: number;
    price: number;
    countInStock: number;
    isDiscounted: boolean;
    discountedPrice?: number;
    [key: string]: any;
}

const reviewSchema = new Schema<IReview>({
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    title: { type: String, required: true },
    comment: { type: String, required: true },
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
    slug: String,
    name: { type: String, required: true },
    image: [
        {
            key: { type: String, required: true },
            name: { type: String, required: true },
            url: { type: String, required: true },
        },
    ],
    brand: String,
    category: String,
    description: String,
    reviews: [reviewSchema],
    rating: { type: Number, required: true, default: 0 },
    numReviews: { type: Number, required: true, default: 0 },
    price: { type: Number, required: true, default: 0 },
    countInStock: { type: Number, required: true, default: 0 },
    isDiscounted: { type: Boolean, required: true, default: false },
    discountedPrice: { type: Number },
}, { timestamps: true });

export const ProductModel = mongoose.model<IProduct>('Product', ProductSchema);

export const GetProduct = () => ProductModel.find()

export const GetProductById = (id: any) => ProductModel.findById({ id })

export const GetproductByName = (name: string) => ProductModel.findOne({ name })

export const GetproductBySlug = (slug: string) => ProductModel.findOne({ slug })

// export const CreateProduct = async (values: Record<string, any>) =>
//     new ProductModel(values).save().then((product) => product.toObject())

export const DeleteProductById = (id: string) =>
    ProductModel.findByIdAndDelete(id)

export const UpdateProductById = (id: string, values: Record<string, typeof ProductModel>) =>
    ProductModel.findByIdAndUpdate(id, values)

export const CreateProduct = async (values: Record<string, any>) => {
    const product = new ProductModel(values);
    product.slug = slugify(product.name, { lower: true });
    const savedProduct = await product.save();
    return savedProduct.toObject();
};