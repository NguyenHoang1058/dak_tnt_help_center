import { Router } from "express";
import { TradingController } from "../controllers/TradingController";

const router = Router();

router.post('/trade/buy', TradingController.buy);
router.get('/wallet', TradingController.getWallet);

export default router;