import express from "express";
import authController from './auth.controller'
import authMiddleware from "./auth.middleware";

const router = express.Router();

router.post(
    "/auth",
    authMiddleware,
    authController.check
);

router.post(
    '/login',
    authController.login
);

router.post(
    '/logout',
    authMiddleware,
    authController.logout
);

router.post(
    '/logout/all',
    authMiddleware,
    authController.logoutAll
);

export default router;