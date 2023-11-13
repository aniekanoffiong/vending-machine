import { IsNumber } from 'class-validator';

class BuyDto {
    @IsNumber()
    public productId: number;

    @IsNumber()
    public amountOfProducts: number;
}

export default BuyDto;
