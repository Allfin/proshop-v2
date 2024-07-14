export const formatRupiah = (num) => {
  return (
    'Rp' +
    (Math.round(num * 100) / 100).toLocaleString('id-ID', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  );
};
