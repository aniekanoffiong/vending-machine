import HttpException from "../../../exceptions/http.exception";

class UserPermissionException extends HttpException {
  constructor() {
    super(401, `User does not have permission to access the given information.`);
  }
}

export default UserPermissionException;