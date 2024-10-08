// function addRupiah(num) {
//   return (Math.round(num * 100) / 100).toLocaleString('id-ID', {
//     minimumFractionDigits: 2,
//     maximumFractionDigits: 2,
//   });
// }

// NOTE: the code below has been changed from the course code to fix an issue
// with type coercion of strings to numbers.
// Our addRupiah function expects a number and returns a string, so it is not
// correct to call it passing a string as the argument.

export function calcPrices(orderItems) {
  // Calculate the items price in whole number (pennies) to avoid issues with
  // floating point number calculations
  const itemsPrice = orderItems.reduce(
    (acc, item) => acc + (item.price * 100 * item.qty) / 100,
    0
  );

  // Calculate the shipping price
  const shippingPrice = itemsPrice > 100 ? 0 : 10;

  // Calculate the total price
  const totalPrice = itemsPrice + shippingPrice;

  // return prices as strings fixed to 2 decimal places
  return {
    itemsPrice,
    shippingPrice,
    totalPrice,
  };
}

export function calcShippingCost(orderItems) {
  // Calculate the items price in whole number (pennies) to avoid issues with
  // floating point number calculations
  const itemsPrice = orderItems.reduce(
    (acc, item) => acc + (item.weight * 100 * item.qty) / 100,
    0
  );

  return itemsPrice;
}
