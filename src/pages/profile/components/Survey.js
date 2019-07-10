import React, { Component } from 'react';
import { string, func } from 'prop-types';
import { get, uniqBy } from 'lodash';
import { connect } from 'react-redux';
import EmptyItem from 'components/EmptyItem';
import {
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  Typography,
  Button,
} from '@material-ui/core';
import {
  Edit,
  Check,
  ExpandMore,
} from '@material-ui/icons';
import { createAssessmentResponse } from 'actionsReducers/surveys.action';
import SurveyResult from './assessment/SurveyResult';
import ResponseSurvey from './assessment/ResponseSurvey';
import s from './Survey.module.scss';

class Survey extends Component {
  static propTypes = {
    customerId: string.isRequired,
    createAssessmentResponse: func.isRequired,
  };

  static getDerivedStateFromProps(props, state) {
    const {
      customerAssessment,
      surveyAnswers,
    } = props;
    const {
      customerAssessment: cachedCustomerAssessment,
      surveyAnswers: cachedSurveyAnswers,
    } = state;
    if (
      customerAssessment !== cachedCustomerAssessment
      || surveyAnswers !== cachedSurveyAnswers
    ) {
      return {
        customerAssessment,
        surveyAnswers,
      };
    }
    return null;
  }

  state = {
    customerAssessment: [],
    isTakingSurvey: false,
    surveyAnswers: null,
  };

  handleTakingSurvey = () => {
    this.setState({
      isTakingSurvey: true,
    });
    console.log('Take the survey nao');
  };


  handleSaveAnswers = (assessment, customerId) => (answers) => {
    const {
      createAssessmentResponse: saveAnswers,
    } = this.props;
    let questionAnswers = get(answers, 'data');

    if (typeof questionAnswers !== 'string') {
      questionAnswers = JSON.stringify(questionAnswers);
    }
    const surveyId = get(assessment, 'id');
    const responseSurvey = {
      participantId: customerId,
      questionAnswers,
      status: 'COMPLETED',
      surveyId,
    };

    saveAnswers(responseSurvey);
  };

  render() {
    const { customerId } = this.props;
    const { customerAssessment, isTakingSurvey, surveyAnswers } = this.state;

    return (
      <>
        {customerAssessment && customerAssessment.length !== 0
          ? (
            <div className={s.container}>
              <Typography variant="title" color="inherit" className="text-bold">
                Assessment of services
              </Typography>
              <div className={s.surveyList}>
                {uniqBy(customerAssessment, 'id').map((survey, index) => {
                  const completedSurvey = surveyAnswers && surveyAnswers.status === 'COMPLETED';
                  return (
                    <ExpansionPanel key={survey.id}>
                      <ExpansionPanelSummary
                        expandIcon={<ExpandMore />}
                        key={survey.id}
                      >
                        <div className={s.surveyNo}>
                          <Typography variant="subtitle1" color="inherit">
                            {`${index + 1}`.padStart(2, '0')}
                          </Typography>
                        </div>
                        <div className={s.surveyTitleAndDesc}>
                          <div className={s.title}>
                            <Typography variant="subtitle1" color="inherit" noWrap>
                              {survey.title}
                            </Typography>
                          </div>
                          <div className={s.description}>
                            <Typography variant="subtitle2" color="inherit" noWrap>
                              {survey.description}
                            </Typography>
                          </div>
                        </div>
                      </ExpansionPanelSummary>
                      <ExpansionPanelDetails>
                        <div className={`${s.panelBody} full-width`}>
                          {
                            !isTakingSurvey && (
                              <Button
                                variant="outlined"
                                onClick={this.handleTakingSurvey}
                                className="main-button"
                                disabled={completedSurvey}
                              >
                                {completedSurvey ? (
                                  <>
                                    <Check className="icon-small" />
                                    Survey Completed
                                  </>
                                ) : (
                                  <>
                                    <Edit className="icon-small hover-pointer" />
                                    Take Survey
                                  </>
                                )}
                              </Button>
                            )
                          }
                          <div className="full-width">
                            {!isTakingSurvey && <SurveyResult surveyId={survey.id} customerId={customerId} />}
                            {isTakingSurvey && (
                              <ResponseSurvey
                                assessment={survey}
                                customerId={customerId}
                                saveSurvey={this.handleSaveAnswers(survey, customerId)}
                              />
                            )}
                          </div>
                        </div>
                      </ExpansionPanelDetails>
                    </ExpansionPanel>
                  );
                })}
              </div>
            </div>
          )
          : (
            <EmptyItem
              message="There is no Assessment in your list!"
            />)
        }
      </>
    );
  }
}

const mapStateToProps = state => ({
  ...state.surveys,
  customerAssessment: state.surveys.customerAssessment,
  eventList: state.common.eventList,
});

export default connect(mapStateToProps, {
  createAssessmentResponse,
})(Survey);
