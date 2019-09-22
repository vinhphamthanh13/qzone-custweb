import React, { Component } from 'react';
import Service from './Service';
import s from './Services.module.scss';

class Services extends Component {
  static propTypes = {
  };

  static defaultProps = {
  };

  state = {
    catName: '',
    serviceList: [],
  };

  static getDerivedStateFromProps(props, state) {
    const { serviceList, catName } = props;
    const { catName: cachedCatName } = state;

    if (
      serviceList.length ||
      catName !== cachedCatName
    ) {
      return {
        serviceList,
        catName,
      };
    }

    return null;
  }



  render() {
    const { serviceList, catName } = this.state;
    return (
      <div className={s.content}>
        {serviceList.map(service => <Service service={service} catName={catName} />)}
      </div>
    );
  }
}

export default Services;
