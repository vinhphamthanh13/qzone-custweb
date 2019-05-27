import React, { Component } from 'react';
import { func } from 'prop-types';
import {
  IconButton,
  Typography,
} from '@material-ui/core';
import { Cancel } from '@material-ui/icons';
import uuidv1 from 'uuid/v1';
import moment from 'moment';
import {
  dateFormatDash,
  timeSlotFormat,
} from 'utils/constants';
import EmptyItem from 'components/EmptyItem';
import s from './TrackingEvents.module.scss';

class TrackingEvents extends Component {
  static propTypes = {
    onClose: func.isRequired,
  };

  static getDerivedStateFromProps(props, state) {
    const {
      trackingList,
    } = props;
    const {
      trackingList: cachedTrackingList,
    } = state;
    if (trackingList !== cachedTrackingList) {
      return {
        trackingList,
      };
    }
    return null;
  }

  state = {
    trackingList: null,
  };

  render() {
    const {
      onClose,
    } = this.props;
    const {
      trackingList,
    } = this.state;

    return (
      <div className={s.trackingList}>
        <div className={s.trackingContent}>
          <div className={s.trackingTitle}>
            <Typography variant="title" color="inherit" className="text-bold">
              Tracking Events
            </Typography>
            <IconButton onClick={onClose}>
              <Cancel color="inherit" className="icon-big" />
            </IconButton>
          </div>
          {trackingList && trackingList.length ? trackingList.sort((a, b) => a.checkedInTime - b.checkedInTime)
            .map(item => (
              <div key={uuidv1()} className={s.trackingItem}>
                <div className={s.trackingItemTitle}>
                  <Typography variant="subheading" color="inherit" className="text-bold">
                    {item.serviceName}
                  </Typography>
                </div>
                <div className={s.trackingItemContent}>
                  <div className={s.itemSchedule}>
                    <Typography variant="body1" color="inherit">
                      Start:
                    </Typography>
                    <Typography variant="body1" color="inherit">
                      {moment(item.checkedInTime * 1000).format(`${dateFormatDash} - ${timeSlotFormat}`)}
                    </Typography>
                  </div>
                  <div className={s.itemSchedule}>
                    <Typography variant="body1" color="inherit">
                      End:
                    </Typography>
                    <Typography variant="body1" color="inherit">
                      {moment(item.completedTime * 1000).format(`${dateFormatDash} - ${timeSlotFormat}`)}
                    </Typography>
                  </div>
                  <div className={s.itemSchedule}>
                    <Typography variant="body1" color="inherit">
                      Confirmed:
                    </Typography>
                    <Typography variant="body1" color="inherit">
                      {moment(item.confirmedTime * 1000).format(`${dateFormatDash} - ${timeSlotFormat}`)}
                    </Typography>
                  </div>
                  <div className={s.trackingItemStatus}>
                    <Typography variant="subheading" className="text-bold">
                      Status: {item.status}
                    </Typography>
                  </div>
                </div>
              </div>)) : <EmptyItem message="You have no event for tracking at the moment!" />
          }
        </div>
      </div>
    );
  }
}

export default TrackingEvents;
