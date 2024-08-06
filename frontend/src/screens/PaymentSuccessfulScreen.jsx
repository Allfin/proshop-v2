import React from 'react';
import { useLocation } from 'react-router-dom';
import { useUpdatePayOrderQuery } from '../slices/ordersApiSlice';
import { useDispatch } from 'react-redux';
import { clearCartItems } from '../slices/cartSlice';

const PaymentSuccessful = () => {
  const dispatch = useDispatch();
  dispatch(clearCartItems());

  // to find query params
  const useQuery = () => new URLSearchParams(useLocation().search);
  const query = useQuery();
  const orderId = query.get('order_id');

  const { data: success } = useUpdatePayOrderQuery(orderId);
  return <div>Terima Kasih Pembayaran</div>;
};

export default PaymentSuccessful;
