import { Router } from "express";
import user from "./user.controller";
import authMiddleware from "../auth/auth.middleware";
import authController from "../auth/auth.controller";
import sameUserMiddleware from "./exception/sameUser.middleware";

const router = Router();

router.post(
    "/",
    authController.register
);

router.get(
    "/",
    authMiddleware,
    user.all
)

router.get(
    '/:id',
    authMiddleware,
    user.get
)

router.put(
    '/:id',
    authMiddleware,
    user.put
)

router.delete(
    '/:id',
    authMiddleware,
    sameUserMiddleware,
    user.delete
)

export default router;