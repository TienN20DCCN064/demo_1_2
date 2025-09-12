import { takeEvery, takeLatest, take, call, put, fork } from 'redux-saga/effects';
import * as actions from '../actions/questionGroups';
import * as api from '../api/questionGroups';

function* getQuestionGroups_page({ payload }) {
    try {
        const result = yield call(api.getQuestionGroupsPage, payload);
        console.log('Saga fetched question groups page:', result.data);
        console.log('Saga fetched question groups page - payload:', payload);
        yield put(actions.getQuestionGroupsPageSuccess({
            items: result.data.data,
            page: result.data.page,
            pageSize: result.data.pageSize,
            total: result.data.total,
            totalPages: result.data.totalPages
        }));
    } catch (e) {
        yield put(actions.questionGroupsError({ error: 'An error occurred while fetching question groups' }));
    }
}

function* watchGetQuestionGroupsPageRequest() {
    yield takeEvery(actions.Types.GET_QUESTION_GROUPS_PAGE_REQUEST, getQuestionGroups_page);
}

function* createQuestionGroup({ payload }) {
    try {
        yield call(api.createQuestionGroup, payload);
        yield put(actions.getQuestionGroupsPageRequest({ page: 1, pageSize: 10 }));
    } catch (e) {
        yield put(actions.questionGroupsError({ error: 'An error occurred while creating the group' }));
    }
}

function* watchCreateQuestionGroupRequest() {
    yield takeLatest(actions.Types.CREATE_QUESTION_GROUP_REQUEST, createQuestionGroup);
}

function* updateQuestionGroup({ payload }) {
    try {
        yield call(api.updateQuestionGroup, payload);
        yield put(actions.getQuestionGroupsPageRequest({ page: 1, pageSize: 10 }));
    } catch (e) {
        yield put(actions.questionGroupsError({ error: 'An error occurred while updating the group' }));
    }
}

function* watchUpdateQuestionGroupRequest() {
    yield takeLatest(actions.Types.UPDATE_QUESTION_GROUP_REQUEST, updateQuestionGroup);
}

function* deleteQuestionGroup({ payload }) {
    try {
        yield call(api.deleteQuestionGroup, payload.groupId);
        yield put(actions.getQuestionGroupsPageRequest({ page: 1, pageSize: 10 }));
    } catch (e) {
        yield put(actions.questionGroupsError({ error: 'An error occurred while deleting the group' }));
    }
}

function* watchDeleteQuestionGroupRequest() {
    yield takeLatest(actions.Types.DELETE_QUESTION_GROUP_REQUEST, deleteQuestionGroup);
}

const questionGroupsSagas = [
    fork(watchGetQuestionGroupsPageRequest),
    fork(watchCreateQuestionGroupRequest),
    fork(watchUpdateQuestionGroupRequest),
    fork(watchDeleteQuestionGroupRequest)
];

export default questionGroupsSagas;
