import React from 'react';
import Grid from '@material-ui/core/Grid';
import Content from 'components/common/Content';
import ImageGridList from 'components/common/ImageGridList';
import Dragon from 'images/dragon.jpeg';
import '../Organisation.scss';

const sectionClasses = {
  title: {
    root: 'org-page__title header2 text-bold',
  },
  content: {
    root: 'org-page__section-2__content',
  },
  button: {
    root: 'org-page__button bg-mako ghost-white',
  },
  imageGrid: {
    root: '',
    tile: '',
  },
};

const imageList = [
  { id: 0, name: 'dog0', src: Dragon },
  { id: 1, name: 'dog1', src: Dragon },
  { id: 2, name: 'dog2', src: Dragon },
  { id: 3, name: 'dog3', src: Dragon },
];

const Section2 = () => {
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
        <ImageGridList imageList={imageList} colx2={1} />
      </Grid>
    </React.Fragment>
  );
};

export default Section2;
