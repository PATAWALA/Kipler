import express from "express";
import { createOrder, getSellerOrders } from "../controllers/OrderController";
import { protect } from "../utils/middleware/authMiddleware";

const router = express.Router();

router.post("/", createOrder);
router.get("/mine", protect, getSellerOrders);

export default router;
