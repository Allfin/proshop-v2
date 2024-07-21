import React from 'react';
import { useLocation } from 'react-router-dom';
import { useUpdateTransactionQuery } from '../slices/ordersApiSlice';

const PaymentSuccessful = () => {
  // to find query params
  const useQuery = () => new URLSearchParams(useLocation().search);
  const query = useQuery();
  const orderId = query.get('order_id');

  const { data } = useUpdateTransactionQuery(orderId);

  return <div>Terima Kasih Pembayaran {data}</div>;
};

export default PaymentSuccessful;
