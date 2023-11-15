import HttpException from "../../../exceptions/http.exception";

class ProductDataIncompleteException extends HttpException {
  constructor() {
    super(422, `Product details are incomplete`);
  }
}

export default ProductDataIncompleteException;