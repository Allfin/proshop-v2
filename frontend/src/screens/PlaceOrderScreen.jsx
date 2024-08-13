import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button, Row, Col, ListGroup, Image, Card } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import Message from '../components/Message';
import CheckoutSteps from '../components/CheckoutSteps';
import Loader from '../components/Loader';
import {
  useCreateOrderMutation,
  usePayOrderMutation,
} from '../slices/ordersApiSlice';
import { formatRupiah } from '../utils/price';

const PlaceOrderScreen = () => {
  const navigate = useNavigate();

  const cart = useSelector((state) => state.cart);
  const auth = useSelector((state) => state.auth);

  const [createOrder, { isLoading, error }] = useCreateOrderMutation();
  const [payOrder] = usePayOrderMutation();

  console.log(cart);

  useEffect(() => {
    if (!cart.shippingDetails.address) {
      navigate('/shipping');
    }

    const snapScript = 'https://app.sandbox.midtrans.com/snap/snap.js';
    const script = document.createElement('script');
    const clientKey = 'SB-Mid-client-xMuaOFLhxcnaElJS';
    script.src = snapScript;
    script.setAttribute('data-client-key', clientKey);
    script.async = true;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [cart.paymentMethod, cart.shippingDetails.address, navigate]);

  const placeOrderHandler = async () => {
    try {
      // add to database order
      const responCreateOrder = await createOrder({
        orderItems: cart.cartItems,
        userId: auth.userInfo._id,
        shippingDetails: cart.shippingDetails,
        itemsPrice: cart.itemPrice,
        shippingPrice: cart.shippingDetails.shippingPrice,
      }).unwrap();

      if (responCreateOrder) {
        // payment
        const responPayOrder = await payOrder({
          orderId: responCreateOrder._id,
          details: {
            transaction_details: {
              order_id: responCreateOrder._id,
              gross_amount: responCreateOrder.totalPrice,
            },
            customer_details: {
              name: responCreateOrder.user.name,
              email: responCreateOrder.user.email,
            },
            callbacks: {
              finish: `/thanks`,
            },
          },
        }).unwrap();

        if (responPayOrder && responPayOrder.token) {
          window.snap.pay(responPayOrder.token);
        } else {
          console.log('Token tidak tersedia dalam respons');
        }
      }
    } catch (err) {
      toast.error(err);
    }
  };

  return (
    <>
      <CheckoutSteps step1 step2 step3 />
      <Row>
        <Col md={8}>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Address:</strong>
                {cart.shippingDetails.address}, {cart.shippingDetails.city}{' '}
                {cart.shippingDetails.postalCode},{' '}
                {cart.shippingDetails.country}
              </p>
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Order Items</h2>
              {cart.cartItems.length === 0 ? (
                <Message>Your cart is empty</Message>
              ) : (
                <ListGroup variant='flush'>
                  {cart.cartItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={1}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fluid
                            rounded
                          />
                        </Col>
                        <Col>
                          <Link to={`/product/${item.product}`}>
                            {item.name}
                          </Link>
                        </Col>
                        <Col md={4}>
                          {item.qty} x {formatRupiah(item.price)} =
                          {formatRupiah((item.qty * (item.price * 100)) / 100)}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant='flush'>
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Items Price</Col>
                  <Col>{formatRupiah(cart.itemsPrice)}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Shipping</Col>
                  <Col>{formatRupiah(cart.shippingDetails.shippingPrice)}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Total</Col>
                  <Col>{formatRupiah(cart.shippingDetails.totalPrice)}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                {error && (
                  <Message variant='danger'>{error.data.message}</Message>
                )}
              </ListGroup.Item>
              <ListGroup.Item>
                <Button
                  variant='success'
                  disabled={cart.cartItems === 0}
                  onClick={placeOrderHandler}
                >
                  Bayar
                </Button>
                {isLoading && <Loader />}
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default PlaceOrderScreen;
