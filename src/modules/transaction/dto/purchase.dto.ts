import { IsInstance, IsNumber } from 'class-validator';
import { Product } from '../../product/product.entity';

class PurchaseDto {
    constructor(quantity: number, product: Product) {
        this.quantity = quantity;
        this.product = product;
    }

    @IsNumber()
    public quantity: number;

    @IsInstance(Product)
    public product: Product;
}

export default PurchaseDto;