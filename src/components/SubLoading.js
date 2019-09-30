import React from 'react';
import { bool } from 'prop-types';
import { BeatLoader } from 'react-spinners';
import { lightGrayColor } from './material-dashboard-pro-react';


const SubLoading = (props) => {
  const { loading } = props;
  return loading ? (
    <div className="cover-bg-black">
      <BeatLoader color={lightGrayColor} size={20} margin="3px" />
    </div>
  ) : null;
};

SubLoading.propTypes = {
  loading: bool.isRequired,
};

export default SubLoading;
