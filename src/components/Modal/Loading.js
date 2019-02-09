import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import withStyles from '@material-ui/core/styles/withStyles';
import { PropagateLoader } from 'react-spinners';
import findValueByKey from 'utils/findValueByKey';
import { lightGrayColor } from '../material-dashboard-pro-react';
import ModalStyle from './ModalStyle';


const Loading = (props) => {
  const { classes, loading } = props;
  return loading ? (
    <div className={classes.cover}>
      <PropagateLoader color={lightGrayColor} size={38} />
    </div>
  ) : null;
};

Loading.propTypes = {
  loading: PropTypes.bool.isRequired,
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
};

const mapStateToProps = (state) => {
  const loading = [];
  findValueByKey(state, 'isLoading', loading);
  return ({
    loading: loading.reduce((final, current) => (final || current), false),
  });
};

export default compose(
  connect(mapStateToProps),
  withStyles(ModalStyle),
)(Loading);
