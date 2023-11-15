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


describe('status integration tests', () => {
    let app: express.Application;
    const contentType: string = 'application/json; charset=utf-8';
    let buyerUser: User;
    let buyerCookie: string;

    beforeAll(async() => {
        app = await IntegrationHelpers.getApp();
        await AppDataSource.initialize()
            .then(() => console.log("Typeorm successfully initialized"))
            .catch((error) => console.log(`unable to initialize typeorm ${error}`));

          buyerUser = await userRepository.create({username: "buyer_user", deposit: 0, password: "password", role: Role.BUYER});
          await userRepository.save(buyerUser);
          const data = AuthenticationService.createToken(buyerUser);
          buyerCookie = AuthenticationService.createCookie(data);
    });

    it('deposit fails when auth cookie is not valid', async () => {
        await request(app)
            .post('/api/deposit')
            .set('Accept', 'application/json')
            .expect('Content-Type', contentType)
            .expect(StatusCodes.UNAUTHORIZED);
    });

    it('can deposit when data is valid', async () => {
        await request(app)
            .post('/api/deposit')
            .set('Accept', 'application/json')
            .set("Cookie", buyerCookie)
            .send({amount: [5,5,10,20,50]})
            .expect('Content-Type', contentType)
            .expect((res: request.Response) => {
                expect(res.body).toEqual({message: "Deposit successful", oldBalance: 0, newBalance: 90})
            })
            .expect(StatusCodes.OK);
    });

    it('returns validation error when data is not valid', async () => {
        await request(app)
            .post('/api/deposit')
            .set('Accept', 'application/json')
            .set("Cookie", buyerCookie)
            .send({amount: [5,5,15,20,30,50]})
            .expect('Content-Type', contentType)
            .expect((res: request.Response) => {
                expect(res.body).toEqual({message: "Send the amount only in denominations of 5, 10, 20, 50 and 100 cents"})
            })
            .expect(StatusCodes.UNPROCESSABLE_ENTITY);
    });

    it('returns validation error when data is wrong data type', async () => {
        await request(app)
            .post('/api/deposit')
            .set('Accept', 'application/json')
            .set("Cookie", buyerCookie)
            .send({amount: "5,5,15,20,30,50"})
            .expect('Content-Type', contentType)
            .expect((res: request.Response) => {
                expect(res.body).toEqual({message: "Send the amount as an list of coins in denominations of 5, 10, 20, 50 and 100 cents"})
            })
            .expect(StatusCodes.UNPROCESSABLE_ENTITY);
    });
});