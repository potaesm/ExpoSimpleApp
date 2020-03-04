import { GET_USER_DATA_SUCCESS, GET_USER_DATA_FAIL } from './types';

export const GetUserListData = () => async (dispatch) => {
    const URL = `https://asia-east2-exponotificationserver.cloudfunctions.net/ExponentPushNotifications/showExponentPushTokens`;
    try {
        let dataArray = [];
        const response = await fetch(URL, { method: 'GET', headers: new Headers({ 'Content-Type': 'application/json' }) });
        const responseJson = await response.json();
        for (const item of responseJson) {
            await dataArray.push(item);
        }
        if (dataArray.length !== 0) {
            return dispatch({ type: GET_USER_DATA_SUCCESS, payload: dataArray });
        } else {
            return dispatch({ type: GET_USER_DATA_FAIL });
        }

    }
    catch (Error) {
        console.log(Error);
    }
};
