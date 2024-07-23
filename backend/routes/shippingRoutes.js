import express from 'express';
// import { protect } from '../middleware/authMiddleware';
import { getCity, getProvince } from '../controllers/shippingController.js';
const router = express.Router();

router.route('/province').get(getProvince);
router.route('/city/:id').get(getCity);

export default router;
