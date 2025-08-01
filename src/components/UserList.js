import React from 'react';
import UserListItem from './UserListItem';
import { ListGroup, ListGroupItem } from 'reactstrap';

const UserList = ({users, onDeleteUserClick, onUpdateUserClick}) => {
    return (
        <ListGroup>
            {users.sort((a, b) => {
                if (a.firstName > b.firstName) {
                    return 1;
                } else if (a.firstName < b.firstName) {
                    return -1;
                } else if (a.lastName > b.lastName) {
                    return 1;
                } else if (a.lastName < b.lastName) {
                    return -1;
                }
                return 0;
            }).map((user) => {
                //  console.log('User ID:', user.id); // Log ra id tại đây
                return (
                    
                    <ListGroupItem key={user.id}>
                        {
                            <UserListItem 
                            onDeleteClick={onDeleteUserClick}
                            onUpdateClick={onUpdateUserClick}
                             user={user}
                            
                            />}
                
                    </ListGroupItem>
                );
            })}
        </ListGroup>
    );
};

export default UserList;