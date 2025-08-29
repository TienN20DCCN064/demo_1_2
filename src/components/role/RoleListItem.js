import React from "react";
import { Button, Modal, Table } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

function handleCheckPageParam() {
    const query = new URLSearchParams(window.location.search);

    if (query.get("page") === null || query.get("pageSize") === null) {
        query.set("page", 1);
        query.set("pageSize", 10);
        const newUrl = window.location.pathname + "?" + query.toString();
        window.history.replaceState(null, "", newUrl);
        return { page: 1, pageSize: 10 };
    } else {
        return {
            page: Number(query.get("page")) || 1,
            pageSize: Number(query.get("pageSize")) || 10,
        };
    }
}

const RoleListItem = ({
    data,
    onDeleteClick,
    onEditClick,
    currentPage,
    onPageChange,
    pageSize,
    total,
    totalPages
}) => {
    handleCheckPageParam();

    const handleTableChange = (pagination) => {
        const query = new URLSearchParams(window.location.search);
        query.set("page", pagination.current);
        query.set("pageSize", pagination.pageSize);
        const newUrl = window.location.pathname + "?" + query.toString();
        window.history.replaceState(null, "", newUrl);

        if (onPageChange) {
            onPageChange(pagination.current, pagination.pageSize);
        }
    };

    const columns = [
        {
            title: "Mã Quyền",
            dataIndex: "id",
            key: "id",
            width: 400,
            align: "left",   // 👈 luôn căn trái
        },
        {
            title: "Tên Quyền",
            dataIndex: "name",
            key: "name",
            width: 400,
            align: "left",   // 👈 chữ đầu tiên của mỗi ô luôn thẳng nhau
        }
        ,
        {
            title: "Hoạt động",
            key: "action",
            width: 200,
            align: "right",  // 👈 luôn căn phải
            render: (_, record) => (
                <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                    <Button
                        size="small"
                        type="dashed"
                        icon={<EditOutlined />}
                        onClick={() => {
                            onEditClick({ roleId: record.id });
                        }}
                    />
                    <Button
                        size="small"
                        danger
                        type="primary"
                        icon={<DeleteOutlined />}
                        onClick={() => {
                            Modal.confirm({
                                title: "Bạn có muốn xóa quyền này không?",
                                okText: "Yes",
                                okType: "danger",
                                cancelText: "No",
                                onOk() {
                                    onDeleteClick(record.id);
                                },
                            });
                        }}
                    />
                </div>
            ),
        },
    ];



    return (
        <Table
            rowKey="id"
            columns={columns}
            dataSource={data}
            pagination={{
                current: currentPage,
                pageSize,
                total,
                showSizeChanger: false,
                itemRender: (page, type, originalElement) => {
                    if (type === "page" && total <= pageSize && page === 1) {
                        return null;
                    }
                    return originalElement;
                },
            }}
            onChange={handleTableChange}
        />
    );
};

export default RoleListItem;
