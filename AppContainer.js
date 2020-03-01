import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { Icon } from 'react-native-elements';

import WelcomeScreen from './screens/WelcomeScreen';
import AuthScreen from './screens/AuthScreen';
import HomeScreen from './screens/HomeScreen';
import EditToDoScreen from './screens/EditToDoScreen';
import CreateToDoScreen from './screens/CreateToDoScreen';

const HomeStack = createStackNavigator({ home: HomeScreen, edit: EditToDoScreen });
HomeStack.navigationOptions = {
    tabBarLabel: 'Home',
    tabBarIcon: ({ tintColor }) => <Icon name="home" size={25} color={tintColor} />
};

const CreateToDoStack = createStackNavigator({ create: CreateToDoScreen });
CreateToDoStack.navigationOptions = {
    tabBarLabel: 'Create',
    tabBarIcon: ({ tintColor }) => <Icon name="add" size={25} color={tintColor} />
};

const MainNavigator = createBottomTabNavigator({
    home: HomeStack,
    create: CreateToDoStack
},
    {
        tabBarOptions: { labelStyle: { fontFamily: 'Kanit-Regular', fontSize: 12 } }
    }
);

const AppContainerNavigator = createBottomTabNavigator({
    welcome: WelcomeScreen,
    auth: AuthScreen,
    main: MainNavigator
},
    {
        defaultNavigationOptions: { tabBarVisible: false }
    }
);

export default createAppContainer(AppContainerNavigator);