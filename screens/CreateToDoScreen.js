import React, { Component } from 'react';
import { View, Text, AsyncStorage } from 'react-native';
import { Input, Card, Overlay, Button } from 'react-native-elements';

import { deviceWidth, scaleFactor, deviceHeight } from '../data';

import { connect } from 'react-redux';
import * as actions from '../actions';

class CreateToDoScreen extends Component {
    static navigationOptions = {
        headerTitleStyle: {
            fontFamily: 'Kanit-Regular'
        },
        title: 'CREATE'
    };
    state = { title: '', detail: '', isVisible: false, id: null };

    fetchData = async (collection) => {
        await this.props.GetData(collection);
    }

    async componentDidMount() {
        let token = await AsyncStorage.getItem('fb_token');
        if (token) {
            const response = await fetch(
                `https://graph.facebook.com/me?access_token=${token}&fields=id,name,picture.type(large)`
            );
            let { id } = await response.json();
            this.setState({ id });
        }
    }

    componentWillReceiveProps(nextProps) {
        this.onCreateDataComplete(nextProps);
    }

    onCreateDataComplete(props) {
        if (props.createResponse) {
            console.log(props.createResponse);
        }
    }

    render() {
        const { textStyle, modalStyle } = styles;
        return (
            <View>
                <Card title="Create Todo">
                    <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Input
                            placeholder='Title'
                            inputStyle={textStyle}
                            onChangeText={(title) => this.setState({ title })}
                            value={this.state.title}
                        />
                        <View style={{ marginTop: deviceHeight / 50 }}></View>
                        <Input
                            placeholder='Detail'
                            inputStyle={textStyle}
                            onChangeText={(detail) => this.setState({ detail })}
                            value={this.state.detail}
                        />
                        <View style={{ marginTop: deviceHeight / 25 }}></View>
                        <Button
                            disabled={(this.state.title !== '') ? false : true}
                            buttonStyle={{ width: deviceWidth / 4, backgroundColor: '#448AFF' }}
                            titleStyle={textStyle}
                            title="SUBMIT"
                            raised
                            onPress={async () => { this.setState({ isVisible: true }); }}
                        />
                    </View>
                </Card>
                <Overlay isVisible={this.state.isVisible} height={deviceHeight / 4}>
                    <View style={{ justifyContent: 'space-around', flex: 1 }}>
                        <Text style={modalStyle}>CREATE THIS TODO?</Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
                            <Button
                                buttonStyle={{ width: deviceWidth / 4, backgroundColor: '#448AFF' }}
                                titleStyle={textStyle}
                                title="OK"
                                raised
                                onPress={async () => { await this.props.CreateData(`ExpoSimpleApp_${this.state.id}`, { title: this.state.title, detail: this.state.detail }); await this.fetchData(`ExpoSimpleApp_${this.state.id}`); this.setState({ isVisible: false, title: '', detail: '' }); }}
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
            </View>
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
    }
};

function mapStateToProps({ create }) {
    return { createResponse: create.data };
}

export default connect(mapStateToProps, actions)(CreateToDoScreen);