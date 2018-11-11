import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

const styles = theme => ({
  header: {
    fontWeight: '500',
    color: `${theme.palette.primary.contrastText}`,
    marginBottom: '1em',
  },
  image: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
  },
  button: {
    margin: '1em auto',
    borderRadius: '3em',
    display: 'flex',
  },
  gridList: {
    overflow: 'unset',
    margin: 'auto',
  },
});

const ServiceCard = (props) => {
  const { classes, cardList, serviceClass } = props;
  const cards = cardList.length > 1
    ? cardList.map(card => (
      <GridListTile classes={serviceClass.gridListTile} key={card.name}>
        <Card classes={serviceClass.card}>
          <div className={classes.image}>
            <img src={card.src} alt={card.name} width="100%" />
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
          classes={serviceClass.title}
          color="textPrimary"
          gutterBottom
        >
          Pets (and their humans) love us
        </Typography>
        <GridList cellHeight="auto" classes={serviceClass.gridList}>
          {cards}
        </GridList>
        <Button variant="contained" className={classes.button}>We care of it</Button>
      </Grid>
    </Grid>
  );
};

ServiceCard.propTypes = {
  classes: PropTypes.objectOf(PropTypes.string).isRequired,
  cardList: PropTypes.arrayOf(PropTypes.object).isRequired,
  serviceClass: PropTypes.objectOf(PropTypes.object).isRequired,
};

export default withStyles(styles)(ServiceCard);
