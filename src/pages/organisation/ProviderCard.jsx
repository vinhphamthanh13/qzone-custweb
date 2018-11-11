import React from 'react';
import PropTypes from 'prop-types';
import Parser from 'html-react-parser';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';

const styles = theme => ({
  card: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  header: {
    fontWeight: 'bold',
    marginBottom: '1em',
  },
  image: {
    width: `${theme.spacing.unit}em`,
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
  },
  tile: {
    height: 'auto',
    width: '90%',
  },
  paragraph: {
    paddingBottom: '2em',
  },
  gridList: {
    marginLeft: '2em !important',
    textAlign: 'center',
  },
  avatar: {
    marginTop: '0.5em',
    width: 60,
    height: 60,
    background: 'rgba(0,0,0,0.4)',
  },
});

const ProviderCard = (props) => {
  const { classes, cardList } = props;
  const title = 'Affordable options<br />tailored your needs';
  const content = 'Lorem ipsum is placeholder text commonly used in the graphic, print,'
    + '<br/> and publishing industries for previewing layouts and visual mockups.';
  const cards = cardList.length > 1
    ? cardList.map(card => (
      <GridListTile className={classes.tile} key={card.id}>
        <Card className={classes.card}>
          <div className={classes.image}>
            <Avatar className={classes.avatar} src={card.src} />
          </div>
          <div>
            <CardContent>
              <Typography component="h6" variant="h6">{card.title}</Typography>
              <Typography variant="subtitle1" color="textSecondary">
                {card.content}
              </Typography>
            </CardContent>
          </div>
        </Card>
      </GridListTile>
    ))
    : null;
  return (
    <Grid container justify="center">
      <Grid item xs={8}>
        <Typography
          align="center"
          component="h4"
          variant="h4"
          className={classes.header}
          color="textPrimary"
          gutterBottom
        >
          {Parser(title)}
        </Typography>
        <Typography
          align="center"
          gutterBottom
          className={classes.paragraph}
        >
          {Parser(content)}
        </Typography>
        <GridList cellHeight="auto" cols={3} className={classes.gridList}>
          {cards}
        </GridList>
      </Grid>
    </Grid>
  );
};

ProviderCard.propTypes = {
  classes: PropTypes.objectOf(PropTypes.string).isRequired,
  cardList: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default withStyles(styles)(ProviderCard);
