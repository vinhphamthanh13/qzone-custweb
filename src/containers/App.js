import React from 'react';
import 'styles/_typography.scss';
import './App.scss';
import logo from '../images/logo.svg';

const App = () => (
  <div className="app">
    <div className="card">
      <header>
        <img src={logo} alt="logo" />
        <p className="card__title header1 bold">Happy CustWeb 1</p>
      </header>
    </div>
  </div>
);

export default App;
