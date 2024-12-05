import { NextFunction, Request, Response, Router } from "express";
import { CustomResponse } from "../config/utils";
import { getProducts } from "../managers/products";
import { NotFoundError } from "../config/handlers";
import { Product } from "../models/products";

const shopRouter = Router();

shopRouter.get('/products', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const nameFilter = req.query.name as string | null
        const products = await getProducts(nameFilter)
        return res.status(200).json(CustomResponse.success('Products Fetched Successfully', products))
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

export default shopRouter