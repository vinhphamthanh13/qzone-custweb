import React, { Component } from 'react';
import { objectOf, any, func } from 'prop-types';
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

  resolveUserInfoFromProps = () => {
    const { userDetail } = this.props;
    const {
      email, givenName, telephone, familyName,
      streetAddress, district, state, city, postCode, country,
    } = this.state;
    const defaultGivenName = get(userDetail, 'givenName');
    const defaultFamilyName = get(userDetail, 'familyName');
    const defaultEmail = get(userDetail, 'email');
    const defaultTelephone = get(userDetail, 'telephone');
    const defaultStreetAddress = get(userDetail, 'address.streetAddress');
    const defaultDistrict = get(userDetail, 'address.district');
    const defaultState = get(userDetail, 'address.state');
    const defaultCity = get(userDetail, 'address.city');
    const defaultPostCode = get(userDetail, 'address.postCode');
    const defaultCountry = get(userDetail, 'address.country');
    const isPersonalDataTouched = (email && email !== defaultEmail)
      || (givenName && givenName !== defaultGivenName)
      || (telephone && telephone !== defaultTelephone)
      || (familyName && familyName !== defaultFamilyName);
    const isPersonalAddressTouched = (streetAddress && streetAddress !== defaultStreetAddress)
      || (district && district !== defaultDistrict)
      || (state && state !== defaultState)
      || (city && city !== defaultCity)
      || (postCode && postCode !== defaultPostCode)
      || (country && country !== defaultCountry);
    return {
      personal: {
        givenName: givenName || defaultGivenName,
        familyName: familyName || defaultFamilyName,
        email: email || defaultEmail,
        telephone: telephone || defaultTelephone,
      },
      address: {
        streetAddress: streetAddress || defaultStreetAddress,
        district: district || defaultDistrict,
        state: state || defaultState,
        city: city || defaultCity,
        postCode: postCode || defaultPostCode,
        country: country || defaultCountry,
      },
      isPersonalDataTouched,
      isPersonalAddressTouched,
    };
  };

  handleSaveChangePersonalData = () => {
    const { handleAccount, userDetail } = this.props;
    const userSub = get(userDetail, 'userSub');
    const providerInformation = get(userDetail, 'providerInformation');
    const userStatus = get(userDetail, 'userStatus');
    const userType = get(userDetail, 'userType');
    // Todo: resolve userType for customer and provider
    const { personal, address } = this.resolveUserInfoFromProps();
    handleAccount({
      address: {
        city: address.city,
        country: address.country,
        district: address.district,
        postCode: address.postCode,
        state: address.state,
        streetAddress: address.streetAddress,
      },
      email: personal.email,
      familyName: personal.familyName,
      givenName: personal.givenName,
      telephone: personal.telephone,
      id: userSub,
      userSub,
      userType,
      userStatus,
      providerInformation,
    });
  };

  render() {
    const {
      personal, address, isPersonalDataTouched, isPersonalAddressTouched,
    } = this.resolveUserInfoFromProps();
    const PERSONAL_DATA = [
      {
        id: 'email', name: 'email', value: personal.email, label: 'Email',
      },
      {
        id: 'telephone', name: 'telephone', value: personal.telephone, label: 'Telephone',
      },
      {
        id: 'givenName', name: 'givenName', value: personal.givenName, label: 'Given name',
      },
      {
        id: 'familyName', name: 'familyName', value: personal.familyName, label: 'Family name',
      },
    ];

    const ADDRESS_DATA = [
      {
        id: 'streetAddress', name: 'streetAddress', value: address.streetAddress, label: 'Street',
      },
      {
        id: 'district', name: 'district', value: address.district, label: 'District',
      },
      {
        id: 'state', name: 'state', value: address.state, label: 'State',
      },
      {
        id: 'city', name: 'city', value: address.city, label: 'City',
      },
      {
        id: 'postCode', name: 'postCode', value: address.postCode, label: 'Post code',
      },
      {
        id: 'country', name: 'country', value: address.country, label: 'Country',
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
  handleAccount: func.isRequired,
};

const mapStateToProps = state => ({
  userDetail: state.auth.userDetail,
});

export default connect(mapStateToProps, null)(Info);
