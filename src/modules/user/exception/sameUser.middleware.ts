import { Response, NextFunction } from "express"
import RequestWithUser from "../../../interfaces/userRequest.interface"
import User from "../user.interface"
import UserPermissionException from "./userPermission.exception"

export default (req: RequestWithUser, _res: Response, next: NextFunction) => {
    const user: User|undefined = req.user
    const { id }: { id?: number } = req.params;
    if (user?.id !== id) {
        next(new UserPermissionException())
    } else {
        next()
    }
}