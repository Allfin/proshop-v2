import express from 'express';
const router = express.Router();
import {
  addOrderItems,
  getMyOrders,
  getOrderById,
  updateOrderToDelivered,
  getOrders,
  createTransaction,
  getUpdatePayOrder,
} from '../controllers/orderController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router.route('/').post(protect, addOrderItems).get(protect, admin, getOrders);
router.route('/mine').get(protect, getMyOrders);
router
  .route('/:id')
  .get(protect, getOrderById)
  .post(protect, createTransaction);
router.route('/:id/thanks').get(protect, getUpdatePayOrder);
router.route('/:id/deliver').put(protect, admin, updateOrderToDelivered);

export default router;
