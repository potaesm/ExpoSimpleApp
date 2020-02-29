import React, { Component } from 'react';
import * as Font from 'expo-font';
import AppContainer from './AppContainer';

import { Provider } from 'react-redux';
import store from './store';


export default class App extends Component {
  state = {
    fontLoaded: false,
  };
  async componentDidMount() {
    await Font.loadAsync({
      'Kanit-Regular': require('./assets/fonts/Kanit-Regular.ttf'),
    });
    this.setState({ fontLoaded: true });
  }
  render() {
    return (
      this.state.fontLoaded ? (
        <Provider store={store}>
          <AppContainer />
        </Provider>
      ) : null
    );
  }
}
