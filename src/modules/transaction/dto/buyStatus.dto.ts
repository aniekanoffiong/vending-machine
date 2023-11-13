import { IsBoolean, IsString } from 'class-validator';

class BuyStatusDto {
    constructor(status: boolean, reason: string) {
        this.status = status;
        this.message = reason;
    }

    @IsBoolean()
    public status: boolean;

    @IsString()
    public message: string;
}

export default BuyStatusDto;