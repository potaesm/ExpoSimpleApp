import { GET_USER_DATA_SUCCESS, GET_USER_DATA_FAIL } from '../actions/types';

export default function (state = {}, action) {
    switch (action.type) {
        case GET_USER_DATA_SUCCESS:
            return ({ data: action.payload });
        case GET_USER_DATA_FAIL:
            return { data: [] };
        default:
            return state;
    }
}
