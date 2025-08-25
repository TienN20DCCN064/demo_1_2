import axios from 'axios';



export const getUsers = () => {
    return axios.get('/users', {
        params: {
            limit: 1000
        }
    });
};
export const getUser = (userId) => {
    return axios.get(`/users/${userId}`);
};

// Tạo user mới
export const createUser = ({ fullName, email, userName, password, roleId, phone }) => {
    console.log("create user", fullName, email, userName, password, roleId, phone);
    return axios.post('/users', {
        fullName,
        email,
        userName,
        password,
        roleId,
        phone
    });
};


export const deleteUser = (userId) => {
    return axios.delete(`/users/${userId}`);
};

// Cập nhật user
export const updateUser = ({ userId, fullName, email, userName, password, roleId, phone }) => {
    console.log("update user", userId);
    return axios.put(`/users/${userId}`, {
        fullName,
        email,
        userName,
        password,
        roleId,
        phone
    });
};
