import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import './CustomLink.scss';

export default function CustomLink({ text, className, ...linkProps }) {
  return (
    <Link className={`custom-link ${className}`} {...linkProps}>{text}</Link>
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
