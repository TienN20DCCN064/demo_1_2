import React from "react";
import { Button, Modal, Table } from "antd";
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import * as api from '../api/users';

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

const UserListItem = ({ data, onDeleteClick, onEditClick, currentPage, onPageChange, pageSize, total, totalPages }) => {
  handleCheckPageParam();
  console.log("data in UserListItem:", data);
  
  const handleTableChange = (pagination) => {
    // Cập nhật URL khi đổi trang hoặc pageSize
    const query = new URLSearchParams(window.location.search);
    query.set("page", pagination.current);
    query.set("pageSize", pagination.pageSize);
    const newUrl = window.location.pathname + "?" + query.toString();
    window.history.replaceState(null, "", newUrl);

    if (onPageChange) {
      onPageChange(pagination.current, pagination.pageSize);
    }
  };

  const stringToHslColor = (str = "") => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const h = hash % 360;
    return `hsl(${h},60%,80%)`;
  };


  const columns = [
  {
    title: "#",
    key: "image",
    align: "center", // luôn căn giữa
    width: 50,
    render: (_, record) => (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        {record.image ? (
          <img
            src={record.image}
            alt={record.fullName}
            style={{
              height: "40px",
              width: "40px",
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />
        ) : (
          <div
            style={{
              textAlign: "center",
              height: "40px",
              width: "40px",
              lineHeight: "40px",
              borderRadius: "50%",
              color: "white",
              fontWeight: "bold",
              background: stringToHslColor(record.fullName),
            }}
          >
            {record.fullName ? record.fullName[0].toUpperCase() : ""}
          </div>
        )}
      </div>
    ),
  },
  {
    title: "Họ Và Tên",
    dataIndex: "fullName",
    key: "fullName",
    width: 500,
    align: "left", // luôn căn trái
    render: (_, record) => <div>{record.fullName}</div>,
  },
  {
    title: "Tên Người Dùng",
    dataIndex: "userName",
    key: "userName",
    width: 200,
    align: "left", // luôn căn trái
    render: (_, record) => <div>{record.userName}</div>,
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
    width: 200,
    align: "left", // luôn căn trái
    render: (_, record) => <div>{record.email}</div>,
  },
  {
    title: "Số điện thoại",
    dataIndex: "phone",
    key: "phone",
    width: 200,
    align: "center", // căn giữa
    render: (_, record) => <div>{record.phone}</div>,
  },
  {
    title: "Quyền",
    dataIndex: "roleId",
    key: "role",
    width: 200,
    align: "center", // căn giữa
    render: (_, record) => <div>{record.roleId}</div>,
  },
  {
    title: "Hoạt Động",
    key: "action",
    width: 200,
    align: "right", // luôn căn phải
    render: (_, record) => (
      <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end", paddingRight: "10px" }}>
        <Button
          size="small"
          type="dashed"
          icon={<EditOutlined />}
          onClick={() => {
            onEditClick({ userId: record.id });
          }}
        />
        <Button
          size="small"
          danger
          type="primary"
          icon={<DeleteOutlined />}
          onClick={() => {
            Modal.confirm({
              title: "Bạn có muốn xóa không?",
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
        showSizeChanger: false, // ❌ tắt dropdown chọn số bản ghi
        itemRender: (page, type, originalElement) => {
          if (type === "page" && total <= pageSize && page === 1) {
            return null; // ẩn số 1 nếu chỉ có 1 trang
          }
          return originalElement;
        },
      }}
      onChange={handleTableChange}
    />
  );

};


export default UserListItem;
