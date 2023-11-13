import DepositDto from "./dto/deposit.dto";
import BuyDto from "./dto/buy.dto";
import userRepository from "../user/user.repository";
import User from "../user/user.interface";
import { Product } from "../product/product.entity";
import BuyResultDto from "./dto/buyResult.dto";
import { User as UserEntity } from "../user/user.entity";
import UserNotFoundException from "../user/exception/userNotFound.exception";
import productRepository from "../product/product.repository";
import PurchaseDto from "./dto/purchase.dto";
import { UpdateResult } from "typeorm";
import BalanceUpdateDto from "./dto/balanceUpdate.dto";
import BuyStatusDto from "./dto/buyStatus.dto";

const TransactionService = {
    deposit: async function(depositData: DepositDto, user: User): Promise<BalanceUpdateDto> {
        const oldBalance = user.deposit;
        const depositAmount: number = user.deposit + TransactionService.generateSum(depositData.amount);
        const result = await this.performDeposit(user, depositAmount)
        return new BalanceUpdateDto(result?.affected, oldBalance, depositAmount);
    },

    buy: async function(buyData: BuyDto, user: User, product: Product): Promise<BuyResultDto> {
        const userEntity: UserEntity|null = await userRepository.findOneBy({ id: user.id });
        if (!userEntity) {
            throw new UserNotFoundException(user.id);
        }
        const changeAfterPurchase = await this.performPurchase(buyData, userEntity, product);
        return new BuyResultDto(
            product.cost * buyData.amountOfProducts,
            TransactionService.generateChange(changeAfterPurchase), 
            new PurchaseDto(buyData.amountOfProducts, product)
        );
    },

    canBuyProducts: async function(buyData: BuyDto, user: User, product: Product): Promise<BuyStatusDto> {
        if (buyData.amountOfProducts > product.amountAvailable) {
            console.log(`product amountAvailable ${product.amountAvailable} is less than desired amount ${buyData.amountOfProducts}`);
            return new BuyStatusDto(false, `Product Quantity available ${product.amountAvailable} is less than amount desired ${buyData.amountOfProducts}`);
        }
        console.log(`Checking that user's total deposit ${user.deposit} is greater than cost of products: desired amount ${buyData.amountOfProducts}, product cost ${product.cost} cost value ${buyData.amountOfProducts * product.cost}`)
        const totalCostOfQuantity: number = buyData.amountOfProducts * product.cost;
        const confirmCanBuy: boolean = user.deposit >= totalCostOfQuantity;
        return new BuyStatusDto(confirmCanBuy, confirmCanBuy ? "Can buy" : `Total cost of product quantity ${totalCostOfQuantity} is greater than deposit ${user.deposit}`);
    },

    performPurchase: async function(buyData: BuyDto, user: UserEntity, product: Product): Promise<number> {
        const totalPurchase = product.cost * buyData.amountOfProducts;
        const changeAfterPurchase = user.deposit - totalPurchase;
        // Update user deposit for purchase
        user.deposit = changeAfterPurchase;
        userRepository.save(user);
        // Update product amountAvailable for purchase
        product.amountAvailable -= buyData.amountOfProducts;
        productRepository.save(product); 
        return changeAfterPurchase;
    },

    generateChange: function(changeAfterPurchase: number): number[] {
        let changeArray: number[] = [];
        let currentChange = changeAfterPurchase;
        const changeCoinsList = [100, 50, 20, 10, 5];
        for (let i = 0; i < changeCoinsList.length; i++) {
            console.log(`Calculating breakdown of change for amount ${changeAfterPurchase}`);
            if (changeCoinsList[i] > currentChange) {
                continue;
            }
            const coinsCount = Math.floor(currentChange / changeCoinsList[i]);
            console.log(`checking coins count currentChange ${currentChange}, change at i${changeCoinsList[i]}, result ${coinsCount}`);
            currentChange = currentChange % changeCoinsList[i]
            console.log(`checking currentChange after ${currentChange}`);
            if (coinsCount > 0) {
                changeArray = changeArray.concat(Array(coinsCount).fill(changeCoinsList[i]));
            }
            if (currentChange === 0) {
                break;
            }
        }
        return changeArray;
    },

    performDeposit: async function(user: User, depositAmount: number): Promise<UpdateResult> {
        return await userRepository.update(
            { id: user.id },
            { deposit: depositAmount }
        );
    },

    generateSum: function(depositList: number[]) {
        return depositList.reduce((a, b) => a + b, 0);
    }
}

export default TransactionService;