import React from 'react';
import { connect } from 'react-redux';
import { Typography, Button } from '@material-ui/core';
import moment from 'moment';
import uuidv1 from 'uuid/v1';
import {
  func, number, arrayOf, shape,
} from 'prop-types';
import { get, chunk, noop } from 'lodash';
import s from './SelectTime.module.scss';

export class SelectTime extends React.PureComponent {
  static getDerivedStateFromProps(nextProps) {
    return nextProps.bookingDetail.provider && nextProps.providerDetail.id === nextProps.bookingDetail.provider.id
      && nextProps.bookingDetail.time
      ? {}
      : { selectedHour: null };
  }

  onHourChange = ({ start, duration }) => (event) => {
    event.preventDefault();
    this.props.onChange({
      start: start.valueOf(),
      duration,
    });
  };

  getHourBoxes = (timeDetails) => {
    console.log('timeDetails', timeDetails);
    const timeBoxes = timeDetails
      .filter(slot => !!slot.spotsOpen && moment.now() < slot.startSec * 1000)
      .sort((a, b) => a.startSec - b.startSec).map((bookedSlot) => {
        const time = get(bookedSlot, 'startSec') * 1000;
        const duration = get(bookedSlot, 'durationSec');
        const action = bookedSlot.spotsOpen
          ? this.onHourChange({ start: time, duration }) : noop;
        return ({
          key: uuidv1(),
          time,
          canBook: !!bookedSlot.spotsOpen,
          duration,
          action,
          display: moment(time).format('hh:mm a'),
        });
      });
    return chunk(timeBoxes.filter(slot => slot.duration > 0), 4);
  };

  renderTimeBox = list => list.map(row => (
    <div key={uuidv1()} className={s.timeRow}>
      {row.map((slot) => {
        const { display, action } = slot;
        return (
          <Button
            key={uuidv1()}
            className={s.timeSlot}
            onClick={action}
          >
            <Typography variant="subheading" color="inherit">
              {display}
            </Typography>
          </Button>
        );
      })}
    </div>
  ));

  render() {
    const {
      timeDetails,
    } = this.props;
    const hourBoxes = this.getHourBoxes(timeDetails);
    console.log('hourboxes', hourBoxes);
    return this.renderTimeBox(hourBoxes);
  }
}

SelectTime.propTypes = {
  timeDetails: arrayOf(
    shape({
      startSec: number,
      durationSec: number,
      spotsOpen: number,
    }),
  ),
  onChange: func.isRequired,
};

SelectTime.defaultProps = {
  timeDetails: [],
};

const mapStateToProps = (states, ownProps) => ({
  isLoading: states.homeModules.bookingDialog.isLoading,
  timeDetails: states.homeModules.bookingDialogModules.selectProvider.providerDetails[ownProps.providerDetail.id],
});

export default connect(mapStateToProps)(SelectTime);
