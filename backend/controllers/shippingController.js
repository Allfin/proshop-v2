import asyncHandler from '../middleware/asyncHandler.js';
const url = 'https://api.rajaongkir.com/starter';

const getProvince = asyncHandler(async (req, res) => {
  try {
    const response = await fetch(`${url}/province`, {
      method: 'GET',
      headers: { key: process.env.KEY_ONGKIR },
    });
    const data = await response.json();
    res.json(data.rajaongkir.results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const getCity = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const response = await fetch(`${url}/city?province=${id}`, {
      method: 'GET',
      headers: { key: process.env.KEY_ONGKIR },
    });
    const data = await response.json();
    res.json(data.rajaongkir.results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export { getProvince, getCity };
