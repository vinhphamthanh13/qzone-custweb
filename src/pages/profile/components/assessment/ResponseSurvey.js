import React from 'react';
import {
  objectOf,
  any,
  func,
  bool,
} from 'prop-types';
import {
  Typography,
  Divider,
  Button,
} from '@material-ui/core';
import { get } from 'lodash';
import * as Survey from 'survey-react';
import s from './ResponseSurvey.module.scss';

Survey.StylesManager.applyTheme('default');

const ResponseSurvey = (props) => {
  const {
    assessment, saveSurvey, cancelSurvey, surveyCompleted,
  } = props;
  const surveyId = get(assessment, 'id');
  const title = get(assessment, 'title');
  const description = get(assessment, 'description');
  const survey = get(assessment, 'survey');
  const surveyObject = JSON.parse(survey);
  let fullPage = [];
  // eslint-disable-next-line
  surveyObject.pages.map((page) => {
    if (page.elements) {
      fullPage = [...page.elements.map(question => ({
        questions: [{
          ...question,
          isRequired: true,
        }],
      }))];
    }
  });
  const spaSurvey = {
    showProgressBar: 'bottom',
    goNextPageAutomatic: false,
    showNavigationButtons: true,
    pages: fullPage,
    completedHtml: '<h4>Thank you for your feedback.</h4>'
      + '<h5>Your thoughts and ideas will help us to create a great product!</h5>',
  };

  const surveyInfo = new Survey.Model(spaSurvey);

  return (
    <div className={s.survey}>
      <div className={s.header}>
        <Typography variant="title" color="inherit" className={s.title}>{title}</Typography>
        <Button
          onClick={cancelSurvey(surveyId)}
          variant="outlined"
        >
          {surveyCompleted ? 'Back' : 'Cancel'}
        </Button>
      </div>
      <Typography variant="body1" color="inherit" className={s.description}>
        <strong>Description</strong>: {description}
      </Typography>
      <Divider />
      <Survey.Survey
        model={surveyInfo}
        className={s.response}
        onComplete={saveSurvey}
      />
    </div>
  );
};

ResponseSurvey.propTypes = {
  assessment: objectOf(any).isRequired,
  saveSurvey: func.isRequired,
  cancelSurvey: func.isRequired,
  surveyCompleted: bool.isRequired,
};

export default ResponseSurvey;
