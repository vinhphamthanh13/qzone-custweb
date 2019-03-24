import React from 'react';
import { string, bool } from 'prop-types';
import { Link } from 'react-router-dom';
import styles from './CustomLink.module.scss';

export default function CustomLink({
  text, className, small, ...linkProps
}) {
  const mixedStyle = small ? `${styles.customLink} ${styles.small} ${className}` : `${styles.customLink} ${className}`;
  return (
    <Link className={mixedStyle} {...linkProps}>{text}</Link>
  );
}

CustomLink.propTypes = {
  to: string.isRequired,
  className: string,
  text: string.isRequired,
  target: string,
  small: bool,
};

CustomLink.defaultProps = {
  className: '',
  target: '_blank',
  small: false,
};
