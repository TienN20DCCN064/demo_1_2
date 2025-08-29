import userSagas from './users';
import rolesSaga from "./roles";

import {all} from 'redux-saga/effects';

export default function* rootSaga(){
	yield all([
		...userSagas,
		rolesSaga()
	]);
}