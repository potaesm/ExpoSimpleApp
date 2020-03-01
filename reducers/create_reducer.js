import { CREATE_DATA_SUCCESS, CREATE_DATA_FAIL } from '../actions/types';

export default function (state = {}, action) {
    switch (action.type) {
        case CREATE_DATA_SUCCESS:
            return ({ data: action.payload });
        case CREATE_DATA_FAIL:
            return { data: null };
        default:
            return state;
    }
}
