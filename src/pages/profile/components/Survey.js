import React, { Component } from 'react';
import { func } from 'prop-types';
import { find } from 'lodash';
import { connect } from 'react-redux';
import EmptyItem from 'components/EmptyItem';
import { Typography } from '@material-ui/core';
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
    eventList.map((event) => {
      const targetSurvey = find(surveyList, event.id);
      if (targetSurvey) custSurveys.push(targetSurvey);
      return event;
    });
    console.log('custsurvey', custSurveys);

    return (
      <>
        {surveyList && surveyList.length === 0
          ? (
            <EmptyItem
              message="There is no Assessment in your list!"
            />)
          : (
            <div className={s.container}>
              <Typography variant="title" color="inherit" className="text-bold">
                Survey List is under integration!
              </Typography>
            </div>
          )
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
