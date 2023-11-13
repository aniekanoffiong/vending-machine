import HttpException from "./http.exception";

class IncorrectCredentialsException extends HttpException {
  constructor() {
    super(401, "The credentials provided does not exist");
  }
}

export default IncorrectCredentialsException;