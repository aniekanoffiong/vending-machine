import HttpException from "../../../exceptions/http.exception";

class ProductPermissionException extends HttpException {
  constructor() {
    super(401, "User does not have permission to create/access the product.");
  }
}

export default ProductPermissionException;