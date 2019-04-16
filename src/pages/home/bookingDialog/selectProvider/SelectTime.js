import React from 'react';
import {
  func,
  number, arrayOf, shape,
  objectOf, any,
} from 'prop-types';
import { connect } from 'react-redux';
import { Typography, Button } from '@material-ui/core';
import moment from 'moment';
import uuidv1 from 'uuid/v1';
import { get, chunk, noop } from 'lodash';
import s from './SelectTime.module.scss';

export class SelectTime extends React.PureComponent {
  state = {
    cachedSpecialSlots: null,
    specialId: null,
  };

  componentDidMount() {
    const { fetchSlot, providerDetail } = this.props;
    const specialId = get(providerDetail, 'id');
    fetchSlot(specialId);
    this.setState({ specialId });
  }

  componentWillReceiveProps(nextProps) {
    const { specialSlots } = nextProps;
    this.setState({ cachedSpecialSlots: specialSlots });
  }

  onHourChange = ({ start, duration }) => (event) => {
    event.preventDefault();
    this.props.onChange({
      start: start.valueOf(),
      duration,
    });
  };

  getHourBoxes = (timeDetails) => {
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
    return chunk(timeBoxes.filter(slot => slot.duration > 0), 3);
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
    const { cachedSpecialSlots, specialId } = this.state;
    const timeDetails = get(cachedSpecialSlots, `${specialId}`);
    const hourBoxes = (timeDetails && this.getHourBoxes(timeDetails)) || [];
    return hourBoxes.length > 0 ? this.renderTimeBox(hourBoxes) : (
      <div className={s.noneSlot}>
        <Typography variant="subheading" color="inherit">
          There is no slot available from our provider! Please find more in the next day!
        </Typography>
      </div>
    );
  }
}

SelectTime.propTypes = {
  specialSlots: arrayOf(
    shape({
      startSec: number,
      durationSec: number,
      spotsOpen: number,
    }),
  ),
  onChange: func.isRequired,
  fetchSlot: func.isRequired,
  providerDetail: objectOf(any),
};

SelectTime.defaultProps = {
  specialSlots: [],
  providerDetail: {},
};

const mapStateToProps = (states, ownProps) => ({
  isLoading: states.homeModules.bookingDialog.isLoading,
  timeDetails: states.homeModules.bookingDialogModules.selectProvider.providerDetails[ownProps.providerDetail.id],
  specialSlots: states.specialSlots.specialSlots,
});

export default connect(mapStateToProps)(SelectTime);
