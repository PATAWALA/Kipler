import { Request, Response } from "express";
import Transaction, { ITransaction } from "../models/transactionModel";

// Récupérer toutes les transactions
export const getTransactions = async (req: Request, res: Response) => {
  try {
    const transactions: ITransaction[] = await Transaction.find().sort({ date: -1 });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la récupération des transactions" });
  }
};

// Ajouter une transaction (exemple d’utilisation future)
export const createTransaction = async (req: Request, res: Response) => {
  try {
    const { userId, type, amount } = req.body;
    const transaction = new Transaction({ userId, type, amount });
    await transaction.save();
    res.status(201).json(transaction);
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la création de la transaction" });
  }
};

