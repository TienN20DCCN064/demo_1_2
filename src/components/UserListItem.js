import React from "react";
import { Button, Modal, Table } from "antd";
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import * as api from '../api/users';

let CURRENT = 1;
let PAGE_SIZE = 10;

function handleCheckPageParam() {
  const query = new URLSearchParams(window.location.search);
  if (query.get("page") === null || query.get("pageSize") === null) {
    //console.log("Chưa có page hoặc pageSize, thiết lập mặc định");
    query.set("page", 1);
    query.set("pageSize", 5);
    CURRENT = 1;
    PAGE_SIZE = 5;
    // Thay đổi URL mà không reload
    const newUrl = window.location.pathname + "?" + query.toString();
    window.history.replaceState(null, "", newUrl);
  } else {
    // console.log("query:", query.toString());
    // console.log("page:", query.get("page"));
    // console.log("pageSize:", query.get("pageSize"));
    CURRENT = Number(query.get("page")) || 1;
    PAGE_SIZE = Number(query.get("pageSize")) || 5;
  }
}

const UserListItem = ({ data, onDeleteClick, onEditClick }) => {
  // Lấy query param
  const query = new URLSearchParams(window.location.search);
  handleCheckPageParam();

  // Cập nhật param khi chuyển trang
  const handleTableChange = (pagination) => {
    const params = new URLSearchParams(window.location.search);
    params.set("page", pagination.current);
    params.set("pageSize", pagination.pageSize);

    // Thay đổi URL mà không reload
    const newUrl = window.location.pathname + "?" + params.toString();
    window.history.replaceState(null, "", newUrl);
    CURRENT = pagination.current;
    PAGE_SIZE = pagination.pageSize;
    // console.log("Trang hiện tại:", pagination.current);
    // console.log("Số bản ghi mỗi trang:", pagination.pageSize);
    // console.log("query:", query.toString());
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
      size="small" // làm table gọn hơn, chữ cũng hơi nhỏ
      rowKey="id"
      columns={columns}
      dataSource={data}
      bordered
      pagination={{
        defaultCurrent: CURRENT,
        defaultPageSize: PAGE_SIZE,
        showSizeChanger: true,
        pageSizeOptions: ["5", "10", "20", "50", "100"], // thêm 5 vào
      }}
      onChange={handleTableChange}
    />
  );
};


export default UserListItem;
