import { Router } from "express";
import product from "./product.controller";
import authMiddleware from "../auth/auth.middleware";
import productMiddleware from "./middleware/productCreate.middleware";
import productOwnerMiddleware from "./middleware/productOwner.middleware";

const router = Router();

router.post(
    "/",
    authMiddleware,
    productMiddleware,
    product.create
);

router.get(
    "/",
    authMiddleware,
    product.all
)

router.get(
    '/:id',
    authMiddleware,
    product.get
)

router.put(
    '/:id',
    authMiddleware,
    productOwnerMiddleware,
    product.put
)

router.delete(
    '/:id',
    authMiddleware,
    productOwnerMiddleware,
    product.delete
)

export default router;