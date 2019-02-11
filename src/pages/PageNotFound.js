import React from 'react';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom';
import styles from './PageNotFound.module.scss';

function PageNotFound() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.inner}>
        <div className={styles.content}>
          <Typography variant="h1">Oops!</Typography>
          <Typography variant="h2">
                      404 - The Page can not be found
          </Typography>
        </div>
        <Link to="/">
            Go To Homepage
        </Link>
      </div>
      <div className={styles.effect}>
        <div className={styles.cloud}>
          <div className={styles.cloudLeft} />
          <div className={styles.cloudRight} />
        </div>
        <div className={styles.rain}>
          <div className={styles.drop} />
          <div className={styles.drop} />
          <div className={styles.drop} />
          <div className={styles.drop} />
          <div className={styles.drop} />
        </div>
        <div className={styles.surface}>
          <div className={styles.hit} />
          <div className={styles.hit} />
          <div className={styles.hit} />
          <div className={styles.hit} />
          <div className={styles.hit} />
        </div>
      </div>
    </div>
  );
}

export default PageNotFound;
