import { IsArray } from 'class-validator';

class DepositDto {
    @IsArray()
    public amount: number[];
}

export default DepositDto;