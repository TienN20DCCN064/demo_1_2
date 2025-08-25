import React, { useState, useEffect } from "react";
import UserListItem from "./UserListItem";
import { List } from "antd";
import { Table } from "antd";
const UserList = ({ users, onDeleteUserClick, onEditUserClick }) => {
    // sắp xếp users theo firstName, lastName
    const sortedUsers = [...users].sort((a, b) => {
        if (a.fullname > b.fullname) return 1;
        if (a.fullname < b.fullname) return -1;
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

};

export default UserList;
