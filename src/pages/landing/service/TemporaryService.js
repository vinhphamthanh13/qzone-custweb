import React, { Component } from 'react';
import { func } from 'prop-types';
import { chunk } from 'lodash';
import uuidv1 from 'uuid/v1';
import moment from 'moment';
import s from './TemporaryService.module.scss';

class TemporaryService extends Component {
  static propTypes = {
    selectSlot: func.isRequired,
  };

  static defaultProps = {
  };

  state = {
    timeSlots: [],
  };

  static getDerivedStateFromProps(props) {
    const { timeSlots } = props;
    const updatedState = {};

    if (timeSlots.length > 0) {
      updatedState.timeSlots = timeSlots;
    }

    return Object.keys(updatedState) ? updatedState : null;
  }

  render() {
    const { selectSlot } = this.props;
    const { timeSlots } = this.state;
    const slotsByDate = {};
    timeSlots.map(slot => {
      const date = slot.providerStartSec.replace(/\s.*/, '');
      slotsByDate[date] = slotsByDate[date] ? slotsByDate[date] : [];
      slotsByDate[date].push(slot);
      return null;
    });
    return (
      <div className={s.container}>
        {Object.keys(slotsByDate).map(date => (
          <div key={uuidv1()}>
            <div className={s.date}>
              {moment(date).format('dddd, DD MMM YYYY')}
            </div>
            <div>
              {chunk(slotsByDate[date], 3).map(chunkRow => (
                <div className={s.row} key={uuidv1()}>
                  {chunkRow.map(slot => (
                    /* eslint-disable-next-line */
                    <div className={s.slot} key={slot.id} onClick={selectSlot(slot)}>
                      {moment(slot.providerStartSec).format('HH:mm A')}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }
}

export default TemporaryService;
