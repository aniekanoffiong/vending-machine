import { Response, NextFunction } from "express"
import ProductPermissionException from "../exception/productPermission.exception"
import RequestWithUser from "../../../interfaces/userRequest.interface"
import Role from '../../../types/role.enum'
import CreateProductDto from "../dto/productCreate.dto"
import ProductDataIncompleteException from "../exception/productDataIncomplete.exception"

export default (req: RequestWithUser, _res: Response, next: NextFunction) => {
    const user = req.user;
    const productDto: CreateProductDto = req.body;
    if (user?.role !== Role.SELLER) {
        next(new ProductPermissionException())
    } else if (!productDto.amountAvailable || productDto.amountAvailable <= 0 || 
        !productDto.cost || productDto.cost <= 0 || 
        !productDto.productName || productDto.productName === "") {
            next(new ProductDataIncompleteException())           
    } else {
        next()
    }
}