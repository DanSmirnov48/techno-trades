import express, { Application, NextFunction, Request, Response } from "express";
import { createUploadthingExpressHandler } from "uploadthing/express";
import { uploadRouter } from "./upload";
import connectDB from './config/db'
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from 'cors';
import { config } from 'dotenv';
import productRoutes from "./routes/productRoutes";
import userRoutes from "./routes/userRoutes";
import mediaRoutes from "./routes/mediaRoutes";
import rateLimit from 'express-rate-limit'
import helmet from "helmet";
import mongoSanitize from 'express-mongo-sanitize'

config()
connectDB()

const app: Application = express();

// Set security HTTP headers
app.use(helmet());

// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Test middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  //@ts-ignore
  req.requestTime = new Date().toISOString();
  // console.log(req.cookies);
  next();
});

app.use(compression())
app.use(cookieParser())
app.use(bodyParser.json());
app.use(cors({ credentials: true }))

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

const server = http.createServer(app)

app.get("/", (req: Request, res: Response) => {
  res.send("Healthy");
});

app.use('/api/products', productRoutes)
app.use('/api/users', userRoutes)
app.use('/api/media', mediaRoutes)
app.use("/api/uploadthing",
  createUploadthingExpressHandler({ router: uploadRouter }),
);

const PORT = process.env.PORT || 8080;

server.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});