import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaAngleRight } from 'react-icons/fa';

const CheckoutSteps = ({ step1, step2, step3, step4 }) => {
  return (
    <Nav className='justify-content-center align-items-center mb-4 '>
      <Nav.Item as='div'>
        {step1 ? (
          <Nav.Link as={Link} to='/login'>
            Sign In
          </Nav.Link>
        ) : (
          <Nav.Link disabled>Sign In</Nav.Link>
        )}
      </Nav.Item>
      <FaAngleRight />
      <Nav.Item as='div'>
        {step2 ? (
          <Nav.Link as={Link} to='/shipping'>
            Shipping
          </Nav.Link>
        ) : (
          <Nav.Link disabled>Shipping</Nav.Link>
        )}
      </Nav.Item>
      <FaAngleRight />
      <Nav.Item as='div'>
        {step3 ? (
          <Nav.Link as={Link} to='/placeorder'>
            Place Order
          </Nav.Link>
        ) : (
          <Nav.Link disabled>Place Order</Nav.Link>
        )}
      </Nav.Item>
    </Nav>
  );
};

export default CheckoutSteps;
