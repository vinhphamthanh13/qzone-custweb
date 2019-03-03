import React from 'react';
import { bool } from 'prop-types';
import { connect } from 'react-redux';
import { PropagateLoader } from 'react-spinners';
import findValueByKey from 'utils/findValueByKey';
import { lightGrayColor } from './material-dashboard-pro-react';


const Loading = (props) => {
  const { loading } = props;
  return loading ? (
    <div className="cover-bg-black">
      <PropagateLoader color={lightGrayColor} size={38} />
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
