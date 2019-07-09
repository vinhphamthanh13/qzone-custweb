import React, { Component } from 'react';
import { uniqBy } from 'lodash';
import { connect } from 'react-redux';
import EmptyItem from 'components/EmptyItem';
import { Typography } from '@material-ui/core';
import {
  Edit,
  Visibility,
} from '@material-ui/icons';
import s from './Survey.module.scss';

class Survey extends Component {
  static getDerivedStateFromProps(props, state) {
    const {
      customerAssessment,
    } = props;
    const {
      customerAssessment: cachedCustomerAssessment,
    } = state;
    if (customerAssessment !== cachedCustomerAssessment) {
      return {
        customerAssessment,
      };
    }
    return null;
  }

  state = {
    customerAssessment: [],
  };

  render() {
    const { customerAssessment } = this.state;

    return (
      <>
        {customerAssessment && customerAssessment.length !== 0
          ? (
            <div className={s.container}>
              <Typography variant="title" color="inherit" className="text-bold">
                Assessment of services
              </Typography>
              <div className={s.surveyList}>
                {uniqBy(customerAssessment, 'id').map((survey, index) => (
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

export default connect(mapStateToProps)(Survey);
