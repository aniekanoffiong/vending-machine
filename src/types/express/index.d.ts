import User from "src/modules/user/user.interface";
// import {Express} from "express-serve-static-core";

// declare module 'express-serve-static-core' {
//     interface Request {
//         user?: User;
//     }
// }

export {}

declare global {
    namespace Express {
        export interface Request {
            user?: User;
        }
    }
}