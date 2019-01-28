import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Grid, CircularProgress, Card, CardContent,
  Typography, CardActionArea,
} from '@material-ui/core';
import { providerType, serviceType, bookingDetailType } from 'types/global';
import CustomLink from 'components/CustomLink';
import { getProvidersByService } from 'modules/home/bookingDialog/selectProvider.actions';
import EmptyState from '../services/EmptyState';
import styles from './SelectProvider.module.scss';

class SelectProvider extends React.PureComponent {
  componentDidMount = () => {
    this.props.getProvidersByServiceAction(this.props.initService.id);
  }

  render() {
    const {
      isLoading, providers, onChange, bookingDetail,
    } = this.props;
    return (
      <div className={styles.selectProvider}>
        <Grid container spacing={32} className={styles.cardsWrapper}>
          {
            isLoading && providers.length === 0
            && <CircularProgress size={50} classes={{ root: styles.loading }} />
          }
          {
            !isLoading && providers.length === 0
            && <EmptyState message="No available providers" />
          }
          {providers.map(provider => (
            <Grid item md={4} key={provider.id}>
              <Card classes={{
                root: bookingDetail.provider && bookingDetail.provider.id === provider.id
                  ? styles.activeItem : '',
              }}
              >
                <CardActionArea onClick={() => onChange(provider, 'provider')}>
                  <CardContent>
                    <Typography variant="title">
                      {provider.givenName} {provider.familyName}
                    </Typography>
                    <div className={styles.serviceDetail}>
                      <Typography variant="subtitle2">
                        {(provider.description || '').substring(0, 300)}...&nbsp;
                        {provider.description.length > 300
                          && <CustomLink text="Read more" to="#" onClick={this.openDialog} />}
                      </Typography>
                      <Grid container>
                        <Grid item sm={6}>
                          <Typography variant="caption">Qualifications:</Typography>
                        </Grid>
                        <Grid item sm={6}>
                          <Typography variant="subtitle2">
                            {provider.qualifications.join(', ')}
                          </Typography>
                        </Grid>
                      </Grid>
                      <Grid container>
                        <Grid item sm={6}>
                          <Typography variant="caption">Mobile phone:</Typography>
                        </Grid>
                        <Grid item sm={6}>
                          <Typography variant="subtitle2">
                            {provider.telephone}
                          </Typography>
                        </Grid>
                      </Grid>
                      <Grid container>
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
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </div>
    );
  }
}

SelectProvider.propTypes = {
  initService: serviceType,
  providers: PropTypes.arrayOf(providerType).isRequired,
  isLoading: PropTypes.bool.isRequired,
  getProvidersByServiceAction: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  bookingDetail: bookingDetailType.isRequired,
};

SelectProvider.defaultProps = {
  initService: undefined,
};

const mapStateToProps = state => ({ ...state.homeModules.bookingDialog.selectProvider });

export default connect(mapStateToProps, { getProvidersByServiceAction: getProvidersByService })(SelectProvider);
