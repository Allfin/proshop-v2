import { useEffect, useState } from 'react';
import { Form, Button, InputGroup } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import FormContainer from '../components/FormContainer';
import CheckoutSteps from '../components/CheckoutSteps';
import { saveShippingDetails } from '../slices/cartSlice';
import {
  useGetCityQuery,
  useGetCostMutation,
  useGetProvinceQuery,
} from '../slices/shippingSlice';
import { formatRupiah } from '../utils/price';

const ShippingScreen = () => {
  const cart = useSelector((state) => state.cart);
  const { shippingDetails } = cart;

  const [formData, setFormData] = useState({
    addres: shippingDetails?.address || '',
    selectedProvince: shippingDetails?.selectedProvince || '',
    selectedCity: shippingDetails?.selectedCity || '',
    recipientName: shippingDetails?.recipientName || '',
    curierNote: shippingDetails?.curierNote || '',
    numberPhone: shippingDetails?.numberPhone || '',
    shippingPrice: shippingDetails?.shippingPrice || '',
  });

  const [deliveryList, setDeliveryList] = useState(null);
  const [validated, setValidated] = useState(false);

  // Get list data province
  const { data: provinceList, isLoading, error } = useGetProvinceQuery();

  // Get list data city by id province
  const { data: cityList, isLoading: cityLoading } = useGetCityQuery(
    formData.selectedProvince
  );

  const [getCost, { isLoading: costLoading }] = useGetCostMutation();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChangeForm = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // if (name === 'selectedCity') {
    //   costDeliveryList();
    // }
  };

  const submitHandler = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
    } else {
      dispatch(
        saveShippingDetails({
          address: formData.address,
          selectedProvince: formData.selectedProvince,
          selectedCity: formData.selectedCity,
          recipientName: formData.recipientName,
          curierNote: formData.curierNote,
          numberPhone: formData.numberPhone,
          shippingPrice: formData.shippingPrice,
        })
      );
      // navigate('/placeorder');
    }
    setValidated(true);
  };

  const costDeliveryList = async () => {
    try {
      const response = await getCost({
        body: {
          origin: '278',
          destination: formData.selectedCity,
          weight: cart.weight,
          courier: 'jne',
        },
      }).unwrap();
      setDeliveryList(response);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // if (formData.selectedCity) {
    //   costDeliveryList();
    // }
  }, []);

  return (
    <FormContainer>
      <CheckoutSteps step1 step2 />
      <h1>Shipping</h1>
      <Form onSubmit={submitHandler} noValidate validated={validated}>
        <Form.Group className='my-2' controlId='validationCustom01'>
          <Form.Label>Nama Penerima</Form.Label>
          <InputGroup hasValidation>
            <Form.Control
              type='text'
              name='recipientName'
              placeholder='Masukan nama penerima'
              value={formData.recipientName}
              required
              onChange={handleChangeForm}
            ></Form.Control>
            <Form.Control.Feedback type='invalid'>
              Masukan Nama Penerima
            </Form.Control.Feedback>
          </InputGroup>
        </Form.Group>

        <Form.Group className='my-2' controlId='numberPhone'>
          <Form.Label>Nomor Hp</Form.Label>
          <Form.Control
            type='text'
            name='numberPhone'
            placeholder='Enter numberPhone'
            value={formData.numberPhone}
            required
            onChange={handleChangeForm}
          ></Form.Control>
          <Form.Control.Feedback type='invalid'>
            Masukan Nomor Telepon
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className='my-2' controlId='province'>
          <Form.Label>Provinsi</Form.Label>
          <Form.Select
            aria-label='Default select example'
            onChange={handleChangeForm}
            name='selectedProvince'
            value={formData.selectedProvince}
            required
          >
            <option value='' disabled>
              Open this select menu
            </option>
            {isLoading ? (
              <option disabled>Loading...</option>
            ) : (
              provinceList?.map((provinceData) => (
                <option
                  key={provinceData.province_id}
                  value={provinceData.province_id}
                >
                  {provinceData.province}
                </option>
              ))
            )}
          </Form.Select>
          <Form.Control.Feedback type='invalid'>
            Pilih Provinsi Tujuan
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className='my-2' controlId='City'>
          <Form.Label>Kota</Form.Label>
          <Form.Select
            aria-label='Default select example'
            name='selectedCity'
            required
            onChange={handleChangeForm}
            value={formData.selectedCity}
          >
            <option value='' disabled>
              Open this select menu
            </option>
            {!cityList ? (
              <option disabled>Pilih provinsi terlebih dahulu...</option>
            ) : cityLoading ? (
              <option disabled>Loading...</option>
            ) : (
              cityList.map((cityData) => (
                <option key={cityData.city_id} value={cityData.city_id}>
                  {cityData.city_name}
                </option>
              ))
            )}
          </Form.Select>
          <Form.Control.Feedback type='invalid'>
            Pilih Kota Tujuan
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className='my-2' controlId='address'>
          <Form.Label>Alamat Lengkap</Form.Label>
          <Form.Control
            type='text'
            name='address'
            placeholder='masukan alamat lengkap'
            value={formData.address}
            required
            onChange={handleChangeForm}
          ></Form.Control>
          <Form.Control.Feedback type='invalid'>
            Masukan Alamat Lengkap
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className='my-2' controlId='curierNote'>
          <Form.Label>Catatan Untuk Kuri (Opsional)</Form.Label>
          <Form.Control
            type='text'
            name='curierNote'
            placeholder='Catatan untuk kurir'
            value={formData.curierNote}
            onChange={handleChangeForm}
          ></Form.Control>
        </Form.Group>

        <Form.Group className='my-2' controlId='City'>
          <Form.Label>Pilih Pengiriman</Form.Label>
          <Form.Select
            aria-label='Default select example'
            name='shippingPrice'
            required
            onChange={handleChangeForm}
            value={formData.shippingPrice}
          >
            <option value='' disabled>
              Open this select menu
            </option>
            {!deliveryList ? (
              <option disabled>Pilih provinsi terlebih dahulu...</option>
            ) : costLoading ? (
              <option disabled>Loading...</option>
            ) : (
              deliveryList.map((delivery) => (
                <optgroup label={delivery.description}>
                  {delivery.cost.map((cost) => (
                    <option value={cost.value}>{`${formatRupiah(
                      cost.value
                    )} / ${cost.etd} hari`}</option>
                  ))}
                </optgroup>
              ))
            )}
          </Form.Select>
          <Form.Control.Feedback type='invalid'>
            Pilih Kota Tujuan
          </Form.Control.Feedback>
        </Form.Group>

        <Button type='submit' variant='success'>
          Lanjutkan
        </Button>
      </Form>
    </FormContainer>
  );
};

export default ShippingScreen;
