import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import styles from './CustomLink.module.scss';

export default function CustomLink({ text, className, ...linkProps }) {
  return (
    <Link className={`${styles.customLink} ${className}`} {...linkProps}>{text}</Link>
  );
}

CustomLink.propTypes = {
  to: PropTypes.string.isRequired,
  className: PropTypes.string,
  text: PropTypes.string.isRequired,
  target: PropTypes.string,
};

CustomLink.defaultProps = {
  className: '',
  target: '_blank',
};
