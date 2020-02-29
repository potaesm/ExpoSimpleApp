import React, { Component } from 'react';
import { BackHandler, AsyncStorage, SafeAreaView, ScrollView, Text, View, RefreshControl } from 'react-native';
import { AvatarCard } from '../components';

import { deviceWidth, scaleFactor, deviceHeight } from '../data';
import { ListItem, Card, Overlay, Button } from 'react-native-elements';
import { GetData, DeleteData } from '../services';

class HomeScreen extends Component {
    static navigationOptions = {
        headerTitleStyle: {
            fontFamily: 'Kanit-Regular'
        },
        title: 'HOME'
    };
    state = { picture: null, name: null, id: null, todoList: [], isVisible: false, selectedItem: null, refreshing: false };

    fetchData = async () => {
        this.setState({ todoList: await GetData('ToDoData') });
    }

    _onRefresh = () => {
        this.setState({ refreshing: true });
        this.fetchData().then(() => {
            this.setState({ refreshing: false });
        });
    }

    async componentDidMount() {
        await this.fetchData();
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

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    }

    handleBackButton() {
        return true;
    }

    onListItemPress(title) {
        console.log(`${title} is Pressed`);
    }

    render() {
        const { viewStyle, textStyle, buttonStyle, modalStyle } = styles;

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
                                    title={item.title}
                                    titleStyle={textStyle}
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
                                    onPress={async () => { await DeleteData('ToDoData', this.state.selectedItem); this.setState({ isVisible: false }); this.setState({ todoList: await GetData('ToDoData') }); }}
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
    viewStyle: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    modalStyle: {
        textAlign: 'center',
        fontFamily: 'Kanit-Regular',
        fontSize: 18 * scaleFactor,
    },
    textStyle: {
        fontFamily: 'Kanit-Regular',
        fontSize: 16 * scaleFactor,
    },
    buttonStyle: {
        width: deviceWidth * 60 / 100,
        marginTop: deviceHeight * 5 / 100
    }
};

export default HomeScreen;