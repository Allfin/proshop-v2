import axios from 'axios';
import asyncHandler from '../middleware/asyncHandler.js';
import Order from '../models/orderModel.js';
import Product from '../models/productModel.js';
import { calcPrices } from '../utils/calcPrices.js';
import { snap } from '../utils/midtrans.js';
import dotenv from 'dotenv';
import { updatePayment } from '../utils/updateDatabase.js';
// import { verifyPayPalPayment, checkIfNewTransaction } from '../utils/paypal.js';

dotenv.config();

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = asyncHandler(async (req, res) => {
  const { orderItems, shippingDetails, paymentMethod } = req.body;
  console.log(shippingDetails);

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
  } else {
    // NOTE: here we must assume that the prices from our client are incorrect.
    // We must only trust the price of the item as it exists in
    // our DB. This prevents a user paying whatever they want by hacking our client
    // side code - https://gist.github.com/bushblade/725780e6043eaf59415fbaf6ca7376ff

    // get the ordered items from our database
    const itemsFromDB = await Product.find({
      _id: { $in: orderItems.map((x) => x._id) },
    });

    // map over the order items and use the price from our items from database
    const dbOrderItems = orderItems.map((itemFromClient) => {
      const matchingItemFromDB = itemsFromDB.find(
        (itemFromDB) => itemFromDB._id.toString() === itemFromClient._id
      );
      return {
        ...itemFromClient,
        product: itemFromClient._id,
        price: matchingItemFromDB.price,
        _id: undefined,
      };
    });

    // calculate prices
    const { itemsPrice, shippingPrice, totalPrice } = calcPrices(dbOrderItems);

    const order = new Order({
      orderItems: dbOrderItems,
      user: req.body.userId,
      shippingDetails,
      paymentMethod,
      itemsPrice,
      shippingPrice: shippingDetails.costDelivery,
      totalPrice: shippingDetails.totalPrice,
    });

    const createdOrder = await order.save();

    res.status(201).json(createdOrder);
  }
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.json(orders);
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate('user', 'name email')
    .populate('orderItems.product', 'name image price');

  const client_key = process.env.MD_CLIENT_KEY;

  if (order) {
    res.json({ order, client_key });
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Paid order
// @route   POST /api/orders/:id/
// @access  Private
const createTransaction = asyncHandler(async (req, res) => {
  const token = await snap.createTransactionToken(req.body);
  res.json({ token });
});

// @desc    Update order to paid
// @route   GET /api/orders/:id/thanks/?order_id
// @access  Private
const getTransactions = asyncHandler(async (req, res) => {});

const getTransactionsById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();

    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Update order to delivered
// @route   GET /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate('user', 'id name');
  res.json(orders);
});

export {
  addOrderItems,
  getMyOrders,
  getOrderById,
  getTransactions,
  getTransactionsById,
  updateOrderToDelivered,
  createTransaction,
  getOrders,
};
