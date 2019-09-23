import React, { Component } from 'react';
import { chunk } from 'lodash';
import uuidv1 from 'uuid/v1';
import moment from 'moment';
import s from './TemporaryService.module.scss';

class TemporaryService extends Component {
    static propTypes = {
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
      const { timeSlots } = this.state;
      return (
        <div className={s.container}>
          {timeSlots.length > 0 && chunk(timeSlots, 3).map(chunkRow => (
            <div className={s.row} key={uuidv1()}>
              {chunkRow.map(slot => (
                <div className={s.slot} key={slot.id}>
                  {moment(slot.providerStartSec).format('HH:mm A')}
                </div>
              ))}
            </div>
          ))}
        </div>
      );
    }
}

export default TemporaryService;
