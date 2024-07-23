import asyncHandler from '../middleware/asyncHandler.js';

const getProvince = asyncHandler(async (req, res) => {
  try {
    const response = await fetch(
      'https://api.rajaongkir.com/starter/province',
      {
        method: 'GET',
        headers: { key: process.env.KEY_ONGKIR },
      }
    );
    const data = await response.json();
    res.json(data.rajaongkir.results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export { getProvince };
