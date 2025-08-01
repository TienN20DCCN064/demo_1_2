import React, { Component } from 'react';
import NewUserForm from './NewUserForm';
import UserList from './UserList';
import { connect } from 'react-redux';
import { getUsersRequest, createUserRequest, deleteUserRequest, updateUserRequest, usersError } from '../actions/users';

import { Alert } from 'reactstrap';

class App extends Component {
    constructor(props) {
        super(props);

        this.props.getUsersRequest();
    }
    handleCreateUserSubmit = ({ firstName, lastName }) => {
        this.props.createUserRequest({
            firstName,
            lastName
        });
    };
    handleDeleteUserSubmit = (userID) => {
        this.props.deleteUserRequest(userID);
    };

    handleCloseAlert = () => {
        this.props.usersError({
            error: ''
        });
    };


    // update
    handleUpdateUserSubmit = ({ userId, firstName, lastName }) => {

        console.log("handleUpdateUserSubmit");
        console.log("Id ", userId);
        this.props.updateUserRequest({
            userId,
            firstName,
            lastName
        });
    };


    render() {
        const users = this.props.users;
        return (
            <div style={{ margin: '0 auto', padding: '20px', maxWidth: '600px' }}>
                <h2>
                    Users
                </h2>
                <Alert color="danger" isOpen={!!this.props.users.error} toggle={this.handleCloseAlert}>
                    {this.props.users.error}
                </Alert>

                <NewUserForm onSubmit={this.handleCreateUserSubmit} />

                {!!users.items && !!users.items.length &&
                    <UserList
                        onDeleteUserClick={this.handleDeleteUserSubmit}
                        onUpdateUserClick={this.handleUpdateUserSubmit}
                        users={users.items} />
                }
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