import React from 'react';
import { matchType, historyType } from 'types/global';
import Survey from './profile/components/Survey';
import styles from './profile/components/Content.module.scss';

const Assessment = ({ match, history }) => (
  <div className={styles.profilePage}>
    <Survey match={match} history={history} />
  </div>
);

Assessment.propTypes = {
  match: matchType.isRequired,
  history: historyType.isRequired,
};

export default Assessment;
