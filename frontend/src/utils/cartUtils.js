export const addDecimals = (num) => {
  return Math.round(num * 100) / 100;
};

// NOTE: the code below has been changed from the course code to fix an issue
// with type coercion of strings to numbers.
// Our addDecimals function expects a number and returns a string, so it is not
// correct to call it passing a string as the argument.

export const updateCart = (state, item) => {
  // Calculate the items price in whole number (pennies) to avoid issues with
  // floating point number calculations
  const itemsPrice = state.cartItems.reduce(
    (acc, item) => acc + (item.price * 100 * item.qty) / 100,
    0
  );

  // floating point number calculations
  const weightTotal = state.cartItems.reduce(
    (acc, item) => acc + (item.weight * 100 * item.qty) / 100,
    0
  );

  state.itemsPrice = addDecimals(itemsPrice);

  // Calculate weight products
  state.weight = addDecimals(weightTotal);
  // Calculate the total price

  const qtyTotal = state.cartItems.reduce((total, item) => total + item.qty, 0);

  state.qty = addDecimals(qtyTotal);

  // Save the cart to localStorage
  localStorage.setItem('cart', JSON.stringify(state));

  return state;
};

export const udpateTotalPrice = (state) => {
  state.totalPrice = state.itemsPrice + state.shippingPrice;
  return state;
};
