export const Types = {
    GET_USERS_REQUEST: 'users/get_users_request',
    GET_USERS_SUCCESS: 'users/get_users_success',
    DELETE_USER_REQUEST: 'users/delete_user_request',
    CREATE_USER_REQUEST: 'users/create_user_request',
    // update
    UPDATE_USER_REQUEST: 'users/update_user_request',
    USERS_ERROR: 'users/user_error',
    // account
    GET_ACCOUNTS_REQUEST: 'users/get_accounts_request',
    GET_ACCOUNT_REQUEST: 'users/get_account_request',
    GET_ACCOUNT_SUCCESS: 'users/get_account_success',
    DELETE_ACCOUNT_REQUEST: 'users/delete_account_request',
    CREATE_ACCOUNT_REQUEST: 'users/create_account_request',
    // search
    SEARCH_USERS_REQUEST: 'users/search_users_request',
    SEARCH_USERS_SUCCESS: 'users/search_users_success',
    SEARCH_USERS_ERROR: 'users/search_users_error',
    // phân trang
    GET_USERS_PAGE_REQUEST: 'users/get_users_page_request',
    GET_USERS_PAGE_SUCCESS: 'users/get_users_page_success',
};

export const getUsersRequest = () => ({
    type: Types.GET_USERS_REQUEST
});

export const getUsersSuccess = ({ items }) => ({
    type: Types.GET_USERS_SUCCESS,
    payload: {
        items
    }
});
export const getUsersPageRequest = ({ page, pageSize }) => ({
    type: Types.GET_USERS_PAGE_REQUEST,
    payload: {
        page,
        pageSize
    }
});
export const getUsersPageSuccess = ({ items, page, pageSize, total, totalPages }) => ({
    type: Types.GET_USERS_PAGE_SUCCESS,
    payload: {
        items,
        page,
        pageSize,
        total,
        totalPages
    }
});
// export const createUserRequest = ({ firstName, lastName }) => ({
//     type: Types.CREATE_USER_REQUEST,
//     payload: {
//         firstName,
//         lastName
//     }
// });
export const createUserRequest = ({ fullName, email, userName, password, roleId, phone, image }) => ({
    type: Types.CREATE_USER_REQUEST,
    payload: {
        fullName,
        email,
        userName,
        password,
        roleId,
        phone,
        image
    }
});
export const deleteUserRequest = (userId) => ({
    type: Types.DELETE_USER_REQUEST,
    payload: {
        userId
    }
});
export const updateUserRequest = ({ userId, fullName, email, userName, password, roleId, phone, image }) => ({
    type: Types.UPDATE_USER_REQUEST,
    payload: {
        userId,
        fullName,
        email,
        userName,
        password,
        roleId,
        phone,
        image
    }
});


export const usersError = ({ error }) => ({
    type: Types.USERS_ERROR,
    payload: {
        error
    }
});


