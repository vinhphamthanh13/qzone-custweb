import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Grid, CircularProgress } from '@material-ui/core';
import { serviceType } from 'types/global';
import { getServicesByOrgId } from 'modules/home/bookingDialog/selectService.actions';
import ServiceCard from '../services/ServiceCard';
import EmptyState from '../services/EmptyState';

class SelectService extends PureComponent {
  componentDidMount() {
    this.onLoadServices();
  }

  componentDidUpdate = (prevProps) => {
    if (this.props.initService
      && (!prevProps.initService || prevProps.initService.organizationId !== this.props.initService.organizationId)) {
      this.onLoadServices();
    }
  }

  onLoadServices = () => {
    this.props.getServicesByOrgIdAction(this.props.initService.organizationId);
  }

  render() {
    const { services, onChange, isLoading } = this.props;
    return (
      <>
        <Grid container spacing={32} className="select-services__cards-wrapper">
          {
            isLoading && services.length === 0
            && <CircularProgress size={50} classes={{ root: 'select-services__loading' }} />
          }
          {
            !isLoading && services.length === 0
            && <EmptyState onLoadServices={this.onLoadServices} />
          }
          {services.map(service => (
            <Grid item md={4} key={service.id}>
              <ServiceCard onChange={onChange} service={service} />
            </Grid>
          ))}
        </Grid>
      </>
    );
  }
}

SelectService.propTypes = {
  initService: serviceType,
  services: PropTypes.arrayOf(serviceType).isRequired,
  onChange: PropTypes.func.isRequired,
  getServicesByOrgIdAction: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
};

SelectService.defaultProps = {
  initService: undefined,
};

const mapStateToProps = state => ({ ...state.homeModules.bookingDialog.selectService });

export default connect(mapStateToProps, { getServicesByOrgIdAction: getServicesByOrgId })(SelectService);
