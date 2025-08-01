import axios from 'axios';

export const getUsers = () => {
    return axios.get('/users', {
        params: {
            limit: 1000
        }
    });
};

export const createUser = ({ firstName, lastName }) => {
    return axios.post('/users', {
        firstName,
        lastName
    });
};

export const deleteUser = (userId) => {
    return axios.delete(`/users/${userId}`);
};

export const updateUser = ({ userId, firstName, lastName }) => {
    console.log("update");
    const f = document.getElementById("firstName");
    const l = document.getElementById("lastName");
    console.log(f.value);
    console.log(l.value);
    console.log(userId);
    return axios.put(`/users/${userId}`, {

        firstName,
        lastName
    });
};
