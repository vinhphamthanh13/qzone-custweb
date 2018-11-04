import React from 'react';
import { Card, CardContent, Divider } from '@material-ui/core';
import SimpleSearch from './home/SimpleSearch';
import AdvancedSearch from './home/AdvancedSearch';
import './Home.scss';

export default function Home() {
  return (
    <div className="home">
      <Card className="home__content">
        <CardContent>
          <SimpleSearch />
        </CardContent>
        <Divider />
        <CardContent>
          <AdvancedSearch />
        </CardContent>
      </Card>
    </div>
  );
}
