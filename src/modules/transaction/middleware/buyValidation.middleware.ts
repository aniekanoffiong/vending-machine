import { Response, NextFunction, Request } from "express";

export default async (req: Request, res: Response, next: NextFunction) => {
    const { amountOfProducts }: {amountOfProducts: number } = req.body;
    if (amountOfProducts < 1) {
        res.status(422);
        res.send({message: `You have to select at least one product`});
        return;
    }
    next()
}