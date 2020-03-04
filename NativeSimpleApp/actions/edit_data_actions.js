import { EDIT_DATA_SUCCESS, EDIT_DATA_FAIL } from './types';

export const EditData = (collection, id, data) => async (dispatch) => {
    const URL = `https://asia-east2-simplecloudfirestoreapi.cloudfunctions.net/api?collection=${collection}&id=${id}`;
    try {
        const response = await fetch(URL, {
            method: 'POST', headers: new Headers({ 'Content-Type': 'application/json' }), body: JSON.stringify(data)
        });
        const responseJson = await response.json();
        if (responseJson !== undefined) {
            return dispatch({ type: EDIT_DATA_SUCCESS, payload: responseJson });
        } else {
            return dispatch({ type: EDIT_DATA_FAIL });
        }
    }
    catch (Error) {
        console.log(Error);
    }
};
