import React, { useState, useEffect } from "react";
import UserListItem from "./UserListItem";
import { List } from "antd";
import { Table } from "antd";
const UserList = ({ users, onDeleteUserClick, onEditUserClick }) => {
    // sắp xếp users theo firstName, lastName
    const sortedUsers = [...users].sort((a, b) => {
        if (a.firstName > b.firstName) return 1;
        if (a.firstName < b.firstName) return -1;
        if (a.lastName > b.lastName) return 1;
        if (a.lastName < b.lastName) return -1;
        return 0;
    });
    // Thêm index để render cột STT
    const usersWithIndex = sortedUsers.map((user, index) => ({
        ...user,
        index: index + 1,
    }));

    // Quản lý currentPage bằng state
    const getCurrentPageFromUrl = () => {
        const params = new URLSearchParams(window.location.search);
        const page = parseInt(params.get("page"), 10);
        return isNaN(page) ? 1 : page;
    };
    const [currentPage, setCurrentPage] = useState(getCurrentPageFromUrl());

    // Khi URL thay đổi (F5 hoặc chuyển trang), cập nhật state
    useEffect(() => {
        setCurrentPage(getCurrentPageFromUrl());
    }, []);

    // Hàm cập nhật param page trên URL và state
    const handlePageChange = (page, pageSize) => {
        const params = new URLSearchParams(window.location.search);
        params.set("page", page);
        window.history.replaceState(
            {},
            "",
            `${window.location.pathname}?${params.toString()}`
        );
        setCurrentPage(page);
    };

    return (
        <UserListItem
            data={usersWithIndex}
            onDeleteClick={onDeleteUserClick}
            onEditClick={onEditUserClick}
            currentPage={currentPage}
            onPageChange={handlePageChange}
        />
    );
    // return (
    //     <List
    //         bordered
    //         dataSource={sortedUsers}
    //         renderItem={(user) => (
    //             <List.Item key={user.id}>
    //                 <UserListItem
    //                     user={user}
    //                     onDeleteClick={onDeleteUserClick}
    //                     onEditClick={onEditUserClick}
    //                 />
    //             </List.Item>
    //         )}
    //     />
    // );
};

export default UserList;

// import React from 'react';
// import UserListItem from './UserListItem';
// import { ListGroup, ListGroupItem } from 'reactstrap';

// const UserList = ({users, onDeleteUserClick, onUpdateUserClick}) => {
//     return (
//         <ListGroup>
//             {users.sort((a, b) => {
//                 if (a.firstName > b.firstName) {
//                     return 1;
//                 } else if (a.firstName < b.firstName) {
//                     return -1;
//                 } else if (a.lastName > b.lastName) {
//                     return 1;
//                 } else if (a.lastName < b.lastName) {
//                     return -1;
//                 }
//                 return 0;
//             }).map((user) => {
//                 //  console.log('User ID:', user.id); // Log ra id tại đây
//                 return (

//                     <ListGroupItem key={user.id}>
//                         {
//                             <UserListItem
//                             onDeleteClick={onDeleteUserClick}
//                             onUpdateClick={onUpdateUserClick}
//                              user={user}

//                             />}

//                     </ListGroupItem>
//                 );
//             })}
//         </ListGroup>
//     );
// };

// const UserList = ({users, onDeleteUserClick, onUpdateUserClick}) => {
//     return (
//         <ListGroup>
//             {users.sort((a, b) => {
//                 if (a.firstName > b.firstName) {
//                     return 1;
//                 } else if (a.firstName < b.firstName) {
//                     return -1;
//                 } else if (a.lastName > b.lastName) {
//                     return 1;
//                 } else if (a.lastName < b.lastName) {
//                     return -1;
//                 }
//                 return 0;
//             }).map((user) => {
//                 //  console.log('User ID:', user.id); // Log ra id tại đây
//                 return (

//                     <ListGroupItem key={user.id}>
//                         {
//                             <UserListItem
//                             onDeleteClick={onDeleteUserClick}
//                             onUpdateClick={onUpdateUserClick}
//                              user={user}

//                             />}

//                     </ListGroupItem>
//                 );
//             })}
//         </ListGroup>
//     );
// };
// export default UserList;
