import React from 'react';
import classNames from 'classnames';
import withStyles from '@material-ui/core/styles/withStyles';
import cardTextStyle from './CardText.style';

function CardText({ ...props }) {
  const {
    classes, className, children, color, ...rest
  } = props;
  const cardTextClasses = classNames({
    [classes.cardText]: true,
    [classes[`${color}CardHeader`]]: color,
    [className]: className !== undefined,
  });
  return (
    <div className={cardTextClasses} {...rest}>
      {children}
    </div>
  );
}

CardText.defaultProps = {
  className: undefined,
  color: undefined,
};

export default withStyles(cardTextStyle)(CardText);
