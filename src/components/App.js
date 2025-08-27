import React, { Component } from 'react';
import NewUserForm from './NewUserForm';
import UserList from './UserList';
import AddEditUserForm from './Add_Edit_UserForm';
import { connect } from 'react-redux';
import {
    getUsersRequest, createUserRequest, getUsersPageRequest, deleteUserRequest, updateUserRequest, usersError
} from '../actions/users';

import 'antd/dist/reset.css'; // nếu dùng AntD v5
import * as api from '../api/users';
// import { Alert } from 'reactstrap';
import { Alert, Modal, Layout, Breadcrumb, Button, message } from "antd"; // thêm message

import Sidebar from "./Sidebar";
import HeaderUserInfo from "./HeaderUserInfo";
import SearchUserForm from "./SearchUserForm";
import { PlusOutlined } from "@ant-design/icons";


const { Content } = Layout;

const Str_Update = "Update";
const Str_Create = "Create";
// let DATA_LIST_USERS = [];

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editingUser: null,
        };
    }
    async fetchEditingUser() {
        const params = new URLSearchParams(window.location.search);
        const userId = params.get('id');
        if (userId) {
            const response = await api.getUser(userId);
            return response.data;
        }
        return null;
    }
    // componentDidMount() {// tránh lỗi khi reset lại trang là lỗi ui
    async componentDidMount() {
        const params = new URLSearchParams(window.location.search);
        const page = parseInt(params.get("page"), 10) || 1;
        const pageSize = parseInt(params.get("pageSize"), 10) || 5;
        const name = params.get("name") || "";
        const phone = params.get("phone") || "";
        console.log("Fetching users with:", { page, pageSize, name, phone });
        this.props.getUsersPageRequest({ page, pageSize, name, phone });
        if (window.location.pathname === "/") {
            window.history.pushState({}, "", "/users");
            this.forceUpdate();
        }
        // Nếu đang ở /user-edit thì lấy dữ liệu user
        if (window.location.pathname === "/user-edit") {
            const editingUser = await this.fetchEditingUser();
            this.setState({ editingUser });
        }
    }
    // ...existing code...
    handlePageChange = (page, pageSize) => {
        const params = new URLSearchParams(window.location.search);
        const name = params.get("name") || "";
        const phone = params.get("phone") || "";
        this.props.getUsersPageRequest({ page, pageSize, name, phone });
    };
    // ...existing code...
    async componentDidUpdate(prevProps) {
        // Nếu chuyển sang /user-edit thì lấy lại dữ liệu user
        if (window.location.pathname === "/user-edit" && !this.state.editingUser) {
            const editingUser = await this.fetchEditingUser();
            this.setState({ editingUser });
        }
    }

    handleDeleteUserSubmit = (userID) => {
        this.props.deleteUserRequest(userID);
    };

    handleCloseAlert = () => {
        this.props.usersError({
            error: ''
        });
    };
    handleResetEditMode = () => {
        this.setState({ editingUser: null });
        document.getElementById('button').innerText = Str_Create;
    };


    handleSearchSubmit = async (searchTerm) => {
        this.props.searchUsersRequest(searchTerm);  // dispatch action search
        console.log("searchTerm in App.js", searchTerm);
    };
    // handleSearch
    // ...existing code...
    handleSearch = (searchTerm) => {
        console.log("Tìm kiếm với:", searchTerm);

        // 1️⃣ Lấy toàn bộ URL param hiện tại
        const params = new URLSearchParams(window.location.search);

        // 2️⃣ Cập nhật/ghi đè param mới
        if (searchTerm.name) {
            params.set("name", searchTerm.name);
        } else {
            params.delete("name");
        }
        if (searchTerm.phone) {
            params.set("phone", searchTerm.phone);
        } else {
            params.delete("phone");
        }
        // 👉 Luôn về trang đầu khi search
        params.set("page", 1);

        // 3️⃣ Cập nhật lại URL (không reload trang)
        window.history.pushState({}, "", `${window.location.pathname}?${params.toString()}`);

        // 4️⃣ Gọi action lấy dữ liệu mới với param tìm kiếm
        const page = parseInt(params.get("page"), 10) || 1;
        const pageSize = parseInt(params.get("pageSize"), 10) || 5;
        const name = params.get("name") || "";
        const phone = params.get("phone") || "";
        const number = 1;
        console.log("Fetching users with:", { number, pageSize, name, phone });
        this.props.getUsersPageRequest({ number, pageSize, name, phone });
    };
    // ...existing code...


    // ...existing code...
    handleResetSearch = () => {
        // Xóa param name & phone khỏi URL
        const params = new URLSearchParams(window.location.search);
        params.delete("name");
        params.delete("phone");

        const page = parseInt(params.get("page"), 10) || 1;
        const pageSize = parseInt(params.get("pageSize"), 10) || 5;

        const newUrl = `${window.location.pathname}?page=${page}&pageSize=${pageSize}`;
        window.history.pushState({}, "", newUrl);

        // Gọi lại danh sách không filter
        this.props.getUsersPageRequest({ page, pageSize });
    };
    // ...existing code...

    // ...existing code...
    handleCreateUserSubmit = (userData) => {
        this.props.createUserRequest(userData);
        // Lấy lại các param filter (loại bỏ id nếu có)
        const params = new URLSearchParams(window.location.search);
        params.delete("id");
        const queryString = params.toString();
        window.history.pushState({}, "", "/users" + (queryString ? "?" + queryString : ""));
        this.forceUpdate();
    };
    // ...existing code...
    handleEditUserSubmit = (userData) => {
        const params = new URLSearchParams(window.location.search);
        const userId = params.get("id");
        const data = { userId, ...userData };
        this.props.updateUserRequest(data);
        message.success("Cập nhật người dùng thành công!");
        // Quay lại /users, loại bỏ id, giữ lại các filter
        params.delete("id");
        window.history.pushState({}, "", `/users?${params.toString()}`);

        
        this.forceUpdate();
    };

    handleCancelUserForm = () => {
        // Quay lại /users, loại bỏ id, giữ lại các filter
        const params = new URLSearchParams(window.location.search);
        params.delete("id");
        window.history.pushState({}, "", `/users?${params.toString()}`);
        this.forceUpdate();
    };

    onClickEditUser = (userData) => {
        // Giữ lại các param filter khi chuyển sang user-edit
        const params = new URLSearchParams(window.location.search);
        params.set("id", userData.userId);
        window.history.pushState({}, "", `/user-edit?${params.toString()}`);
        this.forceUpdate();
    };
    renderContent = () => {
        const path = window.location.pathname;
        const users = this.props.users;
        // DATA_LIST_USERS = users.items || [];
        // console.log(DATA_LIST_USERS);

        switch (path) {
            case "/users":

                // Lấy dữ liệu để render: nếu đang filter thì dùng filteredUsers, nếu chưa thì dùng toàn bộ users.items
                const usersToRender = this.state.filteredUsers || (this.props.users.items || []);
                // Lấy giá trị filter từ URL
                const params = new URLSearchParams(window.location.search);
                const filterName = params.get("name") || "";
                const filterPhone = params.get("phone") || "";
                console.log("Filter from URL:", { filterName, filterPhone });

                return (
                    <>
                        <Breadcrumb>
                            <Breadcrumb.Item>
                                <span style={{ color: "#1890ff" }}>Trang chủ</span>
                            </Breadcrumb.Item>
                            <Breadcrumb.Item>
                                <span style={{ color: "#000" }}>Người dùng</span>
                            </Breadcrumb.Item>
                        </Breadcrumb>

                        <SearchUserForm
                            onSearch={this.handleSearch}
                            onReset={this.handleResetSearch}
                            initialName={filterName}
                            initialPhone={filterPhone}
                        />
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            style={{
                                marginBottom: '16px',
                                float: 'right',      // đưa sang bên phải
                                marginRight: '10px'  // cách lề phải 10px
                            }}
                            onClick={() => {
                                // Lấy lại các param filter hiện tại
                                const params = new URLSearchParams(window.location.search);
                                // Xóa id nếu có (chỉ giữ filter)
                                params.delete("id");
                                const queryString = params.toString();
                                window.history.pushState({}, "", "/user-add" + (queryString ? "?" + queryString : ""));
                                this.forceUpdate();
                            }}
                        >
                            Thêm người dùng
                        </Button>


                        <div style={{ marginTop: '100px' }}></div>
                        {!!this.props.users.error && (
                            <Alert
                                message={this.props.users.error}
                                type="error"
                                showIcon
                                closable
                                onClose={this.handleCloseAlert}
                                style={{ marginBottom: '16px' }}
                            />
                        )}

                        {!!usersToRender.length && (
                            <UserList
                                onDeleteUserClick={this.handleDeleteUserSubmit}
                                onEditUserClick={this.onClickEditUser}
                                users={usersToRender}
                                currentPage={this.props.users.page}   // <-- cái này từ redux
                                onPageChange={this.handlePageChange}
                                pageSize={this.props.users.pageSize}
                                total={this.props.users.total}
                                totalPages={this.props.users.totalPages}
                            />

                        )}
                    </>
                );

            case "/user-add":
                return (
                    <>
                        <Breadcrumb>
                            <Breadcrumb.Item>
                                <span style={{ color: "#1890ff" }}>Trang chủ</span>
                            </Breadcrumb.Item>
                            <Breadcrumb.Item>
                                <span style={{ color: "#1890ff" }}>Người Dùng</span>
                            </Breadcrumb.Item>
                            <Breadcrumb.Item>
                                <span style={{ color: "#000" }}>Thêm người dùng</span>
                            </Breadcrumb.Item>
                        </Breadcrumb>

                        <AddEditUserForm
                            onAdd_or_UpdateUser={this.handleCreateUserSubmit} // 👈 sửa lại prop này
                            onCancel={this.handleCancelUserForm}
                        />

                    </>
                );
            case "/user-edit":

                return (
                    <>
                        <Breadcrumb>
                            <Breadcrumb.Item>
                                <span style={{ color: "#1890ff" }}>Trang chủ</span>
                            </Breadcrumb.Item>
                            <Breadcrumb.Item>
                                <span style={{ color: "#1890ff" }}>Người Dùng</span>
                            </Breadcrumb.Item>
                            <Breadcrumb.Item>
                                <span style={{ color: "#000" }}>Sửa người dùng</span>
                            </Breadcrumb.Item>
                        </Breadcrumb>

                        <AddEditUserForm
                            onAdd_or_UpdateUser={this.handleEditUserSubmit}
                            initialValues={this.state.editingUser}
                            onCancel={this.handleCancelUserForm}
                        />

                    </>
                );

            case "/system":
                return <h2>Trang hệ thống</h2>;

            default:
                return (
                    <>
                        <Breadcrumb>
                            <Breadcrumb.Item>
                                <span style={{ color: "#1890ff" }}>Trang chủ</span>
                            </Breadcrumb.Item>
                            <Breadcrumb.Item>
                                <span style={{ color: "#000" }}>Người dùng</span>
                            </Breadcrumb.Item>
                        </Breadcrumb>






                    </>
                );
        }
    };

    render() {

        return (
            <>
                {/* <Layout style={{ minHeight: "100vh", background: "#f0f2f5" }}>  👈 xám nhạt */}
                <Layout style={{ minHeight: "100vh", background: "#000" }}>  {/* 👈 đen */}


                    <Sidebar />
                    <Layout style={{ padding: "16px" }}>
                        <HeaderUserInfo />
                        <Content style={{ background: "#fff", padding: 24, minHeight: 280 }}>

                            {this.renderContent()}
                        </Content>
                    </Layout>
                </Layout>


            </>
        );
    }
}

export default connect(({ users }) => ({ users }), {
    getUsersRequest,
    getUsersPageRequest,
    createUserRequest,
    deleteUserRequest,
    updateUserRequest,

    usersError,

})(App);


