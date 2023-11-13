import { AppDataSource } from "../../data-source";
import { Product } from "./product.entity";

export default AppDataSource.getRepository(Product);