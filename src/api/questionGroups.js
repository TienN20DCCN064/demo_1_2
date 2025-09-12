import axios from 'axios';
const API_BASE = '/questionGroups';

// Lấy danh sách nhóm câu hỏi theo phân trang và tìm kiếm
export const getQuestionGroupsPage = ({ page, pageSize, groupName }) => {
    const reponse = axios.get(`${API_BASE}/paging`, {
        params: { page, pageSize, groupName }
    });
    console.log('reponse', reponse);
    return reponse;
};

// // Lấy toàn bộ nhóm câu hỏi
// export const getQuestionGroups = () => {
//     return axios.get(`${API_BASE}`, {
//         params: { limit: 1000 }
//     });
// };

// Lấy 1 nhóm câu hỏi
export const getQuestionGroup = (groupId) => {
    return axios.get(`${API_BASE}/${groupId}`);
};

// Tạo nhóm câu hỏi mới
export const createQuestionGroup = ({ name, data }) => {
    return axios.post(`${API_BASE}`, { name, data });
};

// Cập nhật nhóm câu hỏi
export const updateQuestionGroup = ({ groupId, name, data }) => {
    return axios.put(`${API_BASE}/${groupId}`, { name, data });
};

// Xóa nhóm câu hỏi
export const deleteQuestionGroup = (groupId) => {
    return axios.delete(`${API_BASE}/${groupId}`);
};

// Thêm câu hỏi vào nhóm
export const addQuestionToGroup = ({ groupId, type, item, answers }) => {
    return axios.post(`${API_BASE}/${groupId}/items`, { type, item, answers });
};

// Cập nhật câu hỏi trong nhóm
export const updateQuestionInGroup = ({ groupId, index, type, item, answers }) => {
    return axios.put(`${API_BASE}/${groupId}/items/${index}`, { type, item, answers });
};

// Xóa câu hỏi trong nhóm
export const deleteQuestionInGroup = ({ groupId, index }) => {
    return axios.delete(`${API_BASE}/${groupId}/items/${index}`);
};
