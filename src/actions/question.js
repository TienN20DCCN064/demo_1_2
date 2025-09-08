// src/actions/questionGroups.js
export const Types = {
  GET_QUESTION_GROUPS_REQUEST: "questionGroups/get_request",
  GET_QUESTION_GROUPS_SUCCESS: "questionGroups/get_success",
  GET_QUESTION_GROUPS_ERROR: "questionGroups/get_error",

  DELETE_QUESTION_GROUP_REQUEST: "questionGroups/delete_request",
  DELETE_QUESTION_GROUP_SUCCESS: "questionGroups/delete_success",
  DELETE_QUESTION_GROUP_ERROR: "questionGroups/delete_error",

  GET_QUESTION_GROUPS_PAGE_REQUEST: "questionGroups/get_page_request",
  GET_QUESTION_GROUPS_PAGE_SUCCESS: "questionGroups/get_page_success",
  GET_QUESTION_GROUPS_PAGE_ERROR: "questionGroups/get_page_error",
};

// ============ Question Groups ============
export const getQuestionGroupsRequest = () => ({
  type: Types.GET_QUESTION_GROUPS_REQUEST,
});

export const getQuestionGroupsSuccess = ({ items }) => ({
  type: Types.GET_QUESTION_GROUPS_SUCCESS,
  payload: { items },
});

export const getQuestionGroupsError = (error) => ({
  type: Types.GET_QUESTION_GROUPS_ERROR,
  payload: { error },
});

// ============ Delete ============
export const deleteQuestionGroupRequest = (groupId) => ({
  type: Types.DELETE_QUESTION_GROUP_REQUEST,
  payload: { groupId },
});

export const deleteQuestionGroupSuccess = (groupId) => ({
  type: Types.DELETE_QUESTION_GROUP_SUCCESS,
  payload: { groupId },
});

export const deleteQuestionGroupError = (error) => ({
  type: Types.DELETE_QUESTION_GROUP_ERROR,
  payload: { error },
});

// ============ Paging ============
export const getQuestionGroupsPageRequest = ({ page, pageSize, name }) => ({
  type: Types.GET_QUESTION_GROUPS_PAGE_REQUEST,
  payload: { page, pageSize, name },
});

export const getQuestionGroupsPageSuccess = ({ items, total }) => ({
  type: Types.GET_QUESTION_GROUPS_PAGE_SUCCESS,
  payload: { items, total },
});

export const getQuestionGroupsPageError = (error) => ({
  type: Types.GET_QUESTION_GROUPS_PAGE_ERROR,
  payload: { error },
});
