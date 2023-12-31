import { Request } from "express";
import User from "../modules/user/user.interface";

interface RequestWithUser extends Request {
  user?: User;
  authUuid?: string;
}

export default RequestWithUser;