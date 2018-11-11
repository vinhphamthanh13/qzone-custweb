import React from 'react';
import Grid from '@material-ui/core/Grid';
import Content from 'components/common/Content';
import ImageGridList from 'components/common/ImageGridList';
import Dog from 'images/dog.png';
import '../Organisation.scss';

const sectionClasses = {
  title: {
    root: 'organisation-page__title header2 text-bold',
  },
  content: {
    root: 'organisation-page__content',
  },
  button: {
    root: 'organisation-page__button bg-mako ghost-white',
  },
};

const imageList = [
  { name: 'dog0', src: Dog },
  { name: 'dog1', src: Dog },
  { name: 'dog2', src: Dog },
  { name: 'dog3', src: Dog },
];

const Section1 = () => {
  const title = 'Expert care for your furry, feathery, or scaley friend';
  const content = 'Lorem ipsum is placeholder text commonly used in the graphic, print,'
    + ' and publishing industries for previewing layouts and visual mockups.'
    + 'Lorem ipsum is placeholder text commonly used in the graphic, print,'
    + ' and publishing industries for previewing layouts and visual mockups.'
    + 'Lorem ipsum is placeholder text commonly used in the graphic, print,'
    + ' and publishing industries for previewing layouts and visual mockups.';
  return (
    <React.Fragment>
      <Grid container justify="space-evenly">
        <Content
          subTitle={title}
          subTitleClass={sectionClasses.title}
          content={content}
          contentClass={sectionClasses.content}
          buttonLabel="Subscribe now"
          buttonClass={sectionClasses.button}
        />
        <ImageGridList imageList={imageList} />
      </Grid>
    </React.Fragment>
  );
};

export default Section1;
