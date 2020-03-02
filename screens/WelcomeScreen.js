import _ from 'lodash';
import React, { Component } from 'react';
import { SafeAreaView, Text, AsyncStorage, YellowBox } from 'react-native';
import { AppLoading } from 'expo';
import { SocialIcon } from 'react-native-elements';

import moment from 'moment';
import 'moment/locale/th';

import { deviceWidth, scaleFactor, deviceHeight } from '../data';

YellowBox.ignoreWarnings(['componentWillReceiveProps']);
const _console = _.clone(console);
console.warn = message => {
    if (message.indexOf('componentWillReceiveProps') <= -1) {
        _console.warn(message);
    }
};

class WelcomeScreen extends Component {
    state = { token: null, notification: null }

    async componentDidMount() {
        let token = await AsyncStorage.getItem('fb_token');
        let expires = await AsyncStorage.getItem('fb_token_expires');
        let currentDate = moment().format('X');

        console.log(currentDate, expires);

        if (token) {
            this.props.navigation.navigate('main');
            this.setState({ token });
        } else {
            this.setState({ token: false });
        }
    }

    render() {
        if (_.isNull(this.state.token)) {
            return <AppLoading />;
        }

        const { viewStyle, textStyle, buttonStyle } = styles;

        return (
            <SafeAreaView style={viewStyle}>
                <Text style={textStyle}>Simple Todo App</Text>
                <SocialIcon
                    title='เข้าสู่ระบบด้วย Facebook'
                    button
                    type='facebook'
                    style={buttonStyle}
                    fontFamily='Kanit-Regular'
                    onPress={() => this.props.navigation.navigate('auth')}
                />
            </SafeAreaView>
        );
    }
}

const styles = {
    viewStyle: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    textStyle: {
        fontFamily: 'Kanit-Regular',
        fontSize: 20 * scaleFactor,
    },
    buttonStyle: {
        width: deviceWidth * 60 / 100,
        marginTop: deviceHeight * 5 / 100
    }
};

export default WelcomeScreen;
