import { combineReducers } from 'redux';
import auth from './auth_reducer';
import get from './get_reducers';
import del from './delete_reducers';
import create from './create_reducers';

export default combineReducers({ auth, get, del, create });
