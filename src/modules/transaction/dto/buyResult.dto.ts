import { IsArray, IsInstance, IsNumber } from 'class-validator';
import PurchaseDto from './purchase.dto';

class BuyResultDto {
    constructor(totalSpent: number, change: number[], purchasedData: PurchaseDto) {
        this.totalSpent = totalSpent;
        this.change = change;
        this.purchasedProducts = purchasedData;
    }

    @IsNumber()
    public totalSpent: number;

    @IsArray()
    public change: number[];

    @IsInstance(PurchaseDto)
    public purchasedProducts: PurchaseDto;
}

export default BuyResultDto;