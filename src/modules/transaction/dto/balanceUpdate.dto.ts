import { IsNumber, IsString } from 'class-validator';

class BalanceUpdateDto {
    constructor(resultStatus: number|undefined, oldBalance: number, newBalance: number) {
        this.message = resultStatus && resultStatus > 0 ? "Deposit successful" : "Unable to make deposit";
        this.oldBalance = oldBalance;
        this.newBalance = newBalance;
    }

    @IsString()
    public message: string;

    @IsNumber()
    public oldBalance: number;

    @IsNumber()
    public newBalance: number;
}

export default BalanceUpdateDto;
