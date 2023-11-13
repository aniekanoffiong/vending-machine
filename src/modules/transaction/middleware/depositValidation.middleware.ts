import { Response, NextFunction, Request } from "express";

export default async (req: Request, res: Response, next: NextFunction) => {
    const acceptableValues = [5, 10, 20, 50, 100];
    const { amount }: {amount: number[]} = req.body;
    if (!Array.isArray(amount)) {
        res.status(422);
        res.send({message: `Send the amount as an list of coins in denominations of 5, 10, 20, 50 and 100 cents`});
        return;
    }
    if (!amount.every((item) => acceptableValues.includes(item))) {
        res.status(422);
        res.send({message: `Send the amount only in denominations of 5, 10, 20, 50 and 100 cents`});
        return;
    }
    next()
}