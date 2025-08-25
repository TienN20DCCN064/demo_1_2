import React, { Component } from 'react';
import NewUserForm from './NewUserForm';
import UserList from './UserList';
import { connect } from 'react-redux';
import { getUsersRequest, createUserRequest, deleteUserRequest, updateUserRequest, usersError } from '../actions/users';

import { takeEvery, takeLatest, take, call, put, fork } from 'redux-saga/effects';
import * as api from '../api/users';
// import { Alert } from 'reactstrap';
import { Alert, Modal } from 'antd';
import e from 'cors';


const Str_Update = "Update";
const Str_Create = "Create";

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editingUser: null,
        };
    }
    // componentDidMount() {// tránh lỗi khi reset lại trang là lỗi ui
    componentDidMount() {
        this.props.getUsersRequest();
    }
    // handle_Create_or_Update_userSubmit = ({ firstName, lastName }) => {

    // }
    handle_Create_or_Update_userSubmit = ({ firstName, lastName }) => {
        const name_button = document.getElementById('button').innerText;
        // di chuyển màn hình lên button
        // Cuộn màn hình tới button

        console.log(document.getElementById('button').innerText);
        if (name_button === Str_Create) {
            this.props.createUserRequest({
                firstName,
                lastName
            });
        }
        else if (name_button === Str_Update) {
            console.log("button is edit");

            this.handleUpdateUserSubmit({
                userId: this.state.editingUser.userId,
                firstName,
                lastName
            });
        }
        document.getElementById('button').innerText = Str_Create
    };
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
    handleEditUserClick = async ({ userId }) => {

        const data_userId = await api.getUser(userId);
        document.getElementById('button').innerText = Str_Update;
        this.setState({
            editingUser: {
                userId,
                firstName: data_userId.data.firstName,
                lastName: data_userId.data.lastName,
            }
        });
    };


    // update
    handleUpdateUserSubmit = async ({ userId, firstName, lastName }) => {
        this.props.updateUserRequest({
            userId,
            firstName,
            lastName
        });
        // Reset form
        this.setState({
            editingUser: null
        });
    };

    render() {
        const users = this.props.users;
        return (
            <div style={{ margin: '0 auto', padding: '20px', maxWidth: '600px' }}>
                <h2>Users</h2>

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

                {/* <NewUserForm
                    onSubmit={this.handle_Create_or_Update_userSubmit}
                    editingUser={this.state.editingUser}
                /> */}
                <NewUserForm
                    onSubmit={this.handle_Create_or_Update_userSubmit}
                    editingUser={this.state.editingUser}
                    onResetEditMode={this.handleResetEditMode}
                />

                {!!users.items && !!users.items.length && (
                    <UserList
                        onDeleteUserClick={this.handleDeleteUserSubmit}
                        onEditUserClick={this.handleEditUserClick}
                        users={users.items}
                    />
                )}
            </div>
        );
    }
}

export default connect(({ users }) => ({ users }), {
    getUsersRequest,
    createUserRequest,
    deleteUserRequest,
    updateUserRequest,
    usersError,

})(App);
















// render() {
//     const users = this.props.users;
//     return (
//         <div style={{ margin: '0 auto', padding: '20px', maxWidth: '600px' }}>
//             <h2>
//                 Users
//             </h2>
//             <Alert color="danger" isOpen={!!this.props.users.error} toggle={this.handleCloseAlert}>
//                 {this.props.users.error}
//             </Alert>

//             <NewUserForm onSubmit={this.handleCreateUserSubmit} />

//             {!!users.items && !!users.items.length &&
//                 <UserList
//                     onDeleteUserClick={this.handleDeleteUserSubmit}
//                     onUpdateUserClick={this.handleUpdateUserSubmit}
//                     users={users.items} />
//             }
//         </div>
//     );
// }


// class App extends Component {
//     constructor(props) {
//         super(props);
//         this.props.getUsersRequest();
//     }
//     handleCreateUserSubmit = ({ firstName, lastName }) => {
//         this.props.createUserRequest({
//             firstName,
//             lastName
//         });
//     };
//     handleDeleteUserSubmit = (userID) => {
//         this.props.deleteUserRequest(userID);
//     };

//     handleCloseAlert = () => {
//         this.props.usersError({
//             errot: ''
//         });
//     };

//     handleUpdateUserSubmit = ({userId, firstName, lastName }) => {
//         this.props.updateUserRequest({
//             userId,
//             firstName,
//             lastName
//         });
//     };


//     render() {
//         const users = this.props.users;
//         return (
//             <div style={{ margin: '0 auto', padding: '20px', maxWidth: '600px' }}>
//                 <h2>
//                     Users
//                 </h2>
//                 <Alert color="danger" isOpen={!!this.props.users.error} toggle={this.handleCloseAlert}>
//                     {this.props.users.error}
//                 </Alert>

//                 <NewUserForm onSubmit={this.handleCreateUserSubmit} />

//                 {!!users.items && !!users.items.length &&
//                     <UserList
//                         onDeleteUserClick={this.handleDeleteUserSubmit}
//                         onUpdateUserClick={this.handleUpdateUserSubmit}
//                         users={users.items} />
//                 }
//             </div>
//         );
//     }
// }


// export default connect (({users})   => ({users}) ,{
//     getUsersRequest,
//     createUserRequest,
//     deleteUserRequest,
//     updateUserRequest,
//     usersError,
// })(App);



































