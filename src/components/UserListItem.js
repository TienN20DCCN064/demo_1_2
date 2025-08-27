import React from "react";
import { Button, Modal, Table } from "antd";
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import * as api from '../api/users';

let CURRENT = 1;
let PAGE_SIZE = 10;
function handleCheckPageParam() {
  const query = new URLSearchParams(window.location.search);

  if (query.get("page") === null || query.get("pageSize") === null) {
    query.set("page", 1);
    query.set("pageSize", 5);
    const newUrl = window.location.pathname + "?" + query.toString();
    window.history.replaceState(null, "", newUrl);
    return { page: 1, pageSize: 5 };
  } else {
    return {
      page: Number(query.get("page")) || 1,
      pageSize: Number(query.get("pageSize")) || 5,
    };
  }
}

const UserListItem = ({ data, onDeleteClick, onEditClick, currentPage, onPageChange, pageSize, total, totalPages }) => {
  handleCheckPageParam();
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
      align: "center",
      width: 50,
      render: (_, record) => (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          {record.image ? (
            <img
              src={record.image}
              alt={record.fullName}
              style={{
                height: "40px",
                width: "40px",
                borderRadius: "50%", // hình tròn
                objectFit: "cover",   // giữ tỉ lệ và cắt vừa div
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
              {record.fullName
                ? record.fullName[0].toUpperCase()
                : ""}
            </div>
          )}
        </div>
      ),
    },
    {
      title: (
        <div style={{ textAlign: "center", width: "100%", align: "center", fontWeight: "bold" }}>Họ Và Tên</div>
      ),
      key: "fullName",
      width: 500,
      render: (_, record) => (
        <div style={{ display: "flex", alignItems: "center", align: "center", }}>
          {/* Tên người dùng */}
          <div style={{ marginLeft: "10px" }}>
            {record.fullName}
          </div>
        </div>
      ),
    },
    {
      title: <div style={{ textAlign: "center", width: "100%", fontWeight: "bold" }}>Tên Người Dùng</div>,
      key: "userName",
      width: 200,
      render: (_, record) => (
        //    console.log("record:", record),
        <div style={{ display: "flex", alignItems: "center", align: "center" }}>
          {/* Tên người dùng */}
          <div style={{ marginLeft: "10px" }}>
            {record.userName}
          </div>
        </div>
      ),
    },
    {
      title: <div style={{ textAlign: "center", width: "100%", fontWeight: "bold" }}>email</div>,
      dataIndex: "email",
      key: "email",
      width: 200,
      render: (_, record) => (
        //  console.log("record:", record),
        <div style={{ display: "flex", alignItems: "center", align: "center" }}>
          {/* Tên người dùng */}
          <div style={{ marginLeft: "10px" }}>
            {record.email}
          </div>
        </div>
      ),
    },
    {
      title: <div style={{ textAlign: "center", width: "100%", fontWeight: "bold" }}>Số điện thoại</div>,
      dataIndex: "phone",
      key: "phone",
      width: 200,
      render: (_, record) => (
        //    console.log("record:", record),
        <div style={{ display: "flex", alignItems: "center", align: "center", justifyContent: "center" }}>
          {/* Tên người dùng */}
          <div style={{ marginLeft: "10px" }}>
            {record.phone}
          </div>
        </div>
      ),
    },
    {

      title: <div style={{ textAlign: "center", width: "100%", fontWeight: "bold" }}>Quyền</div>,
      dataIndex: "role",
      key: "role",
      width: 200,
      render: (_, record) => (
        //    console.log("record:", record),
        // căn giữa
        <div style={{ display: "flex", alignItems: "center", align: "center", justifyContent: "center" }}>
          {/* Tên người dùng */}
          <div style={{ marginLeft: "10px" }}>
            {record.roleId}
          </div>
        </div>
      ),
    },
    {
      title: <div style={{ textAlign: "center", width: "100%", fontWeight: "bold" }}>Hoạt Động</div>,
      key: "action",
      align: "center", // căn giữa nội dung trong cell
      width: 200,
      render: (_, record) => (
        <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>


          <Button
            size="small"
            type="dashed"
            icon={<EditOutlined />}
            onClick={() => {
              onEditClick({
                userId: record.id,
                // fullName: document.getElementById("fullName").value
              });
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
        showSizeChanger: true,
        pageSizeOptions: ["5", "10", "20", "50", "100"],
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
