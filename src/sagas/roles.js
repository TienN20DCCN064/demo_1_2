import { call, put, takeLatest } from "redux-saga/effects";
import {
  Types,
  getRolesSuccess,
  getRolesError,
  deleteRoleSuccess,
  deleteRoleError,
  getRolesPageSuccess,
  getRolesPageError,
} from "../actions/role";
import * as api from "../api/role";

function* fetchRoles() {
  try {
    const result = yield call(api.getRoles);
    yield put(getRolesSuccess({ items: result.data.data })); // API trả { data: roles }
  } catch (e) {
    yield put(getRolesError(e.message));
  }
}
function* fetchRolesPage(action) {
  try {
    const { page, pageSize, nameRole } = action.payload;
    const result = yield call(api.getRolesPage, { page, pageSize, nameRole });
    console.log("Saga fetched roles page:", result.data);
    yield put(getRolesPageSuccess({
      items: result.data.data,
      total: result.data.total,
      page,
      pageSize,
    }));
  } catch (e) {
    yield put(getRolesPageError(e.message));
  }
}
// Xóa role
function* removeRole(action) {
  try {
    yield call(api.deleteRole, action.payload.roleId);
    yield put(deleteRoleSuccess(action.payload.roleId));

    // Tùy chọn: reload danh sách roles từ server
    const result = yield call(api.getRoles);
    yield put(getRolesSuccess({ items: result.data.data }));
  } catch (e) {
    yield put(deleteRoleError(e.message));
  }
}

export default function* rolesSaga() {
  yield takeLatest(Types.GET_ROLES_REQUEST, fetchRoles);
  yield takeLatest(Types.DELETE_ROLES_REQUEST, removeRole);
  yield takeLatest(Types.GET_ROLES_PAGE_REQUEST, fetchRolesPage);
}
