import React, { Component } from 'react';
import { View, Image, Text } from 'react-native';
import { deviceWidth, scaleFactor } from '../data';

class AvatarCard extends Component {
    render() {
        const { picture, name, description } = this.props;
        return (<View style={[styles.containerStyle, this.props.style]}>
            <Image
                style={styles.profileStyle.imageStyle}
                source={{ uri: String(picture) }}
            />
            <View style={{ alignItems: 'center', alignSelf: 'center' }}>
                <Text style={styles.profileStyle.textStyle.name}>{name}</Text>
                <Text style={styles.profileStyle.textStyle.description}>{description}</Text>
            </View>
        </View>);
    };
};

const profileImageWidth = deviceWidth * 25 / 100;

const styles = {
    containerStyle: {
        flexDirection: 'row',
        justifyContent: "space-evenly",
        backgroundColor: '#FFF',
        borderWidth: 0.5,
        borderRadius: 10,
        borderColor: '#DDD',
        borderBottomWidth: 0,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
        marginTop: profileImageWidth / 8,
        marginLeft: profileImageWidth / 8,
        marginRight: profileImageWidth / 8
    },
    profileStyle: {
        imageStyle: {
            marginTop: profileImageWidth / 8,
            marginBottom: profileImageWidth / 8,
            width: profileImageWidth,
            height: profileImageWidth,
            borderRadius: profileImageWidth / 2,
            alignSelf: 'center'
        },
        textStyle: {
            name: {
                fontFamily: 'Kanit-Regular',
                fontSize: 20 * scaleFactor,
                color: "#000000EE"
            },
            description: {
                fontFamily: 'Kanit-Regular',
                fontSize: 15 * scaleFactor,
                color: "#000000AA"
            }
        }
    }
};

export { AvatarCard };
