import { Types } from '../actions/users';

const INITIAL_STATE = {
    items: []
};

export default function users(state = INITIAL_STATE, action) {
    switch (action.type) {
        case Types.GET_USERS_SUCCESS: {
            return {
                ...state,
                items: action.payload.items
            }
        }
        case Types.USERS_ERROR: {
            return {
                ...state,
                error: action.payload.error
            }
        }
        case Types.GET_USERS_PAGE_SUCCESS: {
            return {
                ...state,
                items: action.payload.items,
                page: action.payload.page,
                pageSize: action.payload.pageSize,
                total: action.payload.total,
                totalPages: action.payload.totalPages
            }
        }

        default: {
            return state;
        }
    }
}