import userSagas from './users';
import rolesSaga from "./roles";
import questionGroupsSaga from './questionGroupsSaga';

import { all } from 'redux-saga/effects';

export default function* rootSaga() {
	yield all([
		...userSagas,
		...questionGroupsSaga,
		rolesSaga(),

	]);
}