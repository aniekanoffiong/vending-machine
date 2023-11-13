import express, { Application, Request, NextFunction, Response } from "express";
import logger from "morgan";
import cookieParser from "cookie-parser";
import createError, { HttpError } from "http-errors";
import routers from "../app/routers"
import dotenv from "dotenv"

dotenv.config();

const app: Application = express();
app.use(express.json());
app.use(logger("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

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