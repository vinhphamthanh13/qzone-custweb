import React from 'react';
import { matchType } from 'types/global';
import OrgPage from './organization/Organization';

const Organization = (props) => {
  const { match: { params: { id } } } = props;
  return (
    <OrgPage id={id} />
  );
};

Organization.propTypes = {
  match: matchType.isRequired,
};

export default Organization;
