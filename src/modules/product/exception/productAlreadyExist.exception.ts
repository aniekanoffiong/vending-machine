import HttpException from "../../../exceptions/http.exception";

class ProductAlreadyExistException extends HttpException {
  constructor(productName: string) {
    super(401, `Another product already exist with the name '${productName}'`);
  }
}

export default ProductAlreadyExistException;
