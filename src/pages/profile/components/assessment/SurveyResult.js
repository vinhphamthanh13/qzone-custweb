import React, { Component } from 'react';
import {
  objectOf,
  any,
  func,
  string,
} from 'prop-types';
import { get, find } from 'lodash';
import { connect } from 'react-redux';
import * as Survey from 'survey-react';
import {
  Typography,
  Divider,
} from '@material-ui/core';
import GridContainer from 'components/Grid/GridContainer';
import GridItem from 'components/Grid/GridItem';
import Card from 'components/Card/Card';
import CardBody from 'components/Card/CardBody';
import {
  setAnsweredAssessmentByUser,
  setSurveyById,
} from 'actionsReducers/surveys.action';
import Logo from 'images/quezone-logo.png';
import s from './SurveyResult.module.scss';

Survey.StylesManager.applyTheme('default');

class ResponseSurvey extends Component {
  static propTypes = {
    survey: objectOf(any).isRequired,
    customerId: string.isRequired,
    setAnsweredAssessmentByUser: func.isRequired,
    setSurveyById: func.isRequired,
  };

  static getDerivedStateFromProps(props, state) {
    const {
      allAnswers,
    } = props;
    const {
      allAnswers: cachedAllAnswers,
    } = state;

    if (allAnswers !== cachedAllAnswers) {
      return { allAnswers };
    }

    return null;
  }

  state = {
    allAnswers: [],
  };

  componentDidMount() {
    const {
      survey,
      customerId,
      setSurveyById: getSurveyById,
      setAnsweredAssessmentByUser: setAnswerByUser,
    } = this.props;
    const { id: surveyId } = survey;
    getSurveyById(surveyId);
    setAnswerByUser(surveyId, customerId);
  }

  render() {
    const { survey } = this.props;
    const { allAnswers } = this.state;
    const { id: surveyId } = survey;
    const surveyAnswer = find(allAnswers, answer => answer.surveyId === surveyId);
    const title = get(survey, 'title');
    const description = get(survey, 'description');
    const logo = get(survey, 'logo');
    const surveyContent = get(survey, 'survey');
    const surveyInfo = new Survey.Model(surveyContent);
    const questionAnswers = get(surveyAnswer, 'questionAnswers');
    // eslint-disable-next-line
    console.log('question answer', questionAnswers);
    surveyInfo.data = JSON.parse(questionAnswers || '{}');
    surveyInfo.mode = 'display';

    return (
      <GridContainer>
        <Card>
          <CardBody>
            <GridContainer>
              <GridItem xs={12} sm={3}>
                <Typography variant="subtitle1" color="inherit" className="text-bold">
                  Title:
                </Typography>
              </GridItem>
              <GridItem xs={12} sm={7}>
                <Typography variant="subtitle1" color="inherit" noWrap>{title}</Typography>
              </GridItem>
            </GridContainer>
            <GridContainer>
              <GridItem xs={12} sm={3}>
                <Typography variant="subtitle1" color="inherit" className="text-bold">
                  Description:
                </Typography>
              </GridItem>
              <GridItem xs={12} sm={7}>
                <Typography variant="body1" color="inherit">{description}</Typography>
              </GridItem>
            </GridContainer>
            <GridContainer>
              <GridItem xs={12} sm={3}>
                <Typography variant="subtitle1" color="inherit" className="text-bold">
                  Logo:
                </Typography>
              </GridItem>
              <GridItem xs={12} sm={7}>
                <img src={logo || Logo} alt="survey logo" width="120" className={s.surveyLogo} />
              </GridItem>
            </GridContainer>
            <Divider classes={{ root: s.divider }} />
            <GridContainer>
              <GridItem xs={12}>
                <Survey.Survey model={surveyInfo} />
              </GridItem>
            </GridContainer>
          </CardBody>
        </Card>
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
