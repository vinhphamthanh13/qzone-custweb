import React, { Component } from 'react';
import { func, objectOf, any } from 'prop-types';
import { connect } from 'react-redux';
import { setEventById } from 'actionsReducers/common.actions';
import { IconButton } from '@material-ui/core';
import Loading from 'components/Loading';
import Error from 'components/Error';
import { history } from 'containers/App';
import Footer from 'pages/components/footer/Footer';
import Logo from 'images/logo.png';
import TimelineCard from './appointmentDialog/TimelineCard';
import s from './ViewEvent.module.scss';

class ViewEvent extends Component {
  static propTypes = {
    setEventById: func.isRequired,
    match: objectOf(any).isRequired,
    eventById: objectOf(any),
  };

  static defaultProps = {
    eventById: null,
  };

  static getDerivedStateFromProps(props, state) {
    const { eventById } = props;
    const { eventById: cachedEventById } = state;

    if (eventById !== cachedEventById) {
      return { eventById };
    }

    return null;
  }

  state = {
    eventById: null,
  };

  componentDidMount() {
    const {
      setEventById: setEventByIdAction,
      match: { params: { id } },
    } = this.props;

    setEventByIdAction(id);
  }

  handleRedirect = () => {
    history.push('/');
  };

  render() {
    const { eventById } = this.state;

    return (
      <>
        <Loading />
        <Error resetOtherStatus={this.handleRedirect} />
        <div className={s.viewEvent}>
          <div className={s.navBar}>
            <IconButton onClick={this.handleRedirect}>
              <img src={Logo} alt="Home" className="avatar-normal" />
            </IconButton>
          </div>
          {eventById && eventById.id && (
            <div className={s.content}>
              <TimelineCard {...eventById} cancellable={false} />
              <Footer maintenance={false} />
            </div>
          )}
        </div>
      </>
    );
  }
}

const mapStateToProps = state => ({
  eventById: state.common.eventById,
});

export default connect(mapStateToProps, {
  setEventById,
})(ViewEvent);
