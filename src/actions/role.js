export const Types = {

  GET_ROLES_REQUEST: "users/get_roles_request",
  GET_ROLES_SUCCESS: "users/get_roles_success",
  GET_ROLES_ERROR: "users/get_roles_error",
  DELETE_ROLES_REQUEST: "users/delete_roles_request",
  DELETE_ROLES_SUCCESS: "users/delete_roles_success",
  DELETE_ROLES_ERROR: "users/delete_roles_error",
  //
  GET_ROLES_PAGE_REQUEST: "users/get_roles_page_request",
  GET_ROLES_PAGE_SUCCESS: "users/get_roles_page_success",
  GET_ROLES_PAGE_ERROR: "users/get_roles_page_error"
};

// ============ Roles ============
export const getRolesRequest = () => ({
  type: Types.GET_ROLES_REQUEST,
});

export const getRolesSuccess = ({ items }) => ({
  type: Types.GET_ROLES_SUCCESS,
  payload: { items },
});

export const getRolesError = (error) => ({
  type: Types.GET_ROLES_ERROR,
  payload: { error },
});
/// delete
export const deleteRoleRequest = (roleId) => ({
  type: Types.DELETE_ROLES_REQUEST,
  payload: { roleId },
});

export const deleteRoleSuccess = (roleId) => ({
  type: Types.DELETE_ROLES_SUCCESS,
  payload: { roleId },
});

export const deleteRoleError = (error) => ({
  type: Types.DELETE_ROLES_ERROR,
  payload: { error },
});

export const getRolesPageRequest = ({ page, pageSize, nameRole }) => ({
  type: Types.GET_ROLES_PAGE_REQUEST,
  payload: { page, pageSize, nameRole },
});

export const getRolesPageSuccess = ({ items, total }) => ({
  type: Types.GET_ROLES_PAGE_SUCCESS,
  payload: { items, total },
});

export const getRolesPageError = (error) => ({
  type: Types.GET_ROLES_PAGE_ERROR,
  payload: { error },
});