import React, { Component } from 'react';
import { objectOf, any } from 'prop-types';
import { Typography, TextField, Button } from '@material-ui/core';
import { get } from 'lodash';
import uuidv1 from 'uuid/v1';
import { connect } from 'react-redux';
import s from './Info.module.scss';

class Info extends Component {
  state = {
    email: '',
    givenName: '',
    telephone: '',
    familyName: '',
    streetAddress: '',
    district: '',
    state: '',
    city: '',
    postCode: '',
    country: '',
  };

  handleChangeField = (event) => {
    event.preventDefault();
    const { name, value } = event.target;
    if ((name === 'telephone' && !/^\S+$/.test(value) && value.length)
      || value.length > 12) return;
    this.setState({ [name]: value });
  };

  handleSaveChangePersonalData = () => {
    const { email, givenName, telephone } = this.state;
    console.log(`new data ${email}, ${givenName}, ${telephone}`);
  };

  render() {
    const { userDetail } = this.props;
    const {
      email, givenName, telephone, familyName,
      streetAddress, district, state, city, postCode, country,
    } = this.state;
    const defaultGivenName = get(userDetail, 'givenName');
    const defaultFamilyName = get(userDetail, 'familyName');
    const defaultEmail = get(userDetail, 'email');
    const defaultTelephone = get(userDetail, 'telephone');
    const isPersonalDataTouched = (email && email !== defaultEmail)
      || (givenName && givenName !== defaultGivenName)
      || (telephone && telephone !== defaultTelephone)
      || (familyName && familyName !== defaultFamilyName);
    const defaultStreetAddress = get(userDetail, 'address.streetAddress');
    const defaultDistrict = get(userDetail, 'address.district');
    const defaultState = get(userDetail, 'address.state');
    const defaultCity = get(userDetail, 'address.city');
    const defaultPostCode = get(userDetail, 'address.postCode');
    const defaultCountry = get(userDetail, 'address.country');
    const isPersonalAddressTouched = (streetAddress && streetAddress !== defaultStreetAddress)
      || (district && district !== defaultDistrict)
      || (state && state !== defaultState)
      || (city && city !== defaultCity)
      || (postCode && postCode !== defaultPostCode)
      || (country && country !== defaultCountry);
    const PERSONAL_DATA = [
      {
        id: 'email', name: 'email', value: email || defaultEmail, label: 'Email',
      },
      {
        id: 'telephone', name: 'telephone', value: telephone || defaultTelephone, label: 'Telephone',
      },
      {
        id: 'givenName', name: 'givenName', value: givenName || defaultGivenName, label: 'Given name',
      },
      {
        id: 'familyName', name: 'familyName', value: familyName || defaultFamilyName, label: 'Family name',
      },
    ];

    const ADDRESS_DATA = [
      {
        // eslint-disable-next-line
        id: 'streetAddress', name: 'streetAddress', value: streetAddress || defaultStreetAddress, label: 'Street'
      },
      {
        // eslint-disable-next-line
        id: 'district', name: 'district', value: district || defaultDistrict, label: 'District'
      },
      {
        // eslint-disable-next-line
        id: 'state', name: 'state', value: state || defaultState, label: 'State'
      },
      {
        // eslint-disable-next-line
        id: 'city', name: 'city', value: city || defaultCity, label: 'City'
      },
      {
        // eslint-disable-next-line
        id: 'postCode', name: 'postCode', value: postCode || defaultPostCode, label: 'Post code'
      },
      {
        // eslint-disable-next-line
        id: 'country', name: 'country', value: country || defaultCountry, label: 'Country'
      },
    ];

    return (
      <>
        <div className={s.privateInfo}>
          <div className={s.personalInfo}>
            <div className={s.infoTitle}>
              <Typography variant="title" color="inherit" className="text-bold">
                My data
              </Typography>
            </div>
            <div className={s.infoSubtitle}>
              <Typography variant="subheading" color="inherit" className="text-bold">
                Personal data
              </Typography>
            </div>
            <div className={s.formData}>
              {PERSONAL_DATA.map(item => (
                <div key={uuidv1()} className={s.formControl}>
                  <TextField
                    fullWidth
                    onChange={this.handleChangeField}
                    variant="outlined"
                    label={item.label}
                    id={item.id}
                    name={item.name}
                    value={item.value}
                  />
                </div>
              ))}
              <div className={s.personalCta}>
                <Button
                  onClick={this.handleSaveChangePersonalData}
                  disabled={!isPersonalDataTouched}
                  variant="outlined"
                  className="main-button"
                >
                  Save changes
                </Button>
              </div>
            </div>
          </div>
          <div className={s.personalInfo}>
            <div className={s.infoTitle}>
              <Typography variant="title" color="inherit" className="text-bold">
                Address
              </Typography>
            </div>
            <div className={s.infoSubtitle}>
              <Typography variant="subheading" color="inherit" className="text-bold">
                Delivery address
              </Typography>
            </div>
            <div className={s.formData}>
              {ADDRESS_DATA.map(item => (
                <div key={uuidv1()} className={s.formControl}>
                  <TextField
                    fullWidth
                    onChange={this.handleChangeField}
                    variant="outlined"
                    label={item.label}
                    id={item.id}
                    name={item.name}
                    value={item.value}
                  />
                </div>
              ))}
            </div>
            <div className={s.personalCta}>
              <Button
                onClick={this.handleSaveChangePersonalData}
                disabled={!isPersonalAddressTouched}
                variant="outlined"
                className="main-button"
              >
                Save changes
              </Button>
            </div>
          </div>
        </div>
      </>
    );
  }
}

Info.propTypes = {
  userDetail: objectOf(any).isRequired,
};

const mapStateToProps = state => ({
  userDetail: state.auth.userDetail,
});

export default connect(mapStateToProps, null)(Info);
