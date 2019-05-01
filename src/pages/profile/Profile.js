import React, { Component } from 'react';
import {
  func,
  string,
} from 'prop-types';
import { connect } from 'react-redux';
import { get } from 'lodash';
import {
  postUpdatedProfile,
  updateProfileAction,
  storeFireBaseUserAction,
} from 'actionsReducers/profile.actions';
import {
  setServiceProvidersAction,
  findEventByCustomerIdAction,
} from 'actionsReducers/common.actions';
import { history } from 'containers/App';
import CustomModal from 'components/Modal/CustomModal';
import Error from 'components/Error';
import { askForPermissioToReceiveNotifications } from 'utils/pushNotification';
import Header from './components/Header';
import Content from './components/Content';
import s from './Profile.module.scss';

class Profile extends Component {
  static getDerivedStateFromProps(props, state) {
    const {
      userDetail,
      updateProfileStatus,
      firebaseUserStored,
    } = props;
    const {
      userDetail: cachedUserDetail,
      updateProfileStatus: cachedUpdateProfileStatus,
      firebaseUserStored: cachedFirebaseUserStored,
    } = state;
    if (
      userDetail !== cachedUserDetail
    || updateProfileStatus !== cachedUpdateProfileStatus
    || firebaseUserStored !== cachedFirebaseUserStored
    ) {
      return {
        userDetail,
        updateProfileStatus,
        firebaseUserStored,
      };
    }
    return null;
  }

  constructor(props) {
    super(props);
    this.state = {
      userDetail: null,
      firebaseUserStored: null,
      isPopupWarning: '',
    };
  }

  componentDidMount() {
    const {
      setServiceProvidersAction: setServiceProviders,
      findEventByCustomerIdAction: findEventByCustomerId,
      customerId,
    } = this.props;
    setServiceProviders();
    findEventByCustomerId(customerId);
  }

  async componentDidUpdate(prevProps) {
    const { serviceProviders } = prevProps;
    const {
      serviceProviders: updatedServiceProviders,
      storeFireBaseUserAction: storeFireBaseUser,
    } = this.props;
    if (serviceProviders !== updatedServiceProviders) {
      const { userDetail } = this.state;
      const email = get(userDetail, 'email');
      const userToken = await askForPermissioToReceiveNotifications();
      console.log('componentDidUpdate', userToken);
      storeFireBaseUser({
        email,
        userToken,
      });
    }
  }

  handleAccount = (data) => {
    const { postUpdatedProfile: postUpdatedProfileAction } = this.props;
    postUpdatedProfileAction(data);
  };

  resetUpdateProfileStatus = () => {
    const { updateProfileAction: updateProfileStatus } = this.props;
    updateProfileStatus('');
  };

  goBooking = () => {
    history.push('/');
  };

  render() {
    const {
      updateProfileStatus,
    } = this.props;
    const {
      userDetail,
      firebaseUserStored,
      isPopupWarning,
    } = this.state;

    console.log('firebaseuserStore', firebaseUserStored);
    console.log('profile lthislprops', this.props);
    const givenName = get(userDetail, 'givenName');
    const email = get(userDetail, 'email');
    const updateProfileMsgError = isPopupWarning === 'error' ? (
      <CustomModal
        isOpen
        type="error"
        title="Update Profile Error"
        message="Error occurs when updating your profile! Please try again."
        onClose={this.resetUpdateProfileStatus}
      />
    ) : null;

    const updateProfileMsgSuccess = isPopupWarning === 'success' ? (
      <CustomModal
        isOpen
        type="info"
        title="Update Profile Success"
        message="Your profile is up to date"
        onClose={this.resetUpdateProfileStatus}
      />
    ) : null;

    return (
      <>
        {updateProfileMsgError}
        {updateProfileMsgSuccess}
        <Error />
        <div>
          <div className={`${s.profile} column`}>
            <Header userDetail={{ givenName, email }} onClose={this.goBooking} onOpenAccount={this.handleAccount} />
            <div className={`container-max auto-margin-horizontal ${s.contentAfooter}`}>
              <Content
                givenName={givenName}
                onClose={this.goBooking}
                handleAccount={this.handleAccount}
                updateProfileStatus={updateProfileStatus}
              />
            </div>
          </div>
        </div>
      </>
    );
  }
}

Profile.propTypes = {
  customerId: string.isRequired,
  setServiceProvidersAction: func.isRequired,
  storeFireBaseUserAction: func.isRequired,
  postUpdatedProfile: func.isRequired,
  updateProfileStatus: string,
  updateProfileAction: func.isRequired,
  findEventByCustomerIdAction: func.isRequired,
};

Profile.defaultProps = {
  updateProfileStatus: false,
};

const mapStateToProps = state => ({
  ...state.common,
  ...state.auth,
  ...state.profile,
});

export default connect(mapStateToProps, {
  postUpdatedProfile,
  updateProfileAction,
  setServiceProvidersAction,
  findEventByCustomerIdAction,
  storeFireBaseUserAction,
})(Profile);
