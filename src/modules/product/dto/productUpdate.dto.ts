import { IsNumber, IsString } from "class-validator";

class UpdateProductDto {
    @IsNumber()
    amountAvailable: number

    @IsString()
    cost: number

    @IsString()
    productName: string
}

export default UpdateProductDto;
