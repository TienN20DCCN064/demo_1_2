import { Types } from "../actions/role";

const initialState = {
    items: [],
    loading: false,
    error: null,
    page: 1,
    pageSize: 10,
    total: 0,
};

export default function roles(state = initialState, action) {
    switch (action.type) {
        case Types.GET_ROLES_REQUEST:
            return { ...state, loading: true, error: null };
        case Types.GET_ROLES_SUCCESS:
            return {
                ...state,
                loading: false,
                items: action.payload.items,
                page: action.payload.page,
                pageSize: action.payload.pageSize,
                total: action.payload.total
            };
        case Types.GET_ROLES_ERROR:
            return { ...state, loading: false, error: action.payload.error };
        // ===== LẤY DANH SÁCH ROLE PHÂN TRANG =====
        case Types.GET_ROLES_PAGE_REQUEST:
            return { ...state, loading: true, error: null };
        case Types.GET_ROLES_PAGE_SUCCESS:
            return {
                ...state,
                loading: false,
                items: action.payload.items,
                page: action.payload.page,
                pageSize: action.payload.pageSize,
                total: action.payload.total,
            };
        case Types.GET_ROLES_PAGE_ERROR:
            return { ...state, loading: false, error: action.payload.error };
        // ===== XỬ LÝ DELETE ROLE =====
        case Types.DELETE_ROLES_REQUEST:
            return { ...state, loading: true, error: null };
        case Types.DELETE_ROLES_SUCCESS:
            return {
                ...state,
                loading: false,
                items: state.items.filter(role => role.id !== action.payload.roleId),
                total: state.total > 0 ? state.total - 1 : 0 // 👈 giảm total
            };
        case Types.DELETE_ROLES_ERROR:
            return { ...state, loading: false, error: action.payload.error };

        default:
            return state;
    }
}
