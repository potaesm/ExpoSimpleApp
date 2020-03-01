import { DELETE_DATA_SUCCESS, DELETE_DATA_FAIL } from './types';

export const DeleteData = (collection, id) => async (dispatch) => {
    const URL = `https://asia-east2-simplecloudfirestoreapi.cloudfunctions.net/api?collection=${collection}&id=${id}`;
    try {
        const response = await fetch(URL, { method: 'DELETE', headers: new Headers({ 'Content-Type': 'application/json' }) });
        const responseJson = await response.json();
        if (responseJson !== undefined) {
            return dispatch({ type: DELETE_DATA_SUCCESS, payload: responseJson });
        } else {
            return dispatch({ type: DELETE_DATA_FAIL });
        }

    }
    catch (Error) {
        console.log(Error);
    }
};
