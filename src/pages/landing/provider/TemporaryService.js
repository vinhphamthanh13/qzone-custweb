import React, { Component } from 'react';
import { func, bool } from 'prop-types';
import chunk from 'lodash/chunk';
import get from 'lodash/get';
import noop from 'lodash/noop';
import uuidv1 from 'uuid/v1';
import moment from 'moment';
import { IconButton } from '@material-ui/core';
import { ExpandMore } from '@material-ui/icons';
import { DATE_LABEL, TIME_FORMAT, NO_ROWS_PER_DATE, NO_SLOTS_PER_ROW } from 'utils/constants';
import s from './TemporaryService.module.scss';

class TemporaryService extends Component {
  static propTypes = {
    selectSlot: func.isRequired,
    onBookNow: func,
    searchable: bool,
  };

  static defaultProps = {
    onBookNow: noop,
    searchable: false,
  };

  state = {
    chunkIndex: {},
    dateSelected: {},
    slotsByDate: {},
    transformedSlot: {},
    chunkTransformedIndex: 0,
    chunkedTransformedSlot: [],
    bookNowSlot: {},
    bookNowId: '',
  };

  static getDerivedStateFromProps(props, state) {
    const { timeSlots, onBookNow } = props;
    const { timeSlots: cachedTimeSlots } = state;
    const updatedState = {};

    if (
      timeSlots.length &&
      JSON.stringify(timeSlots) !== JSON.stringify(cachedTimeSlots))
    {
      updatedState.timeSlots = timeSlots;
      const bookNowSlot = get(timeSlots, '0');
      updatedState.bookNowSlot = bookNowSlot;
      const serviceId = get(bookNowSlot, 'serviceId');
      const providerId = get(bookNowSlot, 'providerId');
      const locationId = get(bookNowSlot, 'locationId');
      const bookNowId = `${serviceId}-${providerId}-${locationId}`;
      updatedState.bookNowId = bookNowId;
      const slotsByDate = {};
      timeSlots.map(slot => {
        const date = slot.providerStartSec.replace(/\s.*/, '');
        slotsByDate[date] = slotsByDate[date] ? slotsByDate[date] : [];
        slotsByDate[date].push(slot);
        return null;
      });
      const transformedSlot = {};
      Object.keys(slotsByDate).map(date => {
        const chunkSlots = chunk(slotsByDate[date], NO_SLOTS_PER_ROW);
        transformedSlot[date] = chunk(chunkSlots, NO_ROWS_PER_DATE);
        transformedSlot[`${date}-max`] = transformedSlot[date].length - 1;
        return null;
      });
      const chunkedTransformedSlot = chunk(Object.keys(transformedSlot), 4) || [];
      updatedState.dateSelected = {
        [chunkedTransformedSlot[0][0]]: true,
      };
      updatedState.slotsByDate = slotsByDate;
      updatedState.transformedSlot = transformedSlot;
      updatedState.chunkedTransformedSlot = chunkedTransformedSlot;
      updatedState.maxDateChunk = chunkedTransformedSlot.length - 1;
      onBookNow({ [bookNowId]: bookNowSlot });
    }

    return Object.keys(updatedState) ? updatedState : null;
  }

  handleChunkIndexMore = (date, max)  => () => {
    const { chunkIndex } = this.state;
    const index = chunkIndex[`${date}-index`] || 0;
    this.setState(oldState => ({
      chunkIndex: {
        ...oldState.chunkIndex,
        [`${date}-index`]: index < max ? index + 1 : max,
      }
    }));
  };

  handleChunkIndexLess = date  => () => {
    const { chunkIndex } = this.state;
    const index = chunkIndex[`${date}-index`] || 0;

    this.setState(oldState => ({
      chunkIndex: {
        ...oldState.chunkIndex,
        [`${date}-index`]: index > 0 ? index - 1 : 0,
      }
    }));
  };

  handleSelectedDate = date => () => {
    this.setState(oldState => ({
      dateSelected: {
        [date]: !oldState.dateSelected[date],
      },
    }));
  };

  handleMoreChunkDate = () => {
    const { chunkedTransformedSlot } = this.state;
    const maxChunk = chunkedTransformedSlot.length - 1;
    this.setState(oldState => ({
      dateSelected: {
        [chunkedTransformedSlot[oldState.chunkTransformedIndex + 1][0]]: true,
      },
      chunkTransformedIndex: oldState.chunkTransformedIndex === maxChunk ?
        maxChunk : oldState.chunkTransformedIndex + 1,
    }));
  };

  handleLessChunkDate = () => {
    const { chunkedTransformedSlot } = this.state;
    this.setState(oldState => ({
      dateSelected: {
        [chunkedTransformedSlot[oldState.chunkTransformedIndex - 1][0]]: true,
      },
      chunkTransformedIndex: oldState.chunkTransformedIndex === 0 ?
        0 : oldState.chunkTransformedIndex - 1,
    }));
  };

  render() {
    const { selectSlot, searchable } = this.props;
    const {
      slotsByDate, transformedSlot, chunkIndex, dateSelected, chunkedTransformedSlot, chunkTransformedIndex,
      maxDateChunk,
    } = this.state;
    const isDefaultExpand = Object.keys(slotsByDate).length === 1;
    const disableMinDateChunkCta = chunkTransformedIndex === 0;
    const disableMaxDateChunkCta = chunkTransformedIndex === maxDateChunk || searchable;
    const minDateChunkCtaStyle = disableMinDateChunkCta ? `${s.controlDate} ${s.disabledCta}` : s.controlDate;
    const maxDateChunkCtaStyle = disableMaxDateChunkCta ? `${s.controlDate} ${s.disabledCta}` : s.controlDate;

    return (
      <div className={s.container}>
        <div className={s.moreDateCta}>
          <IconButton
            className={`${minDateChunkCtaStyle} hover-success`}
            onClick={this.handleLessChunkDate}
            disabled={disableMinDateChunkCta}
          >
            previous date...
          </IconButton>
          <IconButton
            className={`${maxDateChunkCtaStyle} hover-success`}
            onClick={this.handleMoreChunkDate}
            disabled={disableMaxDateChunkCta}
          >
            more date...
          </IconButton>
        </div>
        {chunkedTransformedSlot.length > 0 && chunkedTransformedSlot[!searchable ? chunkTransformedIndex : 0]
          .map(date => {
          const disableMinSlotChunkCta = !chunkIndex[`${date}-index`] || chunkIndex[`${date}-index`] === 0;
          const disableMaxSlotChunkCta = chunkIndex[`${date}-index`] === transformedSlot[`${date}-max`]
            || transformedSlot[`${date}-max`] === 0;
          const minSlotChunkCtaStyle = disableMinSlotChunkCta ? `${s.controlDate} ${s.disabledCta}` : s.controlDate;
          const maxSlotChunkCtaStyle = disableMaxSlotChunkCta ? `${s.controlDate} ${s.disabledCta}` : s.controlDate;
          const expandIconStyle = !dateSelected[date] && !isDefaultExpand ?
            s.expandMore : `${s.expandMore} ${s.expandLess}`;
          const dateStyle = (dateSelected[date] || isDefaultExpand) ? `${s.date} ${s.dateActive}` : s.date;
          return moment(date).isValid() && (
            <div className={s.dateChunk} key={uuidv1()}>
              { /* eslint-disable-next-line */ }
              <div className={dateStyle} onClick={this.handleSelectedDate(date)}>
                <span>{moment(date).format(DATE_LABEL)}</span>
                <IconButton
                  color="inherit"
                  disabled={isDefaultExpand}
                >
                  <ExpandMore className={`icon-small simple-button ${expandIconStyle}`} color="inherit" />
                </IconButton>
              </div>
              {(dateSelected[date] || isDefaultExpand) && (
                <div className={s.chunkSlots}>
                  <div className={s.slotHolder}>
                    {transformedSlot[date][chunkIndex[`${date}-index`] || 0] &&
                    transformedSlot[date][chunkIndex[`${date}-index`] || 0].map(chunkRow => {
                      return (
                        <div className={s.row} key={uuidv1()}>
                          {chunkRow.map(slot => (
                            /* eslint-disable-next-line */
                            <div className={s.slot} key={slot.id} onClick={selectSlot(slot)}>
                              {moment(slot.providerStartSec).format(TIME_FORMAT)}
                            </div>
                          ))}
                        </div>
                      )})
                    }
                  </div>
                  <div className={s.moreSlotCta}>
                    <IconButton
                      className={`${minSlotChunkCtaStyle} hover-success`}
                      disabled={disableMinSlotChunkCta}
                      onClick={this.handleChunkIndexLess(
                        date
                      )}
                    >
                      previous slot...
                    </IconButton>
                    <IconButton
                      className={`${maxSlotChunkCtaStyle} hover-success`}
                      onClick={this.handleChunkIndexMore(
                        date, transformedSlot[`${date}-max`],
                      )}
                      disabled={disableMaxSlotChunkCta}
                    >
                      more slot...
                    </IconButton>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    );
  }
}

export default TemporaryService;
