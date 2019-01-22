import React from 'react';
import Grid from '@material-ui/core/Grid';
import Content from 'components/Content';
import ImageGridList from 'components/ImageGridList';
import PetCare from 'images/petcare.png';
import styles from '../Organisation.module.scss';

const sectionClasses = {
  title: {
    root: [styles.title, 'header2', 'text-bold'].join(' '),
  },
  content: {
    root: styles.content,
  },
  button: {
    root: [styles.button, 'bg-mako', 'ghost-white'].join(' '),
  },
  paragraph: styles.paragraph,
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
