import axios, { Axios, AxiosResponse } from "axios";
import nock from "nock";
import app from "../src/app";
import http, { Server } from "http";
import { AppDataSource } from "../src/data-source";
import userRepository from "../src/modules/user/user.repository";
import Role from "../src/types/role.enum";
import { AddressInfo } from "net";
import AuthenticationService from "../src/modules/auth/auth.service";

// @ts-ignore
let axiosAPIClient: Axios;
let buyerUser;
let sellerUser;
let addressInfo: AddressInfo;
let buyerCookie: string;
// let sellerCookie: string;

beforeAll(async () => {
  const server: Server = http.createServer(app);
  app.set("port", null)
  server.listen(null);

  addressInfo = server.address() as AddressInfo;

  const axiosConfig = {
    baseURL: `http://127.0.0.1:${addressInfo.port}`,
    validateStatus: () => true, //Don't throw HTTP exceptions. Delegate to the tests to decide which error is acceptable
  };
  axiosAPIClient = axios.create(axiosConfig);

  await AppDataSource.initialize()
  .then(() => console.log("Typeorm successfully initialized"))
  .catch((error) => console.log(`unable to initialize typeorm ${error}`))

  buyerUser = await userRepository.create({username: "buyer_user", deposit: 0, password: "password", role: Role.BUYER});
  await userRepository.save(buyerUser);
  const data = AuthenticationService.createToken(buyerUser);
  buyerCookie = AuthenticationService.createCookie(data);
  
  sellerUser = await userRepository.create({username: "seller_user", deposit: 0, password: "password", role: Role.SELLER});
  await userRepository.save(sellerUser);
  // const tokenData = AuthenticationService.createToken(buyerUser);
  // sellerCookie = AuthenticationService.createCookie(tokenData);
  
  const hostname = '127.0.0.1';
  // nock.disableNetConnect();
  // nock.enableNetConnect(hostname);

  // Some http clients swallow the "no match" error, so throw here for easy debugging
  nock.emitter.on('no match', (req) => {
    if (req.hostname !== hostname) {
      throw new Error(`Nock no match for: ${req.hostname}`)
    }
  })
});

beforeEach(() => {
  nock(`http://localhost:${addressInfo.port}/user/`).get(`/1`).reply(200, {
    id: 1,
    name: 'John',
  });
});

afterEach(() => {
  // nock.cleanAll();
});

afterAll(async () => {
  // nock.enableNetConnect();
});


describe('/api', () => {
  describe('POST /deposit', () => {
    test('When deposit is made with valid currencies', async () => {
      
      //When
      const getResponse: AxiosResponse = await axiosAPIClient.post(`/api/deposit`, [5, 10, 20, 50, 100], {
        headers: {
          Cookie: buyerCookie
        },
      });

      //Then
      expect(getResponse).toMatchObject({
        message: "Deposit successful",
        oldBalance: 0,
        newBalance: 185
      });
    });

    test('When the deposit made contains invalid currencies', async () => {
      //When
      // @ts-ignore
      const getResponse = await axiosAPIClient.post(`/api/deposit`, [5, 20, 25], {
        headers: {
          Cookie: buyerCookie
        }
      });

      //Then
      expect(getResponse).toMatchObject({
        message: "Send the amount only in denominations of 5, 10, 20, 50 and 100 cents"
      });
    });
  });

});