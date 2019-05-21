import React, { Component } from 'react';
import { connect } from 'react-redux';
import { get } from 'lodash';
import { history } from 'containers/App';
import { AUTHENTICATED_KEY, SESSION } from 'utils/constants';

class SessionManagement extends Component {
  static getDerivedStateFromProps(props, state) {
    const { loginSession } = props;
    const { loginSession: cachedLoginSession } = state;
    if (loginSession !== cachedLoginSession) {
      const isAuthenticated = get(loginSession, AUTHENTICATED_KEY);
      if (isAuthenticated) {
        const startSession = get(loginSession, 'start_session');
        const currentTime = new Date().getTime();
        return {
          sessionLiveTime: currentTime - startSession,
        };
      }
    }
    return null;
  }

  state = {
    // eslint-disable-next-line
    loginSession: null,
  };

  componentDidUpdate() {
    const { sessionLiveTime } = this.state;
    if (sessionLiveTime > SESSION.TIMEOUT) {
      history.push('/');
    }
  }

  render() {
    return (<div />);
  }
}

const mapStateToProps = state => ({
  ...state.auth,
});

export default connect(mapStateToProps)(SessionManagement);
