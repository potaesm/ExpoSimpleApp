import { SEND_NOTI_SUCCESS, SEND_NOTI_FAIL } from './types';

export const sendNotification = (pushToken, title, body) => async (dispatch) => {
    const URL = `https://asia-east2-exponotificationserver.cloudfunctions.net/ExponentPushNotifications/pushNotification`;
    try {
        const response = await fetch(URL, {
            method: 'POST', headers: new Headers({ 'Content-Type': 'application/json' }), body: JSON.stringify({ pushToken, title, body })
        });
        const responseJson = await response.json();
        if (responseJson !== undefined) {
            return dispatch({ type: SEND_NOTI_SUCCESS, payload: responseJson });
        } else {
            return dispatch({ type: SEND_NOTI_FAIL });
        }
    }
    catch (Error) {
        console.log(Error);
    }
};
