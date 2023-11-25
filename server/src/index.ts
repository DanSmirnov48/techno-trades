import express, { Application, Request, Response } from "express";
import { config } from 'dotenv';
import connectDB from './config/db'
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from 'cors';
import userRoutes from "./routes/userRoutes";
import productRoutes from "./routes/productRoutes";

config()
connectDB()

const app: Application = express();

const server = http.createServer(app)

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

app.use(compression())
app.use(cookieParser())
app.use(bodyParser.json());
app.use(cors({ credentials: true }))

app.get("/", (req: Request, res: Response) => {
    res.send("Healthy");
});

app.use('/api/products', productRoutes)
app.use('/api/users', userRoutes)

const PORT = process.env.PORT || 8000;

server.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
});