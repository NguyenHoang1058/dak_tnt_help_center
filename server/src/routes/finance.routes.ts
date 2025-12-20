import { Router } from "express";
import { TradingController } from "../controllers/TradingController";

const router = Router();

router.post('/trade/buy', TradingController.buy);
router.post('/wallet', TradingController.getWallet);

export default router;