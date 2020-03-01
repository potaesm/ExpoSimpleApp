import { DELETE_DATA_SUCCESS, DELETE_DATA_FAIL } from '../actions/types';

export default function (state = {}, action) {
    switch (action.type) {
        case DELETE_DATA_SUCCESS:
            return ({ data: action.payload });
        case DELETE_DATA_FAIL:
            return { data: null };
        default:
            return state;
    }
}
