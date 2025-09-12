import { Types } from '../actions/questionGroups';

const INITIAL_STATE = {
    items: [],
    loading: false,
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0
};

export default function questionGroups(state = INITIAL_STATE, action) {
    switch (action.type) {
        case Types.GET_QUESTION_GROUPS_PAGE_REQUEST:
        case Types.CREATE_QUESTION_GROUP_REQUEST:
        case Types.UPDATE_QUESTION_GROUP_REQUEST:
        case Types.DELETE_QUESTION_GROUP_REQUEST:
            return { ...state, loading: true };

        case Types.GET_QUESTION_GROUPS_PAGE_SUCCESS:
            return {
                ...state,
                items: action.payload.items,
                page: action.payload.page,
                pageSize: action.payload.pageSize,
                total: action.payload.total,
                totalPages: action.payload.totalPages,
                loading: false
            };

        case Types.CREATE_QUESTION_GROUP_SUCCESS:
        case Types.UPDATE_QUESTION_GROUP_SUCCESS:
        case Types.DELETE_QUESTION_GROUP_SUCCESS:
            return { ...state, loading: false };

        case Types.QUESTION_GROUPS_ERROR:
            return { ...state, error: action.payload.error, loading: false };

        default:
            return state;
    }
}
