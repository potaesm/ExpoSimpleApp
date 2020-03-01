import React, { Component } from 'react';
import { View, Text } from 'react-native';
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
    state = { title: '', detail: '', isVisible: false };

    fetchData = async (collection) => {
        await this.props.GetData(collection);
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
                            onChangeText={(title) => this.setState({ title })}
                            value={this.state.title}
                        />
                        <View style={{ marginTop: deviceHeight / 50 }}></View>
                        <Input
                            placeholder='Detail'
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
                                onPress={async () => { await this.props.CreateData('ToDoData', { title: this.state.title, detail: this.state.detail }); await this.fetchData('ToDoData'); this.setState({ isVisible: false, title: '', detail: '' }); }}
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