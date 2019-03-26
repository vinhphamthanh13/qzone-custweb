import React from 'react';
import { string, bool } from 'prop-types';
import { Link } from 'react-router-dom';
import styles from './CustomLink.module.scss';

export default function CustomLink({
  text, className, small, big, ...linkProps
}) {
  const mixedStyle = small ? `${styles.customLink} ${styles.small} ${className}` : `${styles.customLink} ${className}`;
  const linkStyle = big ? `${mixedStyle} ${styles.big}` : mixedStyle;
  return (
    <Link className={linkStyle} {...linkProps}>{text}</Link>
  );
}

CustomLink.propTypes = {
  to: string.isRequired,
  className: string,
  text: string.isRequired,
  target: string,
  small: bool,
  big: bool,
};

CustomLink.defaultProps = {
  className: '',
  target: '_blank',
  small: false,
  big: false,
};
