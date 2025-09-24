import express from 'express';
import {
  registerUser,
  loginUser,
  getAllUsers,
  blockUser,
  unblockUser
} from '../controllers/userControllers';
import { protect, admin } from "../utils/middleware/authMiddleware";

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

// ⚡ Récupérer tous les users → admin seulement
router.get('/', protect, admin, getAllUsers);

// ⚡ Bloquer / Débloquer un utilisateur (admin only)
router.put("/:id/block", protect, admin, blockUser);
router.put("/:id/unblock", protect, admin, unblockUser);

export default router;
