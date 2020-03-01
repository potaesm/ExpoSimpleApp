import { GET_DATA_SUCCESS, GET_DATA_FAIL } from '../actions/types';

export default function (state = {}, action) {
    switch (action.type) {
        case GET_DATA_SUCCESS:
            return ({ data: action.payload });
        case GET_DATA_FAIL:
            return { data: [] };
        default:
            return state;
    }
}
