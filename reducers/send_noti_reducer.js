import { SEND_NOTI_SUCCESS, SEND_NOTI_FAIL } from '../actions/types';

export default function (state = {}, action) {
    switch (action.type) {
        case SEND_NOTI_SUCCESS:
            return ({ data: action.payload });
        case SEND_NOTI_FAIL:
            return { data: null };
        default:
            return state;
    }
}
