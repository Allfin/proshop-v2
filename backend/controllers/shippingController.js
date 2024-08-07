import asyncHandler from '../middleware/asyncHandler.js';
const url = 'https://api.rajaongkir.com/starter';

// @desc get province
// @route   GET /api/shipping/province
// @access  Private
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

// @desc get city by id
// @route   GET /api/shipping/city/:id
// @access  Private
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

// @desc get cost shipping
// @route   POST /api/shipping/cost
// @access  Private
const getCost = asyncHandler(async (req, res) => {
  const { origin, destination, weight, courier } = req.body;
  try {
    const response = await fetch(`${url}/cost`, {
      method: 'POST',
      headers: {
        key: process.env.KEY_ONGKIR,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        origin,
        destination,
        weight,
        courier,
      }),
    });
    const data = await response.json();
    res.json(data.rajaongkir.results[0].costs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export { getProvince, getCity, getCost };
