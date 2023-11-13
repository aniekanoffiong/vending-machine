import { Router } from "express";
import transaction from "./transaction.controller";
import authMiddleware from "../auth/auth.middleware";
import depositValidationMiddleware from "./middleware/depositValidation.middleware";

const router = Router();

router.post(
    "/deposit",
    authMiddleware,
    depositValidationMiddleware,
    transaction.deposit
);

router.post(
    "/buy",
    authMiddleware,
    transaction.buy
)

router.post(
    "/reset",
    authMiddleware,
    transaction.reset
)

export default router;