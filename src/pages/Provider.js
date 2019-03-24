import React from 'react';
import { matchType } from 'types/global';
import ProviderPage from './provider/Provider';

const Provider = (props) => {
  const { match: { params: { id } } } = props;
  return (
    <ProviderPage id={id} />
  );
};

Provider.propTypes = {
  match: matchType.isRequired,
};

export default Provider;
