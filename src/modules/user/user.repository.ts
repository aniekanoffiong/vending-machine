import { AppDataSource } from "../../data-source";
import { User } from "./user.entity";

export default AppDataSource.getRepository(User);