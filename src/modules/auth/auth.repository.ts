import { AppDataSource } from "../../data-source";
import { ActiveLogin } from "./auth.entity";

export default AppDataSource.getRepository(ActiveLogin);