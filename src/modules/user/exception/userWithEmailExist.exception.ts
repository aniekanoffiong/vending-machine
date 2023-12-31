import HttpException from "../../../exceptions/http.exception";

class UserWithEmailExistsException extends HttpException {
  constructor(username: string) {
    super(422, `User with username ${username} already exists.`);
  }
}

export default UserWithEmailExistsException;