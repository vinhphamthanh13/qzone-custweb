import React, { PureComponent } from 'react';

export default class AdvancedSearch extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { service: 'service' };
  }

  render() {
    const { service } = this.state;

    return (
      <div>{service}</div>
    );
  }
}
