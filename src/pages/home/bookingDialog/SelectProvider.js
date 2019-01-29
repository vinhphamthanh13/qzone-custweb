import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Grid, Card, CardContent,
  Typography, CardActionArea,
} from '@material-ui/core';
import { providerType, serviceType, bookingDetailType } from 'types/global';
import CustomLink from 'components/CustomLink';
import { getProvidersByService } from 'modules/home/bookingDialog/selectProvider.actions';
import CustomLoading from 'components/CustomLoading';
import EmptyState from '../services/EmptyState';
import styles from './SelectProvider.module.scss';

class SelectProvider extends React.PureComponent {
  componentDidMount = () => {
    const { providers, getProvidersByServiceAction, initService } = this.props;

    if (providers.length === 0) {
      getProvidersByServiceAction(initService.id);
    }
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
            && <CustomLoading />
          }
          {
            !isLoading && providers.length === 0
            && <EmptyState message="No available providers" />
          }
          {providers.map(provider => (
            <Grid item md={4} key={provider.id}>
              <Card classes={{
                root: bookingDetail.provider
                  && bookingDetail.provider.id === provider.id ? styles.activeItem : '',
              }}
              >
                <CardActionArea onClick={() => onChange(provider, 'provider')}>
                  <CardContent>
                    <Typography variant="title">
                      {provider.givenName} {provider.familyName}
                    </Typography>
                    <Typography variant="body2">
                      {(provider.description || '').substring(0, 300)}
                      {provider.description.length > 300
                        && <>...&nbsp;<CustomLink text="Read more" to="#" onClick={this.openDialog} /></>}
                    </Typography>
                    <div className={styles.providerDetail}>
                      <Grid container>
                        <Grid item sm={4}>
                          <Typography variant="caption">Qualifications:</Typography>
                        </Grid>
                        <Grid item sm={8}>
                          <Typography variant="subtitle2">
                            {provider.qualifications.join(', ')}
                          </Typography>
                        </Grid>
                        <Grid item sm={4}>
                          <Typography variant="caption">Mobile phone:</Typography>
                        </Grid>
                        <Grid item sm={8}>
                          <Typography variant="subtitle2">
                            {provider.telephone}
                          </Typography>
                        </Grid>
                        <Grid item sm={4}>
                          <Typography variant="caption">Email:</Typography>
                        </Grid>
                        <Grid item sm={8}>
                          <Typography variant="subtitle2">
                            {provider.email}
                          </Typography>
                        </Grid>
                        <Grid item sm={4}>
                          <Typography variant="caption">Organisation:</Typography>
                        </Grid>
                        <Grid item sm={8}>
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
