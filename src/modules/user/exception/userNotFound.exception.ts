import HttpException from "../../../exceptions/http.exception";

class UserNotFoundException extends HttpException {
  constructor(id: number) {
    super(404, `User with id ${id} not found`);
  }
}

export default UserNotFoundException;