import React, { Component } from 'react';
import { Text } from 'react-native';


class EditToDoScreen extends Component {
    static navigationOptions = {
        headerTitleStyle: {
            fontFamily: 'Kanit-Regular'
        },
        headerBackTitle: null,
        title: 'EDIT TODO',
    };
    render() {
        const { navigation } = this.props;
        const title = navigation.getParam('title', null);
        return (<Text>{title}</Text>);
    }
}

export default EditToDoScreen;