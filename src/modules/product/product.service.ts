import User from '../user/user.interface';
import CreateProductDto from './dto/productCreate.dto';
import UpdateProductDto from './dto/productUpdate.dto';
import ProductAlreadyExistException from './exception/productAlreadyExist.exception';
import { Product } from './product.entity';
import productRepository from './product.repository';

const ProductService = {
    create: async function(productData: CreateProductDto, user: User|undefined): Promise<Product> {
        const existingProduct: Product|null = await productRepository.findOneBy({ productName: productData.productName })
        if (existingProduct) {
            throw new ProductAlreadyExistException(productData.productName);
        }
        const product: Product = productRepository.create({ ...productData, sellerId: user?.id });
        await productRepository.save(product);
        return product;
    },

    all: async function(): Promise<Product[]> {
        const products: Product[] = await productRepository.find();
        return products;
    },

    get: async function(id?: number): Promise<Product|null> {
        const product: Product|null = await productRepository.findOneBy({ id })
        return product;
    },

    update: async function(id: number, productUpdateData: UpdateProductDto): Promise<boolean> {
        const result = await productRepository.update({ id }, productUpdateData)
        console.log(`Checking affected rows for update query ${result.affected}`)
        return result.affected ? result.affected > 0 : false;
    },

    delete: async function(id?: number): Promise<boolean> {
        const result = await productRepository.delete({ id })
        console.log(`Checking affected rows for delete query ${result.affected}`)
        return result.affected ? result.affected > 0 : false;
    }
}

export default ProductService;