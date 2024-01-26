import express, { Application, Request, Response } from "express";
import { createUploadthingExpressHandler } from "uploadthing/express";
import { uploadRouter } from "./upload";
import connectDB from './config/db'
import http from 'http';
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from 'cors';
import { config } from 'dotenv';
import productRoutes from "./routes/productRoutes";
import userRoutes from "./routes/userRoutes";
import mediaRoutes from "./routes/mediaRoutes";
import stripe from "./routes/stripe";
import helmet from "helmet";
import mongoSanitize from 'express-mongo-sanitize'

config()
connectDB()

const app: Application = express();

app.use(helmet());
app.use(compression())
app.use(cookieParser())
app.use(mongoSanitize());
app.use(cors({
  origin: 'http://localhost:5173',
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  credentials: true
}))
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

const server = http.createServer(app)

app.get("/", (req: Request, res: Response) => {
  res.send("Healthy");
});

app.use("/api/stripe", stripe);
app.use(express.json())
app.use('/api/products', productRoutes)
app.use('/api/users', userRoutes)
app.use('/api/media', mediaRoutes)
app.use("/api/uploadthing", createUploadthingExpressHandler({ router: uploadRouter }));

const PORT = process.env.PORT || 8080;

server.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});