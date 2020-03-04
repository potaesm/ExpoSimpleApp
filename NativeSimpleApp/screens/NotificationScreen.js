import React, { Component } from 'react';
import { View, SafeAreaView, ScrollView, RefreshControl } from 'react-native';
import { Input, Card, Button, ListItem } from 'react-native-elements';

import { deviceWidth, scaleFactor, deviceHeight } from '../data';

import { connect } from 'react-redux';
import * as actions from '../actions';


class NotificationScreen extends Component {
    static navigationOptions = {
        headerTitleStyle: {
            fontFamily: 'Kanit-Regular'
        },
        title: 'NOTIFICATION',
    };
    state = { title: '', body: '', userList: [], selectedExponentPushToken: '', refreshing: false };

    async componentDidMount() {
        await this.fetchData();
    }

    fetchData = async () => {
        await this.props.GetUserListData();
    }

    _onRefresh = () => {
        this.setState({ refreshing: true });
        this.fetchData().then(() => {
            this.setState({ refreshing: false });
        });
    }

    componentWillReceiveProps(nextProps) {
        this.onGetUserListDataComplete(nextProps);
        this.onSendNotiComplete(nextProps);
    }

    onGetUserListDataComplete(props) {
        if (props.userData) {
            this.setState({ userList: props.userData });
        }
    }

    onSendNotiComplete(props) {
        if (props.notiResponse) {
            console.log(props.notiResponse);
        }
    }

    render() {
        const { textStyle, detailStyle } = styles;
        return (
            <SafeAreaView>
                <ScrollView style={{ height: '100%' }} refreshControl={
                    <RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={this._onRefresh}
                    />
                }>
                    <Card title="USER LIST">
                        {
                            this.state.userList.map((item, i) => (
                                <ListItem
                                    key={i}
                                    title={item.User.name}
                                    titleStyle={textStyle}
                                    subtitle={item.User.id}
                                    subtitleStyle={detailStyle}
                                    leftAvatar={{ source: { uri: item.User.picture } }}
                                    bottomDivider
                                    onPress={() => this.setState({ selectedExponentPushToken: item.ExponentPushToken })}
                                />
                            ))
                        }
                    </Card>
                    <Card title="SEND NOTIFICATION">
                        <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Input
                                placeholder='Exponent Push Token'
                                inputStyle={textStyle}
                                onChangeText={(token) => this.setState({ token })}
                                value={this.state.selectedExponentPushToken}
                            />
                            <View style={{ marginTop: deviceHeight / 50 }}></View>
                            <Input
                                placeholder='Title'
                                inputStyle={textStyle}
                                onChangeText={(title) => this.setState({ title })}
                                value={this.state.title}
                            />
                            <View style={{ marginTop: deviceHeight / 50 }}></View>
                            <Input
                                placeholder='Body'
                                inputStyle={textStyle}
                                onChangeText={(body) => this.setState({ body })}
                                value={this.state.body}
                            />
                            <View style={{ marginTop: deviceHeight / 25 }}></View>
                            <Button
                                disabled={(this.state.selectedExponentPushToken !== '') ? false : true}
                                buttonStyle={{ width: deviceWidth / 4, backgroundColor: '#448AFF' }}
                                titleStyle={textStyle}
                                title="SUBMIT"
                                raised
                                onPress={async () => { await this.props.sendNotification(this.state.selectedExponentPushToken, this.state.title, this.state.body); this.setState({ title: '', body: '', selectedExponentPushToken: '' }); }}
                            />
                        </View>
                    </Card>
                </ScrollView>
            </SafeAreaView>
        );
    }
}

const styles = {
    textStyle: {
        fontFamily: 'Kanit-Regular',
        fontSize: 16 * scaleFactor,
    },
    detailStyle: {
        fontFamily: 'Kanit-Regular',
        fontSize: 14 * scaleFactor,
        color: '#7D7D7D'
    }
};

function mapStateToProps({ sendNoti, getUser }) {
    return { notiResponse: sendNoti.data, userData: getUser.data };
}

export default connect(mapStateToProps, actions)(NotificationScreen);