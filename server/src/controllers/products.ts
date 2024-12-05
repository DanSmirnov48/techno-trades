import { NextFunction, Request, Response, Router } from "express";
import { paginateRecords } from "../utils/paginators";
import { CustomResponse } from "../config/utils";
import { getProducts } from "../managers/products";
import { ErrorCode, NotFoundError, RequestError } from "../config/handlers";
import { Product } from "../models/products";
import { authMiddleware } from "../middlewares/auth";

const shopRouter = Router();

shopRouter.get('/products', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const nameFilter = req.query.name as string | null
        const products = await getProducts(nameFilter)
        const data = await paginateRecords(req, products)
        const productsData = { ...data }
        return res.status(200).json(CustomResponse.success('Products Fetched Successfully', productsData))
    } catch (error) {
        next(error)
    }
});

shopRouter.get('/products/:slug', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const product = await Product.findOne({ slug: req.params.slug })
        if (!product) {
            throw new NotFoundError("Product does not exist!")
        }
        return res.status(200).json(CustomResponse.success('Product Details Fetched Successfully', product))
    } catch (error) {
        next(error)
    }
});

shopRouter.post('/products/:slug', authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user
        const product = await Product.findOne({ slug: req.params.slug })
        if (!product) {
            throw new NotFoundError("Product does not exist!")
        }

        const { rating, title, comment } = req.body

        let review = product.reviews.find((review: any) => review.user = user._id)
        let action = "Added"
        if (review) {
            review.title = title
            review.comment = comment
            review.rating = rating
            action = "Updated"
        } else {
            product.reviews.push({ user: user._id, title, comment, rating })
        }
        await product.save()
        review = { user, title, comment, rating }
        return res.status(200).json(CustomResponse.success(`Review ${action} Successfully`, review))
    } catch (error) {
        next(error)
    }
});

shopRouter.post('/', authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user
        const { name, description, price, isDiscounted, discountedPrice, category, brand, countInStock, image } = req.body

        // Create a new product
        const newProduct = new Product({
            user: user,
            name: name,
            description: description,
            price: price,
            isDiscounted: isDiscounted,
            discountedPrice: isDiscounted ? discountedPrice : undefined,
            category: category,
            brand: brand,
            countInStock: countInStock,
            image: image
        });

        // Save the product
        await newProduct.save();

        if (!newProduct) {
            throw new RequestError("Error creating product", 400, ErrorCode.SERVER_ERROR)
        }

        return res.status(200).json(CustomResponse.success('Products Created Successfully', newProduct))
    } catch (error) {
        next(error)
    }
});

export default shopRouter