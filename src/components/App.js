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
        this.props.getUsersPageRequest({ page, pageSize });
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
    handlePageChange = (page, pageSize) => {
        this.props.getUsersPageRequest({ page, pageSize });
    };
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
    // update
    // handleEditUserClick = async ({ userId }) => {

    //     const data_userId = await api.getUser(userId);
    //     document.getElementById('button').innerText = Str_Update;
    //     this.setState({
    //         editingUser: {
    //             userId,
    //             firstName: data_userId.data.firstName,
    //             lastName: data_userId.data.lastName,
    //         }
    //     });
    // };


    // update
    // handleUpdateUserSubmit = async ({ userId, firstName, lastName }) => {
    //     this.props.updateUserRequest({
    //         userId,
    //         firstName,
    //         lastName
    //     });
    //     // Reset form
    //     this.setState({
    //         editingUser: null
    //     });
    // };

    handleSearchSubmit = async (searchTerm) => {
        this.props.searchUsersRequest(searchTerm);  // dispatch action search
        console.log("searchTerm in App.js", searchTerm);
    };
    // handleSearch
    handleSearch = (searchTerm) => {
        console.log("Tìm kiếm với:", searchTerm);
        // Lấy danh sách users từ props
        const usersList = this.props.users.items || [];
        // Lọc danh sách theo name và/hoặc phone
        const filteredUsers = usersList.filter(u => {
            const fullName = `${u.fullName}`.toLowerCase();
            const matchName = !searchTerm.name || fullName.includes(searchTerm.name.toLowerCase());
            // Nếu có phone, thêm điều kiện filter (giả sử u.phone tồn tại)
            const matchPhone = !searchTerm.phone || (u.phone && u.phone.includes(searchTerm.phone));
            return matchName && matchPhone;
        });
        // Lưu kết quả lọc vào state
        console.log("filteredUsers:", filteredUsers);
        //  DATA_LIST_USERS = filteredUsers;
        this.setState({ filteredUsers });
    };

    handleResetSearch = () => {
        // Reset danh sách về ban đầu
        this.setState({ filteredUsers: this.props.users.items || [] });
    };
    // Thêm hàm này vào class App:
    handleCreateUserSubmit = (userData) => {
        // userData là object nhận từ AddUserForm
        this.props.createUserRequest(userData);
        // Lấy lại query cũ từ URL
        const query = window.location.search;
        window.history.pushState({}, "", "/users" + query);

        this.forceUpdate(); // ép render lại App
        // Sau khi tạo xong có thể chuyển hướng về /users
        //        window.location.href = "/users";
    };
    handleEditUserSubmit = (userData) => {
        console.log("Editing user with data:", userData);
        const userId = new URLSearchParams(window.location.search).get("id");
        // thêm userId và form userData
        const data = { userId, ...userData };
        console.log("Data sent to updateUserRequest:", data);
        // lây id ở url

        this.props.updateUserRequest(data);

        message.success("Cập nhật người dùng thành công!"); // thêm thông báo antd là thành công
        // Lấy lại query cũ từ URL
        const query = window.location.search;
        window.history.pushState({}, "", "/users" + query);

        this.forceUpdate(); // ép render lại App 
    };
    onClickEditUser = (userData) => {
        window.history.pushState({}, "", `/user-edit?id=${userData.userId}`);
        this.forceUpdate();
    };
    handleCancelUserForm = () => {
         const query = window.location.search;
        window.history.pushState({}, "", "/users" + query);

        this.forceUpdate(); // ép render lại App 
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
                                window.history.pushState({}, "", "/user-add");
                                this.forceUpdate(); // ép render lại
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


