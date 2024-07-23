import express from 'express';
// import { protect } from '../middleware/authMiddleware';
import { getProvince } from '../controllers/shippingController.js';
const router = express.Router();

router.route('/province').get(getProvince);

export default router;
