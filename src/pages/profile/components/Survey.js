import React, { Component } from 'react';
import { string, func } from 'prop-types';
import { get, uniqBy, find } from 'lodash';
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
  CheckCircle,
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
      allAnswers,
    } = props;
    const {
      customerAssessment: cachedCustomerAssessment,
      allAnswers: cachedAllAnswers,
    } = state;
    if (
      customerAssessment.length !== cachedCustomerAssessment.length
      || allAnswers.length !== cachedAllAnswers.length
    ) {
      const surveyIds = customerAssessment.length
        ? customerAssessment.map(survey => ({
          [survey.id]: false,
        })).reduce((acc, next) => ({ ...acc, ...next }), {})
        : {};
      return {
        customerAssessment,
        allAnswers,
        isTakingSurvey: { ...surveyIds },
      };
    }
    return null;
  }

  state = {
    customerAssessment: [],
    isTakingSurvey: {},
    allAnswers: [],
  };

  handleTakingSurvey = id => () => {
    this.setState({
      isTakingSurvey: {
        [id]: true,
      },
    });
  };

  handleCancelSurvey = id => () => {
    this.setState({
      isTakingSurvey: {
        [id]: false,
      },
    });
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
    const {
      customerAssessment,
      isTakingSurvey,
      allAnswers,
    } = this.state;

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
                  const currentSurvey = allAnswers.length > 0
                    && find(allAnswers, answer => answer.surveyId === survey.id);
                  const completedSurvey = currentSurvey && currentSurvey.status === 'COMPLETED';
                  return (
                    <ExpansionPanel key={survey.id}>
                      <ExpansionPanelSummary
                        expandIcon={<ExpandMore />}
                        key={survey.id}
                        classes={{
                          content: 'full-width',
                        }}
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
                            !isTakingSurvey[survey.id] && (
                              <Button
                                variant="outlined"
                                onClick={this.handleTakingSurvey(survey.id)}
                                className="main-button"
                                disabled={completedSurvey}
                                classes={{
                                  disabled: s.surveyCompleted,
                                }}
                              >
                                {completedSurvey ? (
                                  <>
                                    <CheckCircle className="icon-small" />
                                    Completed
                                  </>
                                ) : (
                                  <>
                                    <Edit className="icon-small" />
                                    Take Survey
                                  </>
                                )}
                              </Button>
                            )
                          }
                          <div className="full-width">
                            {!isTakingSurvey[survey.id] && (
                              <SurveyResult surveyId={survey.id} customerId={customerId} survey={survey} />
                            )}
                            {isTakingSurvey[survey.id] && (
                              <ResponseSurvey
                                assessment={survey}
                                customerId={customerId}
                                saveSurvey={this.handleSaveAnswers(survey, customerId)}
                                cancelSurvey={this.handleCancelSurvey}
                                surveyCompleted={completedSurvey}
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
  eventList: state.common.eventList,
});

export default connect(mapStateToProps, {
  createAssessmentResponse,
})(Survey);
