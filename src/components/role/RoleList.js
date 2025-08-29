import React from "react";
import RoleListItem from "./RoleListItem";

const RoleList = ({ 
    roles, 
    onDeleteRoleClick, 
    onEditRoleClick, 
    onPageChange, 
    pageSize, 
    total, 
    totalPages, 
    currentPage
}) => {
    return (
        <RoleListItem
            data={roles}
            onDeleteClick={onDeleteRoleClick}
            onEditClick={onEditRoleClick}
            currentPage={currentPage}
            onPageChange={onPageChange}
            pageSize={pageSize}
            total={total}
            totalPages={totalPages}
        />
    );
};

export default RoleList;
