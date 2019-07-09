import React, { Component } from 'react';
import { func } from 'prop-types';
import { find, uniqBy } from 'lodash';
import { connect } from 'react-redux';
import EmptyItem from 'components/EmptyItem';
import { Typography } from '@material-ui/core';
import {
  Edit,
  Visibility,
  // Check,
  // NotInterested,
} from '@material-ui/icons';
import {
  setSurveys,
  setAssessmentAction,
} from 'actionsReducers/surveys.action';
import s from './Survey.module.scss';

class Survey extends Component {
  static propTypes = {
    setSurveys: func.isRequired,
    setAssessmentAction: func.isRequired,
  };

  static getDerivedStateFromProps(props, state) {
    const {
      surveyList,
      eventList,
      customerAssessment,
    } = props;
    const {
      surveyList: cachedSurveyList,
      eventList: cachedEventList,
      customerAssessment: cachedCustomerAssessment,
    } = state;
    if (surveyList !== cachedSurveyList
      || eventList !== cachedEventList
      || customerAssessment !== cachedCustomerAssessment
    ) {
      return {
        surveyList,
        eventList,
        customerAssessment,
      };
    }
    return null;
  }

  state = {
    surveyList: null,
    eventList: null,
    customerAssessment: [],
  };

  componentDidMount() {
    const { setSurveys: setSurveyAction } = this.props;
    setSurveyAction();
  }

  componentDidUpdate() {
    const { setAssessmentAction: setAssessments } = this.props;
    const { surveyList, eventList, customerAssessment } = this.state;
    const surveys = [];
    // eslint-disable-next-line
    eventList && eventList.length && eventList.map((event) => {
      const targetSurvey = find(surveyList, survey => survey.tempServiceId === event.tempServiceId);
      if (targetSurvey) surveys.push(targetSurvey);
      return event;
    });
    if (surveys.length !== customerAssessment.length) {
      setAssessments(surveys);
    }
  }

  render() {
    const {
      surveyList,
      customerAssessment,
    } = this.state;

    return (
      <>
        {surveyList && surveyList.length !== 0
          ? (
            <div className={s.container}>
              <Typography variant="title" color="inherit" className="text-bold">
                Assessment of services
              </Typography>
              <div className={s.surveyList}>
                {customerAssessment && customerAssessment.length > 0
                  && uniqBy(customerAssessment, 'id').map((survey, index) => (
                    <div key={survey.id} className={s.surveyItem}>
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
                      <div className={s.action}>
                        <Edit className="icon-small hover-pointer" />
                        <Visibility className="icon-small hover-pointer" />
                      </div>
                    </div>
                  ))}
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
  surveyList: state.surveys.surveyList,
  customerAssessment: state.surveys.customerAssessment,
  eventList: state.common.eventList,
});

export default connect(
  mapStateToProps,
  {
    setSurveys,
    setAssessmentAction,
  },
)(Survey);
