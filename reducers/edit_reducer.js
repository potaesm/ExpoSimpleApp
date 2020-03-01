import { EDIT_DATA_SUCCESS, EDIT_DATA_FAIL } from '../actions/types';

export default function (state = {}, action) {
    switch (action.type) {
        case EDIT_DATA_SUCCESS:
            return ({ data: action.payload });
        case EDIT_DATA_FAIL:
            return { data: null };
        default:
            return state;
    }
}
