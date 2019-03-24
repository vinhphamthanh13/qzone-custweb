import React, { Component } from 'react';
import s from './Provider.module.scss';

class Provider extends Component {
  state = {
    isLoading: false,
  };

  render() {
    const { isLoading } = this.state;

    return (
      <div className={s.providerPage}>
        {!isLoading && <div>Provider Name with</div>}
      </div>
    );
  }
}

Provider.propTypes = {
};

export default Provider;
