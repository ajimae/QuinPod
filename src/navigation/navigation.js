import React, { Component } from 'react';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import Player from '../components/Player/Player';
import Tracks from '../components/Tracks/Tracks';

const rootStack = createStackNavigator({
  Player,
  Tracks,
}, {
  initialRouteName: 'Tracks'
});

export default createAppContainer(rootStack);
