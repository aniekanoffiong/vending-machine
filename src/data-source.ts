import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "./modules/user/user.entity"
import { Product } from "./modules/product/product.entity"
import { ActiveLogin } from "./modules/auth/auth.entity"
import dotenv from "dotenv"

dotenv.config();

const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DATABASE_HOST,
    port: 5432,
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASS,
    database: process.env.DATABASE_NAME,
    synchronize: true,
    logging: false,
    entities: [User, Product, ActiveLogin],
    migrations: [],
    subscribers: [],
})

export { AppDataSource }