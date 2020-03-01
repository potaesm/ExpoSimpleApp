import { CREATE_DATA_SUCCESS, CREATE_DATA_FAIL } from './types';

export const CreateData = (collection, data) => async (dispatch) => {
    const URL = `https://asia-east2-simplecloudfirestoreapi.cloudfunctions.net/api?collection=${collection}&id=auto`;
    try {
        const response = await fetch(URL, {
            method: 'POST', headers: new Headers({ 'Content-Type': 'application/json' }), body: JSON.stringify(data)
        });
        const responseJson = await response.json();
        if (responseJson !== undefined) {
            return dispatch({ type: CREATE_DATA_SUCCESS, payload: responseJson });
        } else {
            return dispatch({ type: CREATE_DATA_FAIL });
        }
    }
    catch (Error) {
        console.log(Error);
    }
};
