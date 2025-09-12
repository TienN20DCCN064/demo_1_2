import {combineReducers} from 'redux';
import UsersReducer from './users';
import RolesReducer from "./roles";
import QuestionGroupsReducer from './questionGroups';

export default combineReducers({
	users: UsersReducer,
	roles: RolesReducer,
	questionGroups: QuestionGroupsReducer
});