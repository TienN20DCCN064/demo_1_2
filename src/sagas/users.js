import { takeEvery, takeLatest, take, call, put, fork } from 'redux-saga/effects';
import * as actions from '../actions/users';
import * as api from '../api/users';

function* getUsers() {
    try {
        const result = yield call(api.getUsers);
        yield put(actions.getUsersSuccess({
            items: result.data.data
        }));
    } catch (e) {
        yield put(actions.usersError({
            error: 'An error occurred when trying to get the users'
        }));
    }
}

function* watchGetUsersRequest() {
    yield takeEvery(actions.Types.GET_USERS_REQUEST, getUsers);
}

function* deleteUser(userId) {
    try {
        yield call(api.deleteUser, userId);

        yield call(getUsers);
    } catch (e) {
        yield put(actions.usersError({
            error: 'An error occurred when trying to delete the user'
        }));
    }
}

function* watchDeleteUserRequest() {
    while (true) {
        const { payload } = yield take(actions.Types.DELETE_USER_REQUEST);
        yield call(deleteUser, payload.userId);
    }
}

function* createUser({ payload }) {
    console.log("payload");
    try {
        yield call(api.createUser, {
            fullName: payload.fullName,
            email: payload.email,
            userName: payload.userName,
            password: payload.password,
            roleId: payload.roleId,
            phone: payload.phone,
            image: payload.image
        });
        yield call(getUsers);
    } catch (e) {
        yield put(actions.usersError({
            error: 'An error occurred when trying to create the user'
        }));
    }
}

function* watchCreateUserRequest() {
    yield takeLatest(actions.Types.CREATE_USER_REQUEST, createUser);
}






function* updateUser({ payload }) {
    console.log("payload");
    console.log(payload);
    try {
        yield call(api.updateUser, {
            userId: payload.userId,
            fullName: payload.fullName,
            email: payload.email,
            userName: payload.userName,
            password: payload.password,
            roleId: payload.roleId,
            phone: payload.phone,
            image: payload.image
        });

        yield call(getUsers);

    } catch (e) {
        yield put(actions.usersError({
            error: 'An error occurred when trying to create the user'
        }));
    }
}

function* watchUpdateUserRequest() {
    yield takeLatest(actions.Types.UPDATE_USER_REQUEST, updateUser);
}

const userSagas = [
    fork(watchGetUsersRequest),
    fork(watchDeleteUserRequest),
    fork(watchCreateUserRequest),
    fork(watchUpdateUserRequest)
    // fork(watchUpdateUserRequest)
];

export default userSagas;