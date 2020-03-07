import _ from 'lodash';
import React, { Component } from 'react';
import { Notifications, AppLoading } from 'expo';
import { registerForPushNotificationsAsync } from '../services';
import { BackHandler, AsyncStorage, SafeAreaView, ScrollView, Text, View, RefreshControl, Alert } from 'react-native';
import { AvatarCard } from '../components';

import { deviceWidth, scaleFactor, deviceHeight } from '../data';
import { ListItem, Card, Overlay, Button } from 'react-native-elements';

import { connect } from 'react-redux';
import * as actions from '../actions';

import MqttService from '../services/mqtt_service';

class HomeScreen extends Component {
    static navigationOptions = {
        headerTitleStyle: {
            fontFamily: 'Kanit-Regular'
        },
        title: 'HOME'
    };
    state = { picture: null, name: null, id: null, todoList: [], isVisible: false, selectedItem: null, refreshing: false, brokerIsConnected: false, message: '', onMessage: false };

    fetchData = async (collection) => {
        await this.props.GetData(collection);
    }

    _onRefresh = () => {
        this.setState({ refreshing: true });
        this.fetchData(`ExpoSimpleApp_${this.state.id}`).then(() => {
            this.setState({ refreshing: false });
        });
    }

    async componentDidMount() {
        MqttService.connectClient(this.mqttSuccessHandler, this.mqttConnectionLostHandler);
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
        let token = await AsyncStorage.getItem('fb_token');
        if (token) {
            const response = await fetch(
                `https://graph.facebook.com/me?access_token=${token}&fields=id,name,picture.type(large)`
            );
            let { id, name, picture } = await response.json();
            this.setState({ picture: picture.data.url, name, id });

            // Notifications
            await registerForPushNotificationsAsync({ id, name, picture: picture.data.url });
            this._notificationSubscription = Notifications.addListener(this._handleNotification);

            await this.fetchData(`ExpoSimpleApp_${this.state.id}`);
        }
    }

    onMessage = (message) => {
        this.setState({ message });
        this.setState({ onMessage: true });
    }

    mqttSuccessHandler = () => {
        console.info("connected to mqtt");
        MqttService.subscribe('message', this.onMessage)
        this.setState({ brokerIsConnected: true });
    };

    mqttConnectionLostHandler = () => {
        this.setState({ brokerIsConnected: false });
    };

    _handleNotification = (notification) => {
        this.setState({ notification });
        if (this.state.notification.origin === 'received') {
            Alert.alert(
                this.state.notification.data.title,
                this.state.notification.data.body,
                [{ text: 'ตกลง' }]
            );
        }
    };

    componentWillReceiveProps(nextProps) {
        this.onGetDataComplete(nextProps);
        this.onDeleteDataComplete(nextProps);
    }

    onGetDataComplete(props) {
        if (props.todoData) {
            this.setState({ todoList: props.todoData });
        }
    }

    onDeleteDataComplete(props) {
        if (props.deleteResponse) {
            console.log(props.deleteResponse);
        }
    }

    componentWillUnmount() {
        MqttService.unsubscribe('message');
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    }

    handleBackButton() {
        return true;
    }

    render() {
        const { textStyle, modalStyle, detailStyle } = styles;

        if (_.isNull(this.state.picture)) {
            return <AppLoading />;
        }

        return (
            <SafeAreaView>
                <ScrollView style={{ height: '100%' }} refreshControl={
                    <RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={this._onRefresh}
                    />
                }>
                    <AvatarCard picture={this.state.picture} name={this.state.name} description={this.state.id} />
                    <Card title="MY TODO LIST">
                        {
                            this.state.todoList.map((item, i) => (
                                <ListItem
                                    key={i}
                                    title={((item.title).length > 25) ? ((item.title.substring(0, 25 - 3)) + '...') : item.title}
                                    titleStyle={textStyle}
                                    subtitle={(item.detail !== undefined && (item.detail).length > 25) ? ((item.detail.substring(0, 25 - 3)) + '...') : item.detail}
                                    subtitleStyle={detailStyle}
                                    bottomDivider
                                    chevron
                                    onPress={() => { this.props.navigation.navigate('edit', { title: item.title, detail: item.detail, itemId: item.id, userId: this.state.id }) }}
                                    onLongPress={() => { this.setState({ isVisible: true }); this.setState({ selectedItem: item.id }); }}
                                />
                            ))
                        }
                    </Card>
                    <Overlay isVisible={this.state.onMessage} height={deviceHeight / 4}>
                        <View style={{ justifyContent: 'space-around', flex: 1 }}>
                            <Text style={modalStyle}>{this.state.message}</Text>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
                                <Button
                                    buttonStyle={{ width: deviceWidth / 4, backgroundColor: '#448AFF' }}
                                    titleStyle={textStyle}
                                    title="OK"
                                    raised
                                    onPress={async () => { this.setState({ onMessage: false }); }}
                                />
                            </View>
                        </View>
                    </Overlay>
                    <Overlay isVisible={this.state.isVisible} height={deviceHeight / 4}>
                        <View style={{ justifyContent: 'space-around', flex: 1 }}>
                            <Text style={modalStyle}>DELETE THIS TODO?</Text>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
                                <Button
                                    buttonStyle={{ width: deviceWidth / 4, backgroundColor: '#448AFF' }}
                                    titleStyle={textStyle}
                                    title="OK"
                                    raised
                                    onPress={async () => { await this.props.DeleteData(`ExpoSimpleApp_${this.state.id}`, this.state.selectedItem); await this.fetchData(`ExpoSimpleApp_${this.state.id}`); this.setState({ isVisible: false }); }}
                                />
                                <Button
                                    buttonStyle={{ width: deviceWidth / 4, backgroundColor: '#FF5252' }}
                                    titleStyle={textStyle}
                                    title="CANCEL"
                                    raised
                                    onPress={() => this.setState({ isVisible: false })}
                                />
                            </View>
                        </View>
                    </Overlay>
                </ScrollView>
            </SafeAreaView >
        );
    }
}

const styles = {
    modalStyle: {
        textAlign: 'center',
        fontFamily: 'Kanit-Regular',
        fontSize: 18 * scaleFactor,
    },
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

function mapStateToProps({ get, del }) {
    return { todoData: get.data, deleteResponse: del.data };
}

export default connect(mapStateToProps, actions)(HomeScreen);