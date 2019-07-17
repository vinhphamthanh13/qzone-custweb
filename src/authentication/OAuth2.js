import React, { Component } from 'react';
import { objectOf, any, func } from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { setFBTokenAction } from 'authentication/actions/login';
import { setError } from 'actionsReducers/common.actions';

class OAuth2 extends Component {
  static propTypes = {
    location: objectOf(any).isRequired,
    setFBTokenAction: func.isRequired,
    setError: func.isRequired,
  };

  getUrlParameter = (name) => {
    const nameUrl = name.replace(/[[]/, '\\[').replace(/[\]]/, '\\]');
    const regex = new RegExp(`[?&]${nameUrl}=([^&#]*)`);

    const results = regex.exec(this.props.location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
  };

  render() {
    const {
      setFBTokenAction: setFBToken,
      setError: setErrorAction,
    } = this.props;
    const token = this.getUrlParameter('token');
    const error = this.getUrlParameter('error');
    console.log('error', error);

    if (token) {
      setFBToken(token);
    }

    if (error) {
      setErrorAction(error);
    }

    return (
      <Redirect to={{
        pathname: '/',
        state: { from: this.props.location },
      }}
      />
    );
  }
}

export default connect(null, {
  setFBTokenAction,
  setError,
})(OAuth2);
