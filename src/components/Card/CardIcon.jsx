import React from 'react';
import classNames from 'classnames';
import withStyles from '@material-ui/core/styles/withStyles';
import cardIconStyle from './CardIcon.style';

function CardIcon({ ...props }) {
  const {
    classes, className, children, color, ...rest
  } = props;
  const cardIconClasses = classNames({
    [classes.cardIcon]: true,
    [classes[`${color}CardHeader`]]: color,
    [className]: className !== undefined,
  });
  return (
    <div className={cardIconClasses} {...rest}>
      {children}
    </div>
  );
}

CardIcon.defaultProps = {
  className: undefined,
  color: undefined,
};

export default withStyles(cardIconStyle)(CardIcon);
