// @flow
import React, { PureComponent } from 'react';
import './LoadingScreen.css';

export default class LoadingScreen extends PureComponent<{}, {}> {
  render() {
    return (
      <div className="LoadingScreen">
        <h2>Loading...</h2>
      </div>
    );
  }
}
