import React from 'react';
import {
  objectOf,
  any,
  func,
} from 'prop-types';
import {
  Typography,
  Divider,
} from '@material-ui/core';
import { get } from 'lodash';
import * as Survey from 'survey-react';
import s from './ResponseSurvey.module.scss';

const ResponseSurvey = (props) => {
  const { assessment, saveSurvey } = props;
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
    completedHtml: '<p>Your answer:</p>',
  };

  const surveyInfo = new Survey.Model(spaSurvey);

  return (
    <div className={s.survey}>
      <Typography variant="title" color="inherit" className={s.title}>{title}</Typography>
      <Typography variant="body1" color="inherit" className={s.description}>Description: {description}</Typography>
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
};

export default ResponseSurvey;
