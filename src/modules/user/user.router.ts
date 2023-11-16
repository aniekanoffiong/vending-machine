import { Router } from "express";
import user from "./user.controller";
import authMiddleware from "../auth/auth.middleware";
import authController from "../auth/auth.controller";
import sameUserMiddleware from "./sameUser.middleware";

const router = Router();

router.post(
    "/",
    authController.register
);

router.get(
    "/",
    authMiddleware,
    user.all
);

router.get(
    '/:id',
    authMiddleware,
    user.get
);

router.put(
    '/:id',
    authMiddleware,
    sameUserMiddleware,
    user.put
);

router.delete(
    '/:id',
    authMiddleware,
    sameUserMiddleware,
    user.delete
);

export default router;