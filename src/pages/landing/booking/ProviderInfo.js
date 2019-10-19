import React from 'react';
import { objectOf, any } from 'prop-types';
import { DateRange, Email, GpsFixed, PhoneIphone, Place, Schedule } from '@material-ui/icons';
import moment from 'moment';
import { ADDRESS_LENGTH, FULL_DATE, TIME_FORMAT } from 'utils/constants';
import { limitString } from 'utils/common';
import get from 'lodash/get';
import s from './ProviderInfo.module.scss';

const ProviderInfo = ({ provider }) => {
  const sName = get(provider, 'sName');
  const pName = get(provider, 'pName');
  const pPhone = get(provider, 'pPhone');
  const pEmail = get(provider, 'pEmail');
  const pImage = get(provider, 'pImage');
  const pAddress = get(provider, 'pAddress');
  const durationSec = get(provider, 'durationSec');
  const providerStartSec = get(provider, 'providerStartSec');
  const startTime = moment(providerStartSec).format(TIME_FORMAT);
  const endTime = moment(providerStartSec).add(durationSec, 'minutes').format(TIME_FORMAT);
  const timezoneId = get(provider, 'timezoneId');

  return (
    <div className={s.container}>
      <div className={s.details}>
        <div className={s.sName}>{sName}</div>
        <div className={s.content}>
          <div className={s.pImage}>
            <img src={pImage} alt="Q Provider" className={s.blurImage} width="100%" height="100%" />
            <div className={s.duration}>
              Duration: {`${durationSec}'`}
            </div>
          </div>
          <div className={`${s.pName} ellipsis`}>{pName}</div>
          <div className={s.item}>
            <DateRange className="icon-small" color="secondary" />
            {moment(providerStartSec).format(FULL_DATE)}
          </div>
          <div className={s.item}>
            <Schedule className="icon-small" color="secondary" />
            {startTime} - {endTime}
          </div>
          <div className={s.item}><PhoneIphone className="icon-small" color="inherit" />{pPhone}</div>
          <div className={s.item}><Email className="icon-small" color="inherit" />{pEmail}</div>
          <div className={s.place}>
            <Place className="icon-small" />
            <span>&nbsp;{limitString(pAddress, ADDRESS_LENGTH)}</span>
          </div>
          <div className={s.item}><GpsFixed className="icon-small" color="inherit" />{timezoneId}</div>
        </div>
      </div>
    </div>
  );
};

ProviderInfo.propTypes = {
  provider: objectOf(any).isRequired,
};

export default ProviderInfo;
