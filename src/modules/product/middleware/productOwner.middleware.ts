import { Response, NextFunction } from "express";
import ProductPermissionException from "../exception/productPermission.exception";
import RequestWithUser from "../../../interfaces/userRequest.interface";
import Role from "../../../types/role.enum";
import { Product } from "../product.entity";
import productRepository from "../product.repository";

export default async (req: RequestWithUser, _res: Response, next: NextFunction) => {
    const { id }: { id?: number } = req.params;
    const user = req.user;
    const product: Product|null = await productRepository.findOneBy({ id });
    if (user?.role != Role.SELLER || product?.sellerId != user.id) {
        next(new ProductPermissionException());
    } else {
        next();
    }
}