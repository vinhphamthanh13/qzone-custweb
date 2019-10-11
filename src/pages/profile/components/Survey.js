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
  IconButton,
} from '@material-ui/core';
import {
  Edit,
  CheckCircle,
  ExpandMore,
  Home,
} from '@material-ui/icons';
import { createAssessmentResponse, getSurveyById, setAnsweredAssessmentByUser } from 'actionsReducers/surveys.action';
import { matchType, historyType } from 'types/global';
import SurveyResult from './assessment/SurveyResult';
import ResponseSurvey from './assessment/ResponseSurvey';
import styles from './Survey.module.scss';

class Survey extends Component {
  static propTypes = {
    customerId: string,
    createAssessmentResponse: func.isRequired,
    match: matchType,
    getSurveyById: func.isRequired,
    setAnsweredAssessmentByUser: func.isRequired,
    history: historyType,
  };

  static defaultProps = {
    customerId: '',
    match: null,
    history: null,
  };

  static getDerivedStateFromProps(props, state) {
    const {
      customerAssessment,
      allAnswers,
      match,
    } = props;
    const {
      customerAssessment: cachedCustomerAssessment,
      allAnswers: cachedAllAnswers,
    } = state;

    if (
      customerAssessment.length !== cachedCustomerAssessment.length
      || allAnswers.length !== cachedAllAnswers.length
    ) {
      const isAccessedByDirectLink = match && match.path === '/survey/:surveyId/:customerId';
      const newIsTakingSurvey = customerAssessment.length
        ? customerAssessment.map(survey => ({
          [survey.id]: isAccessedByDirectLink,
        })).reduce((acc, next) => ({ ...acc, ...next }), {})
        : {};
      return {
        customerAssessment,
        allAnswers,
        isTakingSurvey: { ...newIsTakingSurvey },
      };
    }
    return null;
  }

  state = {
    customerAssessment: [],
    isTakingSurvey: {},
    allAnswers: [],
  };

  componentDidMount() {
    const { match } = this.props;
    const isAccessedByDirectLink = match && match.path === '/survey/:surveyId/:customerId';

    if (isAccessedByDirectLink) {
      this.props.getSurveyById(match.params.surveyId);
      this.props.setAnsweredAssessmentByUser(match.params.surveyId, match.params.customerId);
    }
  }

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

  returnHomePage = () => {
    this.props.history.push('/');
  }

  render() {
    const { match } = this.props;
    const {
      customerAssessment,
      isTakingSurvey,
      allAnswers,
    } = this.state;

    const customerId = this.props.customerId || match.params.customerId;
    const isAccessedByDirectLink = match && match.path === '/survey/:surveyId/:customerId';

    return (
      <>
        {customerAssessment && customerAssessment.length !== 0
          ? (
            <div className={styles.container}>
              <div className={styles.header}>
                {isAccessedByDirectLink
                  && (
                    <IconButton classes={{ root: styles.homeBtn }} color="primary" onClick={this.returnHomePage}>
                      <Home />
                    </IconButton>
                  )}
                <Typography variant="title" color="inherit" className="text-bold">
                  Assessment of services
                </Typography>
              </div>
              <div className={styles.surveyList}>
                {uniqBy(customerAssessment, 'id').map((survey, index) => {
                  const currentSurvey = find(allAnswers, answer => answer.surveyId === survey.id);
                  const completedSurvey = currentSurvey && currentSurvey.status === 'COMPLETED';

                  return (
                    <ExpansionPanel defaultExpanded={customerAssessment.length === 1 && index === 0} key={survey.id}>
                      <ExpansionPanelSummary
                        expandIcon={<ExpandMore />}
                        key={survey.id}
                        classes={{
                          content: 'full-width',
                        }}
                      >
                        <div className={styles.surveyNo}>
                          <Typography variant="subtitle1" color="inherit">
                            {`${index + 1}`.padStart(2, '0')}
                          </Typography>
                        </div>
                        <div className={styles.surveyTitleAndDesc}>
                          <div className={styles.title}>
                            <Typography variant="subtitle1" color="inherit" noWrap>
                              {survey.title}
                            </Typography>
                          </div>
                          <div className={styles.description}>
                            <Typography variant="subtitle2" color="inherit" noWrap>
                              {survey.description}
                            </Typography>
                          </div>
                        </div>
                      </ExpansionPanelSummary>
                      <ExpansionPanelDetails>
                        <div className={`${styles.panelBody} full-width`}>
                          {
                            !isTakingSurvey[survey.id] && (
                              <Button
                                variant="outlined"
                                onClick={this.handleTakingSurvey(survey.id)}
                                className="main-button"
                                disabled={completedSurvey}
                                classes={{ disabled: styles.surveyCompleted }}
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
                            {completedSurvey && (
                              <SurveyResult surveyId={survey.id} customerId={customerId} survey={survey} />
                            )}
                            {!completedSurvey && (
                              <ResponseSurvey
                                assessment={survey}
                                customerId={customerId}
                                saveSurvey={this.handleSaveAnswers(survey, customerId)}
                                cancelSurvey={isAccessedByDirectLink ? undefined : this.handleCancelSurvey}
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
  getSurveyById,
  setAnsweredAssessmentByUser,
})(Survey);
