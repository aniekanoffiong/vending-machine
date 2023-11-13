import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "../src/modules/user/user.entity"
import { Product } from "../src/modules/product/product.entity"

export const appDataSource = new DataSource({
    type: "mysql",
    host: process.env.DATABASE_HOST,
    port: 3306,
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASS,
    database: process.env.DATABASE_NAME,
    synchronize: true,
    logging: false,
    entities: [User, Product],
    migrations: [],
    subscribers: [],
})
.initialize()
.then(() => {
    console.log("Data Source has been initialized!")
}).catch((err) => {
    console.error("Error during Data Source initialization:", err)
})