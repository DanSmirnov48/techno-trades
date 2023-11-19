import express, { Application, NextFunction, Request, Response } from "express";
import { config } from 'dotenv';
import http from 'http';

config()

const app: Application = express();

const server = http.createServer(app)

app.get("/", (req: Request, res: Response) => {
    res.send("Healthy");
});

const PORT = process.env.PORT || 8080;

server.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
});