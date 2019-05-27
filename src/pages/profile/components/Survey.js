import React, { Component } from 'react';
import EmptyItem from 'components/EmptyItem';
import { Typography } from '@material-ui/core';
import s from './Survey.module.scss';

class Survey extends Component {
  static getDerivedStateFromProps(props, state) {
    const {
      surveyList,
    } = props;
    const {
      surveyList: cachedSurveyList,
    } = state;
    if (surveyList !== cachedSurveyList) {
      return {
        surveyList,
      };
    }
    return null;
  }

  state = {
    surveyList: null,
  };

  render() {
    const { surveyList } = this.state;

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

export default Survey;
