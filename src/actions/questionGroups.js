export const Types = {
    GET_QUESTION_GROUPS_PAGE_REQUEST: "questionGroups/get_question_groups_page_request",
    GET_QUESTION_GROUPS_PAGE_SUCCESS: "questionGroups/get_question_groups_page_success",

    CREATE_QUESTION_GROUP_REQUEST: "questionGroups/create_question_group_request",
    CREATE_QUESTION_GROUP_SUCCESS: "questionGroups/create_question_group_success",
    CREATE_QUESTION_GROUP_ERROR: "questionGroups/create_question_group_error",

    UPDATE_QUESTION_GROUP_REQUEST: "questionGroups/update_question_group_request",
    UPDATE_QUESTION_GROUP_SUCCESS: "questionGroups/update_question_group_success",
    UPDATE_QUESTION_GROUP_ERROR: "questionGroups/update_question_group_error",

    DELETE_QUESTION_GROUP_REQUEST: "questionGroups/delete_question_group_request",
    DELETE_QUESTION_GROUP_SUCCESS: "questionGroups/delete_question_group_success",
    DELETE_QUESTION_GROUP_ERROR: "questionGroups/delete_question_group_error",

    QUESTION_GROUPS_ERROR: "questionGroups/error",
};

// Pagination
export const getQuestionGroupsPageRequest = ({ page, pageSize, groupName = "" }) => ({
    type: Types.GET_QUESTION_GROUPS_PAGE_REQUEST,
    payload: { page, pageSize, groupName }
});

export const getQuestionGroupsPageSuccess = ({ items, page, pageSize, total, totalPages }) => ({
    type: Types.GET_QUESTION_GROUPS_PAGE_SUCCESS,
    payload: { items, page, pageSize, total, totalPages }
});

// Create
export const createQuestionGroupRequest = ({ name, data }) => ({
    type: Types.CREATE_QUESTION_GROUP_REQUEST,
    payload: { name, data }
});
export const createQuestionGroupSuccess = (group) => ({
    type: Types.CREATE_QUESTION_GROUP_SUCCESS,
    payload: group
});

// Update
export const updateQuestionGroupRequest = ({ groupId, name, data }) => ({
    type: Types.UPDATE_QUESTION_GROUP_REQUEST,
    payload: { groupId, name, data }
});
export const updateQuestionGroupSuccess = (group) => ({
    type: Types.UPDATE_QUESTION_GROUP_SUCCESS,
    payload: group
});

// Delete
export const deleteQuestionGroupRequest = (groupId) => ({
    type: Types.DELETE_QUESTION_GROUP_REQUEST,
    payload: { groupId }
});
export const deleteQuestionGroupSuccess = (groupId) => ({
    type: Types.DELETE_QUESTION_GROUP_SUCCESS,
    payload: { groupId }
});

// Error
export const questionGroupsError = (error) => ({
    type: Types.QUESTION_GROUPS_ERROR,
    payload: { error }
});
