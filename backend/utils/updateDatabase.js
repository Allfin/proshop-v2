import Order from '../models/orderModel.js';

export const updatePayment = async (order_id) => {
  try {
    // Mencari order berdasarkan ID
    const order = await Order.findById(order_id);

    if (!order) {
      console.log('Order not found');
      return;
    }

    // Mengubah status pembayaran
    order.isPaid = true;

    // Menyimpan perubahan ke database
    const updatedOrder = await order.save();
    console.log('Order updated successfully:', updatedOrder);
    // Lakukan tindakan lain setelah berhasil menyimpan perubahan
  } catch (error) {
    console.error('Error updating order:', error);
    // Tangani error jika gagal menyimpan perubahan
  }
};
