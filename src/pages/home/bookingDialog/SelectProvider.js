import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Typography } from '@material-ui/core';
import {
  providerType, serviceType, bookingDetailType, providerDetailsType,
} from 'types/global';
import RateStar from 'components/Rating/RateStar';
import { getProvidersByService } from 'reduxModules/home/bookingDialog/selectProvider.actions';
import EmptyItem from 'components/EmptyItem';
import ProviderContent from './selectProvider/ProviderContent';
// import styles from './SelectProvider.module.scss';
import DateSelect from './selectProvider/DateSelect';

class SelectProvider extends React.PureComponent {
  componentDidMount = () => {
    const { providers, getProvidersByServiceAction, initService } = this.props;

    if (providers.length === 0) {
      getProvidersByServiceAction(initService.id);
    }
  };

  onSelectBooking = provider => (time) => {
    this.props.onChange(provider, 'provider');
    this.props.onChange(time, 'time', this.props.handleNext);
  };

  render() {
    const {
      isLoading, providers, bookingDetail, initService, providerDetails,
      onChange,
    } = this.props;
    console.log('initservie', initService);
    return (
      <>
        {!isLoading && providers.length === 0 ? <EmptyItem message="No available providers" />
          : (
            <div className="selectProviderWrapper">
              <div className="selectProviderHeader">
                <div>
                  <Typography color="textSecondary" variant="title">
                    {initService.name}
                  </Typography>
                  <div className="selectedProviderReputation">
                    <RateStar rating={initService.rating} reviews={initService.viewNum} />
                  </div>
                </div>
                <DateSelect
                  bookingDetail={bookingDetail}
                  onChange={onChange}
                  providers={providers}
                  initServiceId={initService ? initService.id : -1}
                />
              </div>
              <div className="selectProvider">
                <div className="selectProviderContent">
                  <div className="calendarTimeWrapper">
                    <div className="calendarTime">
                      {Array.from({ length: 24 }, (number, index) => {
                        const roundTime = index < 10 ? `0${index}` : index;
                        const halfTime = `${roundTime}:30`;
                        return (
                          <>
                            <li className="dayTime">
                              <div className="startTime">
                                <Typography variant="body1" color="inherit">
                                  {`${roundTime}:00`}
                                </Typography>
                              </div>
                              <div className="midTime">
                                <Typography variant="caption" color="inherit">
                                  {halfTime}
                                </Typography>
                              </div>
                            </li>
                          </>
                        );
                      })}
                    </div>
                  </div>
                  <div className="selectProviderList">
                    {providers.map(provider => (
                      <div key={provider.id}>
                        <ProviderContent
                          initService={initService}
                          provider={provider}
                          bookingDetail={bookingDetail}
                          duration={providerDetails[provider.id] ? providerDetails[provider.id][0].durationSec : 0}
                          onTimeSelect={this.onSelectBooking(provider)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>)
        }
      </>
    );
  }
}

SelectProvider.propTypes = {
  initService: serviceType,
  providers: PropTypes.arrayOf(providerType).isRequired,
  providerDetails: PropTypes.shape({
    [PropTypes.string]: providerDetailsType,
  }).isRequired,
  isLoading: PropTypes.bool.isRequired,
  getProvidersByServiceAction: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  bookingDetail: bookingDetailType.isRequired,
  handleNext: PropTypes.func.isRequired,
};

SelectProvider.defaultProps = {
  initService: undefined,
};

const mapStateToProps = state => ({
  ...state.homeModules.bookingDialogModules.selectProvider,
});

export default connect(mapStateToProps, { getProvidersByServiceAction: getProvidersByService })(SelectProvider);
