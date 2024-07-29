import { apiSlice } from './apiSlice';
import { RAJAONGKIR_URL } from '../constants';

export const shippingSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProvince: builder.query({
      query: () => ({
        url: `${RAJAONGKIR_URL}/province`,
      }),
      keepUnusedDataFor: 5,
    }),
    getCity: builder.query({
      query: (id) => ({
        url: `${RAJAONGKIR_URL}/city/${id}`,
      }),
      keepUnusedDataFor: 5,
    }),
    getCost: builder.mutation({
      query: ({ body }) => ({
        method: 'POST',
        url: `${RAJAONGKIR_URL}/cost`,
        body,
      }),
      keepUnusedDataFor: 5,
    }),
  }),
});

export const { useGetProvinceQuery, useGetCityQuery, useGetCostMutation } =
  shippingSlice;
