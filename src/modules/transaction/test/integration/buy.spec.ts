import 'jest';
import express from 'express';
import request from 'supertest';
import {
    StatusCodes,
} from 'http-status-codes';
import IntegrationHelpers from '../../../../../test/helpers/Integration-helpers';
import { User } from '../../../user/user.entity';
import { AppDataSource } from '../../../../data-source';
import userRepository from '../../../user/user.repository';
import AuthenticationService from '../../../auth/auth.service';
import Role from '../../../../types/role.enum';
import { Product } from '../../../product/product.entity';
import productRepository from '../../../product/product.repository';


describe('status integration tests', () => {
    let app: express.Application;
    const contentType: string = 'application/json; charset=utf-8';
    let buyerUser: User;
    let buyerCookie: string;
    let sellerUser: User;
    let product: Product;

    beforeAll(async() => {
        app = await IntegrationHelpers.getApp();
        await AppDataSource.initialize()
            .then(() => console.log("Typeorm successfully initialized"))
            .catch((error) => console.log(`unable to initialize typeorm ${error}`));
    });

    beforeEach(async () => {
        buyerUser = await userRepository.create({username: "buyer_user", deposit: 100, password: "password", role: Role.BUYER});
        await userRepository.save(buyerUser);
        const data = AuthenticationService.createToken(buyerUser);
        buyerCookie = AuthenticationService.createCookie(data);

        sellerUser = await userRepository.create({username: "seller_user", deposit: 0, password: "password", role: Role.SELLER});
        await userRepository.save(sellerUser);
        product = await productRepository.create({productName: "Another Product 1", cost: 20, amountAvailable: 10, sellerId: sellerUser.id});
        await productRepository.save(product);
    })

    it('buy fails when auth cookie is not valid', async () => {
        await request(app)
            .post('/api/buy')
            .set('Accept', 'application/json')
            .expect('Content-Type', contentType)
            .expect(StatusCodes.UNAUTHORIZED);
    });

    it('can buy when product is valid and deposit is sufficient', async () => {
        const amountOfProducts: number = 2;
        await request(app)
            .post('/api/buy')
            .set('Accept', 'application/json')
            .set("Cookie", buyerCookie)
            .send({productId: product.id, amountOfProducts})
            .expect('Content-Type', contentType)
            .expect((res: request.Response) => {
                expect(res.body).toEqual({
                    totalSpent: 40,
                    change: [50,10],
                    purchasedProducts: {
                        quantity: amountOfProducts,
                        product: {...product, id: product.id, amountAvailable: 8}
                    }
                })
            })
            .expect(StatusCodes.OK);
    });

    it('returns validation error when product quantity is less than amount of products to be purchased', async () => {
        const amountOfProducts: number = 12;
        await request(app)
            .post('/api/buy')
            .set('Accept', 'application/json')
            .set("Cookie", buyerCookie)
            .send({productId: product.id, amountOfProducts})
            .expect('Content-Type', contentType)
            .expect((res: request.Response) => {
                console.log(res.body)
                expect(res.body).toEqual({status: false, message: `Product Quantity available ${product.amountAvailable} is less than amount desired ${amountOfProducts}`})
            })
            .expect(StatusCodes.UNPROCESSABLE_ENTITY);
    });

    it('returns validation error when user deposit is less than total cost of products', async () => {
        const amountOfProducts: number = 8;
        await request(app)
            .post('/api/buy')
            .set('Accept', 'application/json')
            .set("Cookie", buyerCookie)
            .send({productId: product.id, amountOfProducts})
            .expect('Content-Type', contentType)
            .expect((res: request.Response) => {
                console.log(res.body)
                expect(res.body).toEqual({status: false, message: `Total cost of product quantity ${product.cost * amountOfProducts} is greater than deposit ${buyerUser.deposit}`})
            })
            .expect(StatusCodes.UNPROCESSABLE_ENTITY);
    });
});