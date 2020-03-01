import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Input, Card, Overlay, Button } from 'react-native-elements';

import { deviceWidth, scaleFactor, deviceHeight } from '../data';

import { connect } from 'react-redux';
import * as actions from '../actions';


class EditToDoScreen extends Component {
    static navigationOptions = {
        headerTitleStyle: {
            fontFamily: 'Kanit-Regular'
        },
        headerBackTitle: null,
        title: 'EDIT',
    };
    state = { title: '', detail: '', isVisible: false };

    componentDidMount() {
        const { navigation } = this.props;
        this.setState({ title: navigation.getParam('title', null), detail: navigation.getParam('detail', null), itemId: this.props.navigation.getParam('itemId', null), userId: this.props.navigation.getParam('userId', null)});
    }

    fetchData = async (collection) => {
        await this.props.GetData(collection);
    }

    componentWillReceiveProps(nextProps) {
        this.onEditDataComplete(nextProps);
    }

    onEditDataComplete(props) {
        if (props.editResponse) {
            console.log(props.editResponse);
        }
    }

    render() {
        const { textStyle, modalStyle } = styles;
        return (
            <View>
                <Card title="Edit Todo">
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
                        <Text style={modalStyle}>EDIT THIS TODO?</Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
                            <Button
                                buttonStyle={{ width: deviceWidth / 4, backgroundColor: '#448AFF' }}
                                titleStyle={textStyle}
                                title="OK"
                                raised
                                onPress={async () => { await this.props.EditData(`ExpoSimpleApp_${this.state.userId}`, this.state.itemId, { title: this.state.title, detail: this.state.detail }); await this.fetchData(`ExpoSimpleApp_${this.state.userId}`); this.setState({ isVisible: false }); }}
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

function mapStateToProps({ edit }) {
    return { editResponse: edit.data };
}

export default connect(mapStateToProps, actions)(EditToDoScreen);