import {combineReducers} from 'redux';
import UsersReducer from './users';
import RolesReducer from "./roles";

export default combineReducers({
	users: UsersReducer,
	roles: RolesReducer
});