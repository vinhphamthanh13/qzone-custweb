import React from 'react';
import { bool } from 'prop-types';
import { connect } from 'react-redux';
import { BeatLoader } from 'react-spinners';
import findValueByKey from 'utils/findValueByKey';
import { lightGrayColor } from './material-dashboard-pro-react';


const Loading = (props) => {
  const { loading } = props;
  return loading ? (
    <div className="cover-bg-black z-index-highest">
      <BeatLoader color={lightGrayColor} size={20} margin="3px" />
    </div>
  ) : null;
};

Loading.propTypes = {
  loading: bool.isRequired,
};

const mapStateToProps = (state) => {
  const loading = [];
  findValueByKey(state, 'isLoading', loading);
  return ({
    loading: loading.reduce((final, current) => (final || current), false),
  });
};

export default connect(mapStateToProps)(Loading);
