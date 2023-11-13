import { Response, NextFunction } from "express"
import ProductPermissionException from "../exception/productPermission.exception"
import RequestWithUser from "../../../interfaces/userRequest.interface"
import Role from '../../../types/role.enum'

export default (req: RequestWithUser, _res: Response, next: NextFunction) => {
    const user = req.user;
    if (user?.role != Role.SELLER) {
        next(new ProductPermissionException())
    } else {
        next()
    }
}