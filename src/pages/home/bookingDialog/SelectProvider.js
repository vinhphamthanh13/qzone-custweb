import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Grid, CircularProgress, Card, CardContent,
  Typography,
} from '@material-ui/core';
import { providerType } from 'types/global';
import CustomLink from 'components/CustomLink';
import { getProvidersByService } from 'modules/home/bookingDialog/selectProvider.actions';
import EmptyState from '../services/EmptyState';

class SelectProvider extends React.PureComponent {
  componentDidMount = () => {
    this.props.getProvidersByServiceAction();
  }

  render() {
    const { isLoading, providers } = this.props;
    return (
      <Grid container spacing={32} className="select-services__cards-wrapper">
        {
          isLoading && providers.length === 0
          && <CircularProgress size={50} classes={{ root: 'select-services__loading' }} />
        }
        {
          !isLoading && providers.length === 0
          && <EmptyState />
        }
        {providers.map(provider => (
          <Grid item md={4} key={provider.id}>
            <Card>
              <CardContent>
                <Typography variant="title">{provider.name}</Typography>
                <div className="service-detail">
                  <Typography variant="subtitle2">
                    {(provider.description || '').substring(0, 300)}...&nbsp;
                    <CustomLink text="Read more" to="#" onClick={this.openDialog} />
                  </Typography>
                  <Grid container className="service-detail__item">
                    <Grid item sm={6}>
                      <Typography variant="caption">Duration:</Typography>
                    </Grid>
                    <Grid item sm={6}>
                      <Typography variant="subtitle2">{provider.duration} minutes</Typography>
                    </Grid>
                  </Grid>
                  <Grid container className="service-detail__item">
                    <Grid item sm={6}>
                      <Typography variant="caption">Organisation:</Typography>
                    </Grid>
                    <Grid item sm={6}>
                      <Typography variant="subtitle2">
                        <CustomLink
                          text={provider.organization.name}
                          to={`/organisation/${provider.organization.id}`}
                        />
                      </Typography>
                    </Grid>
                  </Grid>
                </div>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  }
}

SelectProvider.propTypes = {
  providers: PropTypes.arrayOf(providerType).isRequired,
  isLoading: PropTypes.bool.isRequired,
  getProvidersByServiceAction: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({ ...state.homeModules.bookingDialog.selectProvider });

export default connect(mapStateToProps, { getProvidersByServiceAction: getProvidersByService })(SelectProvider);
