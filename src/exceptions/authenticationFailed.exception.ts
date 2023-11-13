import HttpException from "./http.exception";

class AuthenticationFailedException extends HttpException {
  constructor() {
    super(401, 'Authentication token missing');
  }
}

export default AuthenticationFailedException;