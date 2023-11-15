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
import productRepository from '../../product.repository';
import { Like } from 'typeorm';


describe('status integration tests', () => {
    let app: express.Application;
    const contentType: string = 'application/json; charset=utf-8';
    let buyerUser: User;
    let buyerCookie: string;
    let sellerUser: User;
    let sellerCookie: string;
    
    beforeAll(async () => {
        app = await IntegrationHelpers.getApp();
        await AppDataSource.initialize()
            .then(() => console.log("Typeorm successfully initialized"))
            .catch((error) => console.log(`unable to initialize typeorm ${error}`));

          buyerUser = await userRepository.create({username: "buyer_user", deposit: 0, password: "password", role: Role.BUYER});
          await userRepository.save(buyerUser);
          const buyerToken = AuthenticationService.createToken(buyerUser);
          buyerCookie = AuthenticationService.createCookie(buyerToken);

          sellerUser = await userRepository.create({username: "seller_user", deposit: 0, password: "password", role: Role.SELLER});
          await userRepository.save(sellerUser);
          const sellerToken = AuthenticationService.createToken(sellerUser);
          sellerCookie = AuthenticationService.createCookie(sellerToken);

          productRepository.delete({productName: Like("%Another Product%")});
    });

    it('create product fails when auth cookie is not valid', async () => {
        await request(app)
            .post('/api/products')
            .set('Accept', 'application/json')
            .expect('Content-Type', contentType)
            .expect(StatusCodes.UNAUTHORIZED);
    });

    it('can create product if user is a seller', async () => {
        await request(app)
            .post('/api/products')
            .set('Accept', 'application/json')
            .set("Cookie", sellerCookie)
            .send({productName: "Another Product 10", cost: 20, amountAvailable: 10})
            .expect('Content-Type', contentType)
            .expect((res: request.Response) => {
                console.log(res.body);
                expect(res.body.productName).toEqual("Another Product 10");
                expect(res.body.cost).toEqual(20);
                expect(res.body.amountAvailable).toEqual(10);
                expect(res.body.sellerId).toEqual(sellerUser.id);
            })
            .expect(StatusCodes.OK);
    });

    it('cannot create product when data is incomplete', async () => {
        await request(app)
            .post('/api/products')
            .set('Accept', 'application/json')
            .set("Cookie", sellerCookie)
            .send({productName: "Another Product 5", amountAvailable: 10})
            .expect('Content-Type', contentType)
            .expect((res: request.Response) => {
                expect(res.body).toEqual({
                    message: "Product details are incomplete"
                })
            })
            .expect(StatusCodes.UNPROCESSABLE_ENTITY);
    });

    it('cannot create product if user is not a seller', async () => {
        await request(app)
            .post('/api/products')
            .set('Accept', 'application/json')
            .set("Cookie", buyerCookie)
            .send({productName: "Another Product 4", cost: 20, amountAvailable: 10})
            .expect('Content-Type', contentType)
            .expect((res: request.Response) => {
                expect(res.body).toEqual({
                    message: "User does not have permission to create/access the product."
                })
            })
            .expect(StatusCodes.UNPROCESSABLE_ENTITY);
    });
});