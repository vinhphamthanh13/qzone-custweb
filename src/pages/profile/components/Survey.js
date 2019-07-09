import React, { Component } from 'react';
import { func } from 'prop-types';
import { find, uniqBy } from 'lodash';
import { connect } from 'react-redux';
import EmptyItem from 'components/EmptyItem';
import { Typography } from '@material-ui/core';
import {
  Edit,
  Visibility,
  Check,
  NotInterested,
} from '@material-ui/icons';
import { setSurveys } from 'actionsReducers/surveys.action';
import s from './Survey.module.scss';

class Survey extends Component {
  static propTypes = {
    setSurveys: func.isRequired,
  };

  static getDerivedStateFromProps(props, state) {
    const {
      surveyList,
      eventList,
    } = props;
    const {
      surveyList: cachedSurveyList,
      eventList: cachedEventList,
    } = state;
    if (surveyList !== cachedSurveyList
      || eventList !== cachedEventList
    ) {
      return {
        surveyList,
        eventList,
      };
    }
    return null;
  }

  state = {
    surveyList: null,
    eventList: null,
  };

  componentDidMount() {
    const { setSurveys: setSurveyAction } = this.props;
    setSurveyAction();
  }

  render() {
    const {
      surveyList,
      eventList,
    } = this.state;
    const custSurveys = [];
    // eslint-disable-next-line
    eventList && eventList.length && eventList.map((event) => {
      const targetSurvey = find(surveyList, survey => survey.tempServiceId === event.tempServiceId);
      if (targetSurvey) custSurveys.push(targetSurvey);
      return event;
    });

    return (
      <>
        {surveyList && surveyList.length !== 0
          ? (
            <div className={s.container}>
              <Typography variant="title" color="inherit" className="text-bold">
                Assessment of services
              </Typography>
              <div className={s.surveyList}>
                {custSurveys.length > 0 && uniqBy(custSurveys, 'id').map((survey, index) => (
                  <div key={survey.id} className={s.surveyItem}>
                    <div className={s.surveyNo}>
                      {index + 1}
                    </div>
                    <div className={s.surveyTitleAndDesc}>
                      <div className={s.title}>
                        {survey.title}
                      </div>
                      <div className={s.description}>
                        <Typography color="inherit" noWrap>
                          {survey.description}
                        </Typography>
                      </div>
                    </div>
                    <div className={s.action}>
                      <Edit className="icon-small hover-pointer" />
                      <Visibility className="icon-small hover-pointer" />
                      <Check className="icon-small hover-pointer" />
                      <NotInterested className="icon-small hover-pointer" />
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
  eventList: state.common.eventList,
});

export default connect(
  mapStateToProps,
  {
    setSurveys,
  },
)(Survey);
