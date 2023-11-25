import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
}, { timestamps: true })


const ProductSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    name: { type: String, required: true },
    image: { type: String, required: true },
    brand: { type: String, required: false },
    category: { type: String, required: false, },
    description: { type: String, required: false, },
    reviews: [reviewSchema],
    rating: { type: Number, required: true, default: 0 },
    numReviews: { type: Number, required: true, default: 0 },
    price: { type: Number, required: true, default: 0 },
    countInStock: { type: Number, required: true, default: 0 },
}, { timestamps: true })

export const ProductModel = mongoose.model('Product', ProductSchema)

export const GetProduct = () => ProductModel.find()

export const GetProductById = (id: any) => ProductModel.findById({ id })

export const GetproductByName = (name: string) => ProductModel.findOne({ name })

export const CreateProduct = async (values: Record<string, any>) =>
    new ProductModel(values).save().then((product) => product.toObject())

export const DeleteProductById = (id: string) =>
    ProductModel.findByIdAndDelete(id)

export const UpdateProductById = (id: string, values: Record<string, typeof ProductModel>) =>
    ProductModel.findByIdAndUpdate(id, values)