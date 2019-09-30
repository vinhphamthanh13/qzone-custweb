import React, { Component } from 'react';
import { func, arrayOf, any, objectOf, string } from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import { get } from 'lodash';
import { IconButton } from '@material-ui/core';
import { Clear } from '@material-ui/icons';
import { rescheduleProps } from 'pages/commonProps';
import Loading from 'components/Loading';
import Error from 'components/Error';
import Success from 'components/Success';
import { DEFAULT_TIME, TIME_FORMAT } from 'utils/constants';
import CustomModal from 'components/Modal/CustomModal';
import TemporaryService from '../provider/TemporaryService';
import s from './Reschedule.module.scss';

class Reschedule extends Component {
  static propTypes = {
    eventId: string.isRequired,
    authHeaders: objectOf(any).isRequired,
    timeSlots: arrayOf(any).isRequired,
    onClose: func.isRequired,
    dispatchSetEventById: func.isRequired,
    dispatchRescheduleEvent: func.isRequired,
    dispatchRescheduleStatus: func.isRequired,
  };

  state = {
    rescheduleStatus: 500,
    isRescheduleConfirm: false,
    selectedRescheduleSlot: {},
  };

  static getDerivedStateFromProps(props, state) {
    const { rescheduleStatus } = props;
    const { rescheduleStatus: cachedRescheduleStatus } = state;
    const updatedState = {};
    if (rescheduleStatus !== cachedRescheduleStatus) {
      updatedState.rescheduleStatus = rescheduleStatus;
    }

    return Object.keys(updatedState) ? updatedState : null;
  }

  componentDidUpdate(prevProps) {
    const { rescheduleStatus } = prevProps;
    const { dispatchRescheduleStatus, eventId, dispatchSetEventById } = this.props;
    const { rescheduleStatus: cachedRescheduleStatus } = this.state;
    if (rescheduleStatus !== cachedRescheduleStatus && cachedRescheduleStatus === 200) {
      dispatchSetEventById(eventId);
      dispatchRescheduleStatus(500);
    }
  }

  toggleRescheduleConfirmation = slot => () => {
    this.setState(oldState => ({
      isRescheduleConfirm: !oldState.isRescheduleConfirm,
      selectedRescheduleSlot: slot,
    }));
  };

  handleRescheduleSuccess = () => {
    const { onClose } = this.props;
    this.toggleRescheduleConfirmation({})();
    onClose();
  };

  handleRescheduleEvent = () => {
    const { dispatchRescheduleEvent, eventId, authHeaders } = this.props;
    const { selectedRescheduleSlot } = this.state;
    const newAvailabilityId = get(selectedRescheduleSlot, 'id');
    const rescheduledData = { eventId, newAvailabilityId };
    dispatchRescheduleEvent(rescheduledData, authHeaders);
  };

  render() {
    const { onClose, timeSlots } = this.props;
    const transformedSlots = timeSlots.filter(slot => slot.spotsOpen !== 0);
    const { isRescheduleConfirm, selectedRescheduleSlot } = this.state;
    const rescheduledTime = get(selectedRescheduleSlot, 'providerStartSec', DEFAULT_TIME);

    return (
      <>
        <Loading />
        <Error />
        <Success success userCallback={this.handleRescheduleSuccess} />
        <CustomModal
          type="info"
          title="Reschedule confirmation"
          message={
            `Are you sure to reschedule this event to other slot at '${moment(rescheduledTime).format(TIME_FORMAT)}'`
          }
          isOpen={isRescheduleConfirm}
          cancelCallBack={this.toggleRescheduleConfirmation({})}
          okCallBack={this.handleRescheduleEvent}
        />
        <div className={s.container}>
          <div className={s.rescheduledSlot}>
            <div className={s.heading}>
              <div className={s.title}>
                Rescheduled Slots
              </div>
              <div className={s.cta}>
                <IconButton onClick={onClose}>
                  <Clear className='icon-big danger-color bg-we-peep bg-round' />
                </IconButton>
              </div>
            </div>
            <TemporaryService selectSlot={this.toggleRescheduleConfirmation} timeSlots={transformedSlots} />
          </div>
        </div>
      </>
    );
  }
}

export default connect(
  rescheduleProps.mapStateToProps,
  rescheduleProps.mapDispatchToProps,
)(Reschedule);
