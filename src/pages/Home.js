import React from 'react';
import { Card, CardContent, Grid } from '@material-ui/core';
import SimpleSearch from './home/SimpleSearch';
import AdvancedSearch from './home/AdvancedSearch';
import './Home.scss';

export default class Home extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      date: undefined,
      time: undefined,
      searchText: undefined,
      subCategory: undefined,
    };
  }

  onChange = (value, key) => {
    this.setState({ [key]: value });
  }

  onSubmit = () => {
    console.log(this.state);
  }

  render() {
    return (
      <Grid container className="home">
        <Grid item md={12} className="home__content">
          <Card>
            <CardContent>
              <SimpleSearch onChange={this.onChange} onSubmit={this.onSubmit} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item md={12}>
          <AdvancedSearch onChange={this.onChange} />
        </Grid>
      </Grid>
    );
  }
}
