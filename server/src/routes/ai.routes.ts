import { Router } from "express";
import { AIController } from "../controllers/AIController";

const router = Router();

//Định nghĩa các route con
router.post('/chat', AIController.chat);
router.post('/analyze', AIController.analyze);

export default router;