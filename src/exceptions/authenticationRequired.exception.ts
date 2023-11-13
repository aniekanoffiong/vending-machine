import HttpException from "./http.exception";

class AuthenticationRequiredException extends HttpException {
  constructor() {
    super(401, 'Authentication required');
  }
}

export default AuthenticationRequiredException;
