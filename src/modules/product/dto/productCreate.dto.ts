import { IsNumber, IsString } from "class-validator";

class CreateProductDto {
    @IsNumber()
    amountAvailable: number

    @IsString()
    cost: number

    @IsString()
    productName: string
}

export default CreateProductDto;