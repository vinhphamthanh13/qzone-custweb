import React from 'react';
import { matchType } from 'types/global';
import Booking from './booking/Booking';

const BookingPage = (props) => {
  const { match: { params: { id } } } = props;
  return (
    <Booking serviceId={id} />
  );
};

BookingPage.propTypes = {
  match: matchType.isRequired,
};

export default BookingPage;
