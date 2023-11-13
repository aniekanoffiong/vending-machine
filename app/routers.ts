import express, { NextFunction, Request, Response, Router } from "express";
import authRouter from "../src/modules/auth/auth.router";
import userRouter from "../src/modules/user/user.router";
import productRouter from "../src/modules/product/product.router";
import transactionRouter from "../src/modules/transaction/transaction.router";

const router: Router = express.Router();

router.get('/', (_req: Request, res: Response, _next: NextFunction) => res.send({message: 'Welcome to our Vending Machine'}));
router.use('/', authRouter);
router.use('/users', userRouter);
router.use('/products', productRouter);
router.use('/', transactionRouter);

export default router;