import express from 'express';
// import { protect } from '../middleware/authMiddleware';
import {
  getCity,
  getProvince,
  getCost,
} from '../controllers/shippingController.js';
const router = express.Router();

router.route('/province').get(getProvince);
router.route('/city/:id').get(getCity);
router.route('/cost').post(getCost);

export default router;
