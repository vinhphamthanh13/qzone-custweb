import React from 'react';
import { connect } from 'react-redux';

class ErrorModal extends React.Component {
  state = {
    error: false,
  };

  render() {
    return (<div>{this.state.error}</div>);
  }
}

export default connect(null, null)(ErrorModal);
