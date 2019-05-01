import React from 'react';
import { bool } from 'prop-types';
import { HashLoader } from 'react-spinners';
import { lightGrayColor } from './material-dashboard-pro-react';


const SubLoading = (props) => {
  const { loading } = props;
  return loading ? (
    <div className="cover-bg-black">
      <HashLoader color={lightGrayColor} size={50} />
    </div>
  ) : null;
};

SubLoading.propTypes = {
  loading: bool.isRequired,
};

export default SubLoading;
