import express, { Application, Request, Response } from "express";
import { createUploadthingExpressHandler } from "uploadthing/express";
import { uploadRouter } from "./upload";
import connectDB from './config/db'
import http from 'http';
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from 'cors';
import productRoutes from "./routes/productRoutes";
import userRoutes from "./routes/userRoutes";
import mediaRoutes from "./routes/mediaRoutes";
import stripe from "./routes/stripe";
import helmet from "helmet";
import mongoSanitize from 'express-mongo-sanitize'
import orderRouter from "./routes/orderRouter";
import AppError from "./utils/appError";
import path from 'path'
import { corsOptions, helmetOptions } from "./config/site";
import env from './config/config';

connectDB()

const app: Application = express();

process.on("uncaughtException", (err) => {
  console.log(err);
  console.log(`Error : ${err.message}`);
  console.log(`Shutting down the server due to Uncaught Exception`);
  process.exit(1);
})

app.use(compression());
app.use(cookieParser());
app.use(mongoSanitize());
app.use(cors(corsOptions));
app.use(helmet(helmetOptions));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

const server = http.createServer(app)

app.use("/api/stripe", stripe);
app.use(express.json())
app.use('/api/users', userRoutes)
app.use('/api/media', mediaRoutes)
app.use('/api/orders', orderRouter)
app.use('/api/products', productRoutes)
app.use("/api/uploadthing", createUploadthingExpressHandler({ router: uploadRouter }));

__dirname = path.resolve()
if (process.env.NODE_ENV === 'PRODUCTION') {
  app.use(express.static(path.join(__dirname, './client/dist')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './client/dist/index.html'));
  })
} else {
  app.get("/", (req: Request, res: Response) => {
    res.send("Healthy");
  })
  app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
  })
}

server.listen(env.PORT, () => {
  console.log(`Server is running on port ${env.PORT}`);
  console.log(`Connected to MongoDB at ${env.MONGO_URI}`);
});