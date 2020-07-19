/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */
import { Provider } from 'react-redux';
import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { reducer } from "./javascript/Redux/Reducers";
const reactNavigation = require('react-navigation');
import thunk from 'redux-thunk';
import LoginActivity from "./javascript/Components/LoginActivity";
import MainActivity from "./javascript/Components/MainActivity";
import { LoadingActivity } from "./javascript/Components/LoadingActivity";
import { firebaseConfig } from "./javascript/Firebase/FirebaseConfig";
import {apps, initializeApp} from 'firebase';
import { createStore, applyMiddleware } from 'redux';

if (!apps.length) {
  initializeApp(firebaseConfig);
}

const store = createStore(reducer, applyMiddleware(thunk));

const appSwitchNav = reactNavigation.createSwitchNavigator({
  LoadingScreen: LoadingActivity,
  LoginScreen: LoginActivity,
  MainScreen: MainActivity
});

const AppNavigator = reactNavigation.createAppContainer(appSwitchNav);


function App() {

  return (
    <Provider store={store}>
      <AppNavigator></AppNavigator>
    </Provider>
  );
}


export default App;
