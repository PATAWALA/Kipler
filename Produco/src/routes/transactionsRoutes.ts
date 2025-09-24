import express from "express";
import { getTransactions, createTransaction } from "../controllers/transactionController";

const router = express.Router();

// GET toutes les transactions
router.get("/", getTransactions);

// POST une transaction (optionnel pour ajout futur)
router.post("/", createTransaction);

export default router;
