import React, { Component } from 'react';



import SearchUserForm from "./user/SearchUserForm";
import AddEditUserForm from './user/Add_Edit_UserForm';
import NewUserForm from './user/NewUserForm';
import UserList from './user/UserList';

import RoleList from './role/RoleList';
import AddEditRoleForm from './role/Add_Edit_RoleForm';
import SearchRoleForm from './role/SearchRoleForm';

import QuestionGroupList from './question/QuestionGroupList';
import QuestionGroupSearchBar from './question/SearchQuestion';
import AddEditQuestionGroup from './question/Add_Edit_Question_Group';

import { connect } from 'react-redux';
import {
    getUsersRequest, createUserRequest, getUsersPageRequest, deleteUserRequest, updateUserRequest, usersError,
} from '../actions/users';
import {
    getRolesRequest, getRolesSuccess, getRolesError, deleteRoleRequest, getRolesPageRequest
} from '../actions/role';
import {
    getQuestionGroupsPageRequest, getQuestionGroupsPageSuccess, createQuestionGroupRequest, createQuestionGroupSuccess, updateQuestionGroupRequest, updateQuestionGroupSuccess, deleteQuestionGroupRequest, deleteQuestionGroupSuccess, questionGroupsError
} from '../actions/questionGroups';

import 'antd/dist/reset.css'; // nếu dùng AntD v5
import '../style/App.css'; // import CSS chung

import * as api from '../api/users';
// import { Alert } from 'reactstrap';
import { Alert, Modal, Layout, Breadcrumb, Button, message, Spin } from "antd"; // thêm message

import Sidebar from "./Sidebar";
import HeaderUserInfo from "./HeaderUserInfo";

import { PlusOutlined } from "@ant-design/icons";
import LoadingOverlay from "./LoadingOverlay"; // import component vừa tạo



const { Content } = Layout;

const Str_Update = "Update";
const Str_Create = "Create";
// let DATA_LIST_USERS = [];

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editingUser: null,
            loading: false, // Thêm trạng thái loading
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
        this.setState({ loading: true });
        const params = new URLSearchParams(window.location.search);
        const page = parseInt(params.get("page"), 10) || 1;
        const pageSize = parseInt(params.get("pageSize"), 10) || 10;
        const name = params.get("name") || "";
        const phone = params.get("phone") || "";
        const groupName = params.get("groupName") || "";

        // Gọi action để lấy danh sách users
        await this.props.getUsersPageRequest({ page, pageSize, name, phone });

        // Xử lý URL hiện tại
        if (window.location.pathname === "/") {
            window.history.pushState({}, "", "/users");
        } else if (window.location.pathname === "/user-edit") {
            const editingUser = await this.fetchEditingUser();
            this.setState({ editingUser });
        } else if (window.location.pathname === "/role") {
            await this.props.getRolesRequest();
        }
        else if (window.location.pathname === "/list_question") {
            await this.props.getQuestionGroupsPageRequest({ page: 1, pageSize: 10, groupName });
        }

        this.setState({ loading: false });
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
        const pageSize = parseInt(params.get("pageSize"), 10) || 10;
        const name = params.get("name") || "";
        const phone = params.get("phone") || "";
        const number = 1;
        console.log("Fetching users with:", { number, pageSize, name, phone });
        this.props.getUsersPageRequest({ number, pageSize, name, phone });
    };
    handleSearchRoleName = (searchTerm) => {
        console.log("Tìm kiếm vai trò với:", searchTerm);
        // 1️⃣ Lấy toàn bộ URL param hiện tại
        const params = new URLSearchParams(window.location.search);

        // 2️⃣ Cập nhật/ghi đè param mới
        if (searchTerm.nameRole) {
            params.set("nameRole", searchTerm.nameRole);
        } else {
            params.delete("nameRole");
        }

        // 👉 Luôn về trang đầu khi search
        params.set("page", 1);

        // 3️⃣ Cập nhật lại URL (không reload trang)
        window.history.pushState({}, "", `${window.location.pathname}?${params.toString()}`);
        console.log("Updated URL:", `${window.location.pathname}?${params.toString()}`);
        // 4️⃣ Gọi action lấy dữ liệu mới với param tìm kiếm
        const page = parseInt(params.get("page"), 10) || 1;
        const pageSize = parseInt(params.get("pageSize"), 10) || 10;
        const nameRole = params.get("nameRole") || "";
        console.log("Fetching roles with:", { page, pageSize, nameRole });
        this.props.getRolesPageRequest({ page, pageSize, nameRole });
    };

    // ...existing code...
    handleResetSearch = () => {
        // Xóa param name & phone khỏi URL
        const params = new URLSearchParams(window.location.search);
        params.delete("name");
        params.delete("phone");

        const page = parseInt(params.get("page"), 10) || 1;
        const pageSize = parseInt(params.get("pageSize"), 10) || 10;

        const newUrl = `${window.location.pathname}?page=${page}&pageSize=${pageSize}`;
        window.history.pushState({}, "", newUrl);

        // Gọi lại danh sách không filter
        this.props.getUsersPageRequest({ page, pageSize });
    };
    // ...existing code...
    handleResetSearchRoleName = () => {
        // Xóa param nameRole khỏi URL
        const params = new URLSearchParams(window.location.search);
        params.delete("nameRole");

        const page = parseInt(params.get("page"), 10) || 1;
        const pageSize = parseInt(params.get("pageSize"), 10) || 10;

        const newUrl = `${window.location.pathname}?page=${page}&pageSize=${pageSize}`;
        window.history.pushState({}, "", newUrl);

        // Gọi lại danh sách không filter
        this.props.getRolesPageRequest({ page, pageSize });
    };

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

    onClickEditRole = (role) => {
        const params = new URLSearchParams(window.location.search);
        params.set("id", role.roleId);
        window.history.pushState({}, "", `/role-edit?${params.toString()}`);
        this.forceUpdate();
    };

    go_page_role = () => {
        const params = new URLSearchParams(window.location.search);
        console.log("params in go_page_role (before):", params.toString());

        // 🔍 Đảm bảo luôn có page và pageSize mặc định
        if (!params.has("page")) {
            params.set("page", 1);
        }
        if (!params.has("pageSize")) {
            params.set("pageSize", 10);
        }

        window.history.pushState({}, "", `/role?${params.toString()}`);
        console.log("params in go_page_role (after):", params.toString());

        // ✅ Lấy param ra và truyền hết vào Redux
        const page = params.get("page") || 1;
        const pageSize = params.get("pageSize") || 10;
        const nameRole = params.get("nameRole") || "";
        // ✅ nếu có nameRole thì set xuống state để input hiển thị lại
        this.setState({ searchRoleName: nameRole });

        this.props.getRolesPageRequest({ page, pageSize, nameRole });

        // ❌ không nên forceUpdate trừ khi bất đắc dĩ
        this.forceUpdate();
    };
    go_page_question_group = () => {
        const params = new URLSearchParams(window.location.search);
        console.log("params in go_page_question_group (before):", params.toString());

        // 🔍 Đảm bảo luôn có page và pageSize mặc định
        if (!params.has("page")) {
            params.set("page", 1);
        }
        if (!params.has("pageSize")) {
            params.set("pageSize", 10);
        }

        window.history.pushState({}, "", `/list_question?${params.toString()}`);
        console.log("params in go_page_question_group (after):", params.toString());

        // ✅ Lấy param ra và truyền hết vào Redux
        const page = params.get("page") || 1;
        const pageSize = params.get("pageSize") || 10;
        const groupName = params.get("groupName") || "";
        // ✅ nếu có groupName thì set xuống state để input hiển thị lại
        this.setState({ searchGroupName: groupName });

        this.props.getQuestionGroupsPageRequest({ page, pageSize, groupName });

        // ❌ không nên forceUpdate trừ khi bất đắc dĩ
        this.forceUpdate();
    };

    handleDeleteRoleSubmit = (roleId) => {
        // Gọi redux action hoặc API delete role
        this.props.deleteRoleRequest(roleId); // nếu bạn có action deleteRoleRequest

        message.success("Xóa quyền thành công!");
        // Nếu không dùng redux, có thể gọi API trực tiếp
        // api.deleteRole(roleId).then(() => { ... })
    };
    handleCheck_dataNull_goOtherPage = (data) => {
        const params = new URLSearchParams(window.location.search);
        const url = window.location.href;
        console.log("Checking data null for params:", params.toString());
        if (data.length === 0 && params.get("page") > 1) {
            const page = params.get("page") - 1;
            params.set("page", page);
            window.history.pushState({}, "", `/users?${params.toString()}`);
            this.props.getUsersPageRequest({ page, pageSize: params.get("pageSize") || 10, name: params.get("name") || "", phone: params.get("phone") || "" });
            // cập nhật lại param trên url

            // console.log("No users found, navigating to previous page");
        }
    };
    handleDeleteGroupSubmit = (groupId) => {
        this.props.deleteQuestionGroupRequest(groupId);
        message.success("Xóa nhóm câu hỏi thành công!");
    }
    handlePageChangeGroup = (page, pageSize, groupName) => {
        console.log("Page change requested:", page, pageSize, groupName);
        this.props.getQuestionGroupsPageRequest({ page, pageSize, groupName });
    }
    handleSearchQuestionGroup = (searchTerm) => {
        console.log("Tìm kiếm nhóm câu hỏi với:", searchTerm);

        const params = new URLSearchParams(window.location.search);

        // Cập nhật param URL
        if (searchTerm.groupName) {
            params.set("groupName", searchTerm.groupName);
            console.log("Set groupName in URL params:", searchTerm.groupName);
        } else {
            params.delete("groupName");
        }

        // Luôn về trang đầu khi search
        params.set("page", 1);

        window.history.pushState({}, "", `${window.location.pathname}?${params.toString()}`);

        // Gọi action lấy dữ liệu mới với param tìm kiếm
        const page = parseInt(params.get("page"), 10) || 1;
        const pageSize = parseInt(params.get("pageSize"), 10) || 10;
        const groupName = params.get("groupName") || "";

        console.log("Fetching question groups with:", { page, pageSize, groupName });

        this.props.getQuestionGroupsPageRequest({ page, pageSize, groupName });
    };

    handleResetSearchQuestionGroup = () => {
        const params = new URLSearchParams(window.location.search);
        params.delete("groupName");

        const page = parseInt(params.get("page"), 10) || 1;
        const pageSize = parseInt(params.get("pageSize"), 10) || 10;

        window.history.pushState({}, "", `${window.location.pathname}?page=${page}&pageSize=${pageSize}`);

        // Gọi lại danh sách không filter
        this.props.getQuestionGroupsPageRequest({ page, pageSize });
    };

    handleStartQuizClick = (id) => {
        const params = new URLSearchParams(window.location.search);
        console.log("Params before setting id:", id);
        params.set("id", id);
        window.history.pushState({}, "", `/list_question/answers?${params.toString()}`);
        this.forceUpdate();
    }
    handleEditGroupClick = (id) => {
        const params = new URLSearchParams(window.location.search);
        console.log("Params before setting id:", id);
        params.set("id", id);
        window.history.pushState({}, "", `/list_question/edit_group?${params.toString()}`);
        this.forceUpdate();
    }

    renderContent = () => {
        if (this.state.loading) {
            return <Spin tip="Đang tải dữ liệu..." />;
        }
        const path = window.location.pathname;
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
                console.log("usersToRender:", usersToRender);
                this.handleCheck_dataNull_goOtherPage(usersToRender);
                return (
                    <>


                        <Breadcrumb>
                            <Breadcrumb.Item>
                                <span className="breadcrumb-link">Trang chủ</span>
                            </Breadcrumb.Item>
                            <Breadcrumb.Item>
                                <span className="breadcrumb-text">Người dùng</span>
                            </Breadcrumb.Item>
                        </Breadcrumb>

                        <div className="custom-card">


                            <div>
                                <SearchUserForm
                                    onSearch={this.handleSearch}
                                    onReset={this.handleResetSearch}
                                    initialName={filterName}
                                    initialPhone={filterPhone}
                                />
                                <Button
                                    type="primary"
                                    icon={<PlusOutlined />}
                                    className="btn-add"
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
                                    Thêm mới
                                </Button>


                                <div style={{ marginTop: '84px' }}></div>
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

                            </div>

                        </div>
                    </>
                );

            case "/user-add":
                return (
                    <>
                        <Breadcrumb>
                            <Breadcrumb.Item>
                                <span className="breadcrumb-link">Trang chủ</span>
                            </Breadcrumb.Item>
                            <Breadcrumb.Item>
                                <span className="breadcrumb-link">Người Dùng</span>
                            </Breadcrumb.Item>
                            <Breadcrumb.Item>
                                <span className="breadcrumb-text">Thêm người dùng</span>
                            </Breadcrumb.Item>
                        </Breadcrumb>

                        <div className="custom-card-small-1">
                            <AddEditUserForm
                                onAdd_or_UpdateUser={this.handleCreateUserSubmit} // 👈 sửa lại prop này
                                onCancel={this.handleCancelUserForm}
                            />
                        </div>


                    </>
                );
            case "/user-edit":

                return (
                    <>
                        <Breadcrumb>
                            <Breadcrumb.Item>
                                <span className="breadcrumb-link">Trang chủ</span>
                            </Breadcrumb.Item>
                            <Breadcrumb.Item>
                                <span className="breadcrumb-link">Người Dùng</span>
                            </Breadcrumb.Item>
                            <Breadcrumb.Item>
                                <span className="breadcrumb-text">Sửa người dùng</span>
                            </Breadcrumb.Item>
                        </Breadcrumb>


                        <div className="custom-card-small-1">
                            <AddEditUserForm
                                onAdd_or_UpdateUser={this.handleEditUserSubmit}
                                initialValues={this.state.editingUser}
                                onCancel={this.handleCancelUserForm}
                            />
                        </div>


                    </>
                );

            case "/system":
                return <h2>Trang hệ thống</h2>;
            case "/role":

                // Lấy giá trị filter từ URL
                const paramsRole = new URLSearchParams(window.location.search);
                const filterRoleName = paramsRole.get("nameRole") || "";
                console.log("Filter from URL:", { filterRoleName });



                return (
                    <>


                        <Breadcrumb>
                            <Breadcrumb.Item>
                                <span className="breadcrumb-link">Trang chủ</span>
                            </Breadcrumb.Item>

                            <Breadcrumb.Item>
                                <span className="breadcrumb-text">Quyền Hạn</span>
                            </Breadcrumb.Item>
                        </Breadcrumb>




                        <div className="custom-card">



                            <SearchRoleForm
                                onSearch={this.handleSearchRoleName}
                                onReset={this.handleResetSearchRoleName}
                                initialRoleName={filterRoleName}

                            />
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                className="btn-add"
                                onClick={() => {
                                    // Lấy lại các param filter hiện tại
                                    const params = new URLSearchParams(window.location.search);
                                    // Xóa id nếu có (chỉ giữ filter)
                                    params.delete("id");
                                    const queryString = params.toString();
                                    window.history.pushState({}, "", "/role-add" + (queryString ? "?" + queryString : ""));
                                    this.forceUpdate();
                                }}
                            >
                                Thêm mới
                            </Button>

                            <RoleList
                                roles={this.props.roles.items || []}
                                onDeleteRoleClick={this.handleDeleteRoleSubmit}
                                onEditRoleClick={this.onClickEditRole}
                                currentPage={this.props.roles.page}
                                onPageChange={() => { }}
                                pageSize={10}
                                total={0}
                                totalPages={1}
                            />
                        </div>

                    </>
                );

            case "/role-add":
                return (
                    <>

                        <Breadcrumb>
                            <Breadcrumb.Item>
                                <span className="breadcrumb-link">Trang chủ</span>
                            </Breadcrumb.Item>

                            <Breadcrumb.Item>
                                <span className="breadcrumb-link">Quyền Hạn</span>
                            </Breadcrumb.Item>
                            <Breadcrumb.Item>
                                <span className="breadcrumb-text">Thêm Quyền</span>
                            </Breadcrumb.Item>
                        </Breadcrumb>


                        <AddEditRoleForm go_page_role={this.go_page_role} />

                    </>
                );

            case "/role-edit":
                return (
                    <>

                        <Breadcrumb>
                            <Breadcrumb.Item>
                                <span className="breadcrumb-link">Trang chủ</span>
                            </Breadcrumb.Item>

                            <Breadcrumb.Item>
                                <span className="breadcrumb-link">Quyền Hạn</span>
                            </Breadcrumb.Item>
                            <Breadcrumb.Item>
                                <span className="breadcrumb-text">Sửa Quyền</span>
                            </Breadcrumb.Item>
                        </Breadcrumb>
                        <AddEditRoleForm go_page_role={this.go_page_role} />




                    </>
                );
            case "/list_question":
                const questionGroups = this.props.questionGroups.items || [];
                this.handleCheck_dataNull_goOtherPage(questionGroups);
                console.log("questionGroups in App.js:", questionGroups);

                return (
                    <>
                        <Breadcrumb>
                            <Breadcrumb.Item>
                                <span className="breadcrumb-link">Trang chủ</span>
                            </Breadcrumb.Item>
                            <Breadcrumb.Item>
                                <span className="breadcrumb-text">Câu hỏi</span>
                            </Breadcrumb.Item>
                        </Breadcrumb>

                        <div className="custom-card">

                            <div>
                                <QuestionGroupSearchBar
                                    onSearch={this.handleSearchQuestionGroup}
                                    onReset={this.handleResetSearchQuestionGroup}
                                    initialGroupName={new URLSearchParams(window.location.search).get("groupName") || ""}
                                />
                                <Button
                                    type="primary"
                                    icon={<PlusOutlined />}
                                    className="btn-add"
                                    onClick={() => {
                                        // Lấy lại các param filter hiện tại
                                        const params = new URLSearchParams(window.location.search);
                                        // Xóa id nếu có (chỉ giữ filter)
                                        params.delete("id");
                                        const queryString = params.toString();
                                        // window.history.pushState({}, "", `/list_question/edit_group?${params.toString()}`);
                                        window.history.pushState({}, "", `/list_question/add_group?${params.toString()}`);
                                        this.forceUpdate();
                                    }}
                                >
                                    Thêm mới
                                </Button>
                                <div style={{ marginTop: '84px' }}></div>
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
                                <QuestionGroupList
                                    groups={questionGroups}
                                    onDeleteGroupClick={this.handleDeleteGroupSubmit}
                                    onEditGroupClick={this.handleEditGroupClick}
                                    onStartQuizClick={this.handleStartQuizClick}
                                    currentPage={this.props.questionGroups.page}
                                    onPageChange={this.handlePageChangeGroup}
                                    pageSize={this.props.questionGroups.pageSize}
                                    total={this.props.questionGroups.total}
                                    totalPages={this.props.questionGroups.totalPages}
                                />

                            </div>
                        </div>

                    </>
                );
            case "/list_question/answers":
                return (
                    <>

                        <Breadcrumb>
                            <Breadcrumb.Item>
                                <span className="breadcrumb-link">Trang chủ</span>
                            </Breadcrumb.Item>
                            <Breadcrumb.Item>
                                <span className="breadcrumb-link">Câu hỏi</span>
                            </Breadcrumb.Item>

                            <Breadcrumb.Item>
                                <span className="breadcrumb-text">Trả lời câu hỏi</span>
                            </Breadcrumb.Item>
                        </Breadcrumb>




                        <AddEditQuestionGroup go_page_question_group={this.go_page_question_group} />


                    </>
                );
            case "/list_question/edit_group":
                return (
                    <>

                        <Breadcrumb>
                            <Breadcrumb.Item>
                                <span className="breadcrumb-link">Trang chủ</span>
                            </Breadcrumb.Item>
                            <Breadcrumb.Item>
                                <span className="breadcrumb-link">Câu hỏi</span>
                            </Breadcrumb.Item>

                            <Breadcrumb.Item>
                                <span className="breadcrumb-text">Chỉnh sửa nhóm câu hỏi</span>
                            </Breadcrumb.Item>
                        </Breadcrumb>

                        <AddEditQuestionGroup go_page_question_group={this.go_page_question_group} />



                    </>
                );
            case "/list_question/add_group":
                return (
                    <>

                        <Breadcrumb>
                            <Breadcrumb.Item>
                                <span className="breadcrumb-link">Trang chủ</span>
                            </Breadcrumb.Item>
                            <Breadcrumb.Item>
                                <span className="breadcrumb-link">Câu hỏi</span>
                            </Breadcrumb.Item>

                            <Breadcrumb.Item>
                                <span className="breadcrumb-text">Thêm nhóm câu hỏi</span>
                            </Breadcrumb.Item>
                        </Breadcrumb>




                        <AddEditQuestionGroup go_page_question_group={this.go_page_question_group} />

                    </>
                );

            default:
                return (
                    <>

                        <Breadcrumb>
                            <Breadcrumb.Item>
                                <span className="breadcrumb-link">Trang chủ</span>
                            </Breadcrumb.Item>


                            <Breadcrumb.Item>
                                <span className="breadcrumb-text">Thêm </span>
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
                <Layout className="app-layout">
                    <Sidebar />
                    <Layout className="app-container">
                        <HeaderUserInfo />
                        <Content className="app-content">

                            {this.renderContent()}
                        </Content>
                    </Layout>
                </Layout>
                {/* 👇 thêm cái overlay loading ở đây */}
                <LoadingOverlay loading={this.props.users.loading || this.props.roles.loading || this.props.questionGroups.loading} />



            </>
        );
    }
}

export default connect(({ users, roles, questionGroups }) => ({ users, roles, questionGroups }), {
    getUsersRequest,
    getUsersPageRequest,
    createUserRequest,
    deleteUserRequest,
    updateUserRequest,

    usersError,

    getRolesRequest,
    deleteRoleRequest,
    getRolesSuccess,
    getRolesError,
    getRolesPageRequest,

    getQuestionGroupsPageRequest,
    getQuestionGroupsPageSuccess,
    // createQuestionGroupRequest,
    // createQuestionGroupSuccess,
    updateQuestionGroupRequest,
    updateQuestionGroupSuccess,
    deleteQuestionGroupRequest,
    deleteQuestionGroupSuccess,
    questionGroupsError

})(App);


