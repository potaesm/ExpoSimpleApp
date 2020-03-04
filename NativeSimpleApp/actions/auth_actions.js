import { AsyncStorage } from 'react-native';
import * as Facebook from 'expo-facebook';

import { FACEBOOK_LOGIN_SUCCESS, FACEBOOK_LOGIN_FAIL } from './types';

// How to use AsyncStorage:
// AsyncStorage.setItem('fb_token', token);
// AsyncStorage.getItem('fb_token');

export const facebookLogin = () => async (dispatch) => {
    let token = await AsyncStorage.getItem('fb_token');
    if (token) {
        // Dispatch an action saying FB login is done
        dispatch({ type: FACEBOOK_LOGIN_SUCCESS, payload: token });
    } else {
        // Start up FB Login process
        doFacebookLogin(dispatch);
    }
};

const doFacebookLogin = async (dispatch) => {
    await Facebook.initializeAsync('557309914994019');
    let { type, token, expires } = await Facebook.logInWithReadPermissionsAsync({ permissions: ['public_profile'] });
    if (type === 'success') {
        await AsyncStorage.setItem('fb_token', token);
        await AsyncStorage.setItem('fb_token_expires', String(expires));
        return dispatch({ type: FACEBOOK_LOGIN_SUCCESS, payload: token });
    }
    if (type === 'cancel') {
        return dispatch({ type: FACEBOOK_LOGIN_FAIL });
    }
};
