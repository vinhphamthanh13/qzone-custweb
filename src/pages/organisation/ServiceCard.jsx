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
  container: {
    justifyContent: 'center',
  },
  card: {
    display: 'flex',
  },
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
  tile: {
    height: 'auto',
    width: '92%',
    margin: '1em',
  },
  button: {
    margin: '1em auto',
    borderRadius: '3em',
  },
  gridList: {
    overflow: 'unset',
    margin: 'auto',
  },
});

const ServiceCard = (props) => {
  const { classes, cardList } = props;
  const cards = cardList.length > 1
    ? cardList.map(card => (
      <GridListTile classes={classes}>
        <Card className={classes.card}>
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
    <Grid container xs={8} className={classes.container}>
      <Grid item>
        <Typography
          align="center"
          component="h4"
          variant="h4"
          className={classes.header}
          color="textPrimary"
          gutterBottom
        >
          Pets (and their humans) love us
        </Typography>
        <GridList cellHeight="auto" className={classes.gridList}>
          {cards}
        </GridList>
      </Grid>
      <Grid item>
        <Button variant="contained" className={classes.button}>We care of it</Button>
      </Grid>
    </Grid>
  );
};

ServiceCard.propTypes = {
  classes: PropTypes.objectOf(PropTypes.object).isRequired,
  cardList: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default withStyles(styles)(ServiceCard);
