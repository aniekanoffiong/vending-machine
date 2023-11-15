import express, { Application, Request, NextFunction, Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import createError, { HttpError } from "http-errors";
import dotenv from "dotenv";
import logger from "morgan";
import routers from "../app/routers";

dotenv.config();

const app: Application = express();
app.use(express.json());
app.use(logger("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors({
    origin: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD"],
    credentials: true,
}));

app.use('/api' , routers);

app.use((_req: Request, _res: Response, next: NextFunction): void => {
    next(createError(404));
});
  
// error handler
app.use((err: HttpError, req: Request, res: Response, _next: NextFunction): void => {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    console.log(`checking error content ${err}`);
    // render the error page
    res.status(err.status || 500);
    res.send({ message: err.status === 500 ? "There was an internal error" : err.message });
});

export default app;