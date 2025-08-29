import axios from 'axios';

const API_BASE = '/roles';

// Lấy tất cả roles
export const getRoles = () => {
    return axios.get(API_BASE);
};

// Lấy 1 role theo id
export const getRole = (roleId) => {
    return axios.get(`${API_BASE}/${roleId}`);
};

// Tạo mới role với mo_ta và permissions mặc định 0
export const createRole_1 = ({ id, name, mo_ta }) => {
    return axios.post(API_BASE, { id, name, mo_ta });
};
export const createRole = async ({ id, name, mo_ta, permissions }) => {
    try {
        // Bước 1: tạo role mới
        const responsePost = await createRole_1({ id, name, mo_ta });
        const createdRole = responsePost.data;

        // Bước 2: cập nhật permissions
        const responsePut = await updateRole({
            id: createdRole.id,
            name: createdRole.name,
            mo_ta: createdRole.mo_ta,
            permissions
        });

        return responsePut.data; // trả về role đã cập nhật
    } catch (error) {
        console.error(error);
        throw error;
    }
};


// Cập nhật role (có thể chỉnh sửa name, mo_ta, permissions)
export const updateRole = ({ id, name, mo_ta, permissions }) => {
    return axios.put(`${API_BASE}/${id}`, { name, mo_ta, permissions });
};

// Xóa role
export const deleteRole = (roleId) => {
    return axios.delete(`${API_BASE}/${roleId}`);
};

export const getRolesPage = ({ page, pageSize, nameRole }) => {
    const response = axios.get(`${API_BASE}/page`, {
        params: { page, pageSize, nameRole }
    });
    return response;
};