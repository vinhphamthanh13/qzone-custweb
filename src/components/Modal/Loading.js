import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import withStyles from '@material-ui/core/styles/withStyles';
import { PropagateLoader } from 'react-spinners';
import findValueByKey from 'utils/findValueByKey';
import { mainColor } from '../material-dashboard-pro-react';
import ModalStyle from './ModalStyle';


const Loading = (props) => {
  const { classes, loading } = props;
  return loading ? (
    <div className={classes.cover}>
      <PropagateLoader color={mainColor} size={40} />
    </div>
  ) : null;
};

Loading.propTypes = {
  loading: PropTypes.bool.isRequired,
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
};
//
// const mapStateToProps = state => ({
//   loading: !!Object.keys(state).reduce(
//     (acc, cur) => (acc || state[cur].isLoading), false,
//   ),
// });

const mapStateToProps = (state) => {
  const loading = [];
  console.log('this is state you finding', state);
  findValueByKey(state, 'isLoading', loading);
  console.log('loading', loading);
  console.log('reducer', loading.reduce((final, current) => {
    console.log('final', final);
    console.log('current', current);
    return (final || current);
  }, false));
  return ({
    loading: loading.reduce((final, current) => (final || current), false),
  });
};

export default compose(
  connect(mapStateToProps),
  withStyles(ModalStyle),
)(Loading);
