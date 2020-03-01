import { combineReducers } from 'redux';
import auth from './auth_reducer';
import get from './get_reducer';
import del from './delete_reducer';
import create from './create_reducer';
import edit from './edit_reducer';
import getUser from './get_user_reducer';
import sendNoti from './send_noti_reducer';

export default combineReducers({ auth, get, del, create, edit, getUser, sendNoti });
