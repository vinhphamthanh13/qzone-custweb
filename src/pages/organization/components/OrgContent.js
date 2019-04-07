import React from 'react';
import { string, object, oneOfType } from 'prop-types';
import { Typography } from '@material-ui/core';
import s from './OrgContent.module.scss';

// eslint-disable-next-line
const textTemp = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.";

const OrgContent = (props) => {
  const { description, qualification, bgImage } = props;
  return (
    <div className={s.content}>
      <div className={s.contentDescription}>
        <img src={bgImage} alt={description} className="full-width" />
        <div className={s.contentQuotes}>
          <Typography variant="h2" color="inherit" className="text-bold">
            {qualification}
          </Typography>
        </div>
      </div>
      <div className={s.introDesc}>
        <Typography variant="title" color="inherit" className="text-bold">
          {description} {textTemp}
        </Typography>
      </div>
    </div>
  );
};

OrgContent.propTypes = {
  description: string,
  qualification: string,
  bgImage: oneOfType([object, string]).isRequired,
};

OrgContent.defaultProps = {
  description: '',
};

OrgContent.defaultProps = {
  qualification: 'Our supreme qualifications',
};

export default OrgContent;
