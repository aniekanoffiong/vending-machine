import { Response, NextFunction, Request } from 'express';
import productService from "../product/product.service";
import CreateProductDto from './dto/productCreate.dto';
import RequestWithUser from 'src/interfaces/userRequest.interface';
import { Product } from './product.entity';
import UpdateProductDto from './dto/productUpdate.dto';
import User from '../user/user.interface';
import RequestParams from '../common/product.request';
import ProductNotFoundException from './exception/productNotFound.exception';

const ProductController = {
    create: async function(req: RequestWithUser, res: Response, next: NextFunction) {
        const productData: CreateProductDto = req.body;
        try {
            const product: Product = await productService.create(productData, req.user);
            res.send(product);
        } catch (error) {
            next(error);
        }
    },

    all: async function(req: RequestWithUser, res: Response, next: NextFunction) {
        try {
            const user: User|undefined = req.user;
            console.log(`GET :: Checking request with user ${JSON.stringify(user)}`);
            const products: Product[] = await productService.all();
            res.send(products);    
        } catch (error) {
            next(error);
        }
    },

    get: async function(req: Request<RequestParams>, res: Response, next: NextFunction) {
        try {
            const id = req.params.id as number;
            console.log(`GET :: Checking request with id ${id}`);
            const product: Product|null = await productService.get(id);
            if (!product) {
                throw new ProductNotFoundException(id);
            }
            res.send(product)
        } catch (error) {
            next(error);
        }
    },

    put: async function(req: Request<RequestParams>, res: Response, next: NextFunction) {
        try {
            const id = req.params.id as number;
            const productUpdateDto: UpdateProductDto = req.body;
            console.log(`PUT :: Checking request with id ${id} and updateData ${JSON.stringify(productUpdateDto)}`);
            const result: boolean = await productService.update(id, productUpdateDto);
            res.send({ message: result ? `Product with id ${id} has been successfully updated` : `Unable to update product with id ${id}`})
        } catch (error) {
            next(error);
        }
    },

    delete: async function(req: Request<RequestParams>, res: Response, next: NextFunction) {
        try {
            const id = req.params.id as number;
            console.log(`DELETE :: Checking request with id ${id}`);
            const result: boolean = await productService.delete(id);
            res.send({ message: result ? `Product with id ${id} has been successfully deleted` : `Unable to delete product with id ${id}`})
        } catch (error) {
            next(error);
        }
    },
}

export default ProductController;