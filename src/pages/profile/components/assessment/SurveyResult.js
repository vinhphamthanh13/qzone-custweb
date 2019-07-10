import React, { Component } from 'react';
import {
  func,
  string,
} from 'prop-types';
import { get } from 'lodash';
import { connect } from 'react-redux';
import * as Survey from 'survey-react';
import { Typography } from '@material-ui/core';
import GridContainer from 'components/Grid/GridContainer';
import GridItem from 'components/Grid/GridItem';
import Card from 'components/Card/Card';
import CardBody from 'components/Card/CardBody';
import {
  setAnsweredAssessmentByUser,
  setSurveyById,
} from 'actionsReducers/surveys.action';
import Logo from 'images/quezone-logo.png';
// import s from './SurveyResult.module.scss';

class ResponseSurvey extends Component {
  static propTypes = {
    surveyId: string.isRequired,
    customerId: string.isRequired,
    setAnsweredAssessmentByUser: func.isRequired,
    setSurveyById: func.isRequired,
  };

  static getDerivedStateFromProps(props, state) {
    const {
      surveyById,
      surveyAnswers,
    } = props;
    const {
      surveyById: cachedSurveyById,
      surveyAnswers: cachedSurveyAnswers,
    } = state;

    if (surveyById !== cachedSurveyById
      || surveyAnswers !== cachedSurveyAnswers
    ) {
      return {
        surveyById,
        surveyAnswers,
      };
    }

    return null;
  }

  state = {
    surveyById: null,
    surveyAnswers: null,
  };

  componentDidMount() {
    const {
      surveyId,
      customerId,
      setSurveyById: getSurveyById,
      setAnsweredAssessmentByUser: setAnswerByUser,
    } = this.props;

    getSurveyById(surveyId);
    setAnswerByUser(surveyId, customerId);
  }

  render() {
    const { surveyById, surveyAnswers } = this.state;
    const title = get(surveyById, 'title');
    const description = get(surveyById, 'description');
    const logo = get(surveyById, 'logo');
    const survey = get(surveyById, 'survey');
    const surveyInfo = new Survey.Model(survey);
    const questionAnswers = get(surveyAnswers, 'questionAnswers');
    surveyInfo.data = JSON.parse(questionAnswers);
    surveyInfo.mode = 'display';

    return (
      <GridContainer>
        <GridItem xs={12}>
          <Card>
            <CardBody>
              <GridContainer>
                <GridItem xs={12} sm={3}>
                  <Typography variant="subtitle1" color="inherit" className="text-bold">
                    Title:
                  </Typography>
                </GridItem>
                <GridItem xs={12} sm={7}>
                  <Typography variant="subheading" color="inherit" noWrap>{title}</Typography>
                </GridItem>
              </GridContainer>
              <GridContainer>
                <GridItem xs={12} sm={3}>
                  <Typography variant="subtitle1" color="inherit" className="text-bold">
                    Description:
                  </Typography>
                </GridItem>
                <GridItem xs={12} sm={7}>
                  <Typography variant="subtitle2" color="inherit">{description}</Typography>
                </GridItem>
              </GridContainer>
              <GridContainer>
                <GridItem xs={12} sm={3}>
                  <Typography variant="subtitle1" color="inherit" className="text-bold">
                    Logo:
                  </Typography>
                </GridItem>
                <GridItem xs={12} sm={7}>
                  <img src={logo || Logo} alt="survey logo" width="100" />
                </GridItem>
              </GridContainer>
              <GridContainer>
                <GridItem xs={12} sm={10}>
                  <Survey.Survey model={surveyInfo} />
                </GridItem>
              </GridContainer>
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    );
  }
}

const mapStateToProps = state => ({
  ...state.surveys,
});

export default connect(mapStateToProps, {
  setAnsweredAssessmentByUser,
  setSurveyById,
})(ResponseSurvey);
