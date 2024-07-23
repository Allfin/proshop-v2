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
  }),
});

export const { useGetProvinceQuery } = shippingSlice;
