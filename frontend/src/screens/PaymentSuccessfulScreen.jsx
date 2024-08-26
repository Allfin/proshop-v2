import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useUpdatePayOrderQuery } from '../slices/ordersApiSlice';
import { useDispatch } from 'react-redux';
import { clearCartItems } from '../slices/cartSlice';
import { Card, Table, Row, Col } from 'react-bootstrap';
import { formatRupiah } from '../utils/price';

const PaymentSuccessful = () => {
  const dispatch = useDispatch();
  dispatch(clearCartItems());

  // to find query params
  const useQuery = () => new URLSearchParams(useLocation().search);
  const query = useQuery();
  const orderId = query.get('order_id');

  const { data: order } = useUpdatePayOrderQuery(orderId);

  const clacSubTotal = (price, qty) => price * qty;
  return (
    <>
      <Card>
        <Card.Header className='text-center'>
          <h2>Delivery Receipt</h2>
        </Card.Header>
        <Card.Body>
          <Row className='mb-4'>
            <Col md={6}>
              <h5>Shipping Information</h5>
              <h5>Informasi Penerima</h5>
              <p>Nama Penerima: {order?.shippingDetails?.recipientName}</p>
              <p>Alamat: {order?.shippingDetails?.address}</p>
              <p>No. Telp: {order?.shippingDetails?.numberPhone}</p>
            </Col>
          </Row>
          <Table bordered>
            <thead className='thead-light'>
              <tr>
                <th>No</th>
                <th>Nama Produk</th>
                <th>Kuantitas</th>
                <th>Harga Satuan</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {order?.orderItems?.map((item, index) => (
                <tr>
                  <td>{index + 1}</td>
                  <td>{item.product.name}</td>
                  <td>{item.qty}</td>
                  <td>{formatRupiah(item.product.price)}</td>
                  <td>
                    {formatRupiah(clacSubTotal(item.product.price, item.qty))}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <th colSpan='4' className='text-right'>
                  Shipping
                </th>
                <th>{formatRupiah(order?.shippingPrice)}</th>
              </tr>
              <tr>
                <th colSpan='4' className='text-right'>
                  Total
                </th>
                <th>{formatRupiah(order?.totalPrice)}</th>
              </tr>
            </tfoot>
          </Table>
        </Card.Body>
      </Card>
    </>
  );
};

export default PaymentSuccessful;
