import React, { Component } from 'react';
import { BackHandler, AsyncStorage, SafeAreaView, ScrollView, Text, View, RefreshControl } from 'react-native';
import { AvatarCard } from '../components';

import { deviceWidth, scaleFactor, deviceHeight } from '../data';
import { ListItem, Card, Overlay, Button } from 'react-native-elements';

import { connect } from 'react-redux';
import * as actions from '../actions';

class HomeScreen extends Component {
    static navigationOptions = {
        headerTitleStyle: {
            fontFamily: 'Kanit-Regular'
        },
        title: 'HOME'
    };
    state = { picture: null, name: null, id: null, todoList: [], isVisible: false, selectedItem: null, refreshing: false };

    fetchData = async (collection) => {
        await this.props.GetData(collection);
    }

    _onRefresh = () => {
        this.setState({ refreshing: true });
        this.fetchData('ToDoData').then(() => {
            this.setState({ refreshing: false });
        });
    }

    async componentDidMount() {
        await this.fetchData('ToDoData');
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);

        let token = await AsyncStorage.getItem('fb_token');
        if (token) {
            const response = await fetch(
                `https://graph.facebook.com/me?access_token=${token}&fields=id,name,picture.type(large)`
            );
            let { id, name, picture } = await response.json();
            this.setState({ picture: picture.data.url, name, id });
        }
    }

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
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    }

    handleBackButton() {
        return true;
    }

    render() {
        const { textStyle, modalStyle, detailStyle } = styles;

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
                                    onPress={() => { this.props.navigation.navigate('edit', { title: item.title }) }}
                                    onLongPress={() => { this.setState({ isVisible: true }); this.setState({ selectedItem: item.id }); }}
                                />
                            ))
                        }
                    </Card>
                    <Overlay isVisible={this.state.isVisible} height={deviceHeight / 4}>
                        <View style={{ justifyContent: 'space-around', flex: 1 }}>
                            <Text style={modalStyle}>DELETE THIS TODO?</Text>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
                                <Button
                                    buttonStyle={{ width: deviceWidth / 4, backgroundColor: '#448AFF' }}
                                    titleStyle={textStyle}
                                    title="OK"
                                    raised
                                    onPress={async () => { await this.props.DeleteData('ToDoData', this.state.selectedItem); await this.fetchData('ToDoData'); this.setState({ isVisible: false }); }}
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