import { Response, NextFunction } from "express";
import transactionService from "../transaction/transaction.service";
import BuyDto from "./dto/buy.dto";
import DepositDto from "./dto/deposit.dto";
import User from "../user/user.interface";
import RequestWithUser from "src/interfaces/userRequest.interface";
import BuyResultDto from "./dto/buyResult.dto";
import { Product } from "../product/product.entity";
import productService from "../product/product.service";
import ProductNotFoundException from "../product/exception/productNotFound.exception";
import BuyStatusDto from "./dto/buyStatus.dto";

const UserController = {
    deposit: async function(req: RequestWithUser, res: Response, next: NextFunction) {
        const depositData: DepositDto = req.body;
        const user = req.user as User;
        try {
            const balanceResponse = await transactionService.deposit(depositData, user);
            res.send(balanceResponse);
        } catch (error) {
            next(error);
        }
    },

    buy: async function(req: RequestWithUser, res: Response, next: NextFunction) {
        const buyData: BuyDto = req.body;
        const user = req.user as User;
        try {
            const product: Product|null = await productService.get(buyData.productId); 
            if (!product) {
                console.log(`Unable to find the product with id ${buyData.productId}`);
                throw new ProductNotFoundException(buyData.productId);
            }
            const checkCanBuy: BuyStatusDto = await transactionService.canBuyProducts(buyData, user, product);
            console.log(`retrieved confirmation of canBuy ${JSON.stringify(checkCanBuy)}`);
            if (!checkCanBuy.status) {
                res.send(checkCanBuy);
            } else {
                const result: BuyResultDto = await transactionService.buy(buyData, user, product);
                res.send(result);
            }
        } catch (error) {
            next(error);
        }
    },

    reset: async function(req: RequestWithUser, res: Response, next: NextFunction) {
        try {
            const user = req.user as User;
            const result = await transactionService.performDeposit(user, 0);
            res.send(result);
        } catch (error) {
            next(error);
        }
    },
}

export default UserController;