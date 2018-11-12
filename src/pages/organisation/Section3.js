import React from 'react';
import Grid from '@material-ui/core/Grid';
import Content from 'components/common/Content';
import ImageGridList from 'components/common/ImageGridList';
import PetCare from 'images/petcare.png';
import '../Organisation.scss';

const sectionClasses = {
  title: {
    root: 'org-page__section-2__title header2 text-bold',
  },
  content: {
    root: 'org-page__section-2__content',
  },
  button: {
    root: 'org-page__button bg-mako ghost-white',
  },
  paragraph: 'org-page__section-3__paragraph',
};

const imageList = [
  { id: 0, name: 'dog0', src: PetCare },
];

const Section3 = () => {
  const title = 'Services tailored to your needs';
  const content = 'Lorem ipsum is placeholder text commonly used in the graphic, print,'
    + ' and publishing industries for previewing layouts and visual mockups.'
    + 'Lorem ipsum is placeholder text commonly used in the graphic, print,'
    + ' and publishing industries for previewing layouts and visual mockups.'
    + 'Lorem ipsum is placeholder text commonly used in the graphic, print,'
    + ' and publishing industries for previewing layouts and visual mockups.';
  return (
    <React.Fragment>
      <Grid container>
        <ImageGridList imageList={imageList} colx2={0.5} />
        <Content
          subTitle={title}
          subTitleClass={sectionClasses.title}
          content={content}
          contentClass={sectionClasses.content}
          buttonLabel="Subscribe now"
          buttonClass={sectionClasses.button}
          paragraphClass={sectionClasses.paragraph}
        />
      </Grid>
    </React.Fragment>
  );
};

export default Section3;
