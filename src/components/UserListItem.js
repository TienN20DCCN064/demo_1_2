import React from "react";
import { Button, Modal, Table } from "antd";

import * as api from "../api/users";

let CURRENT = 1;
let PAGE_SIZE = 5;

function handleCheckPageParam() {
  const query = new URLSearchParams(window.location.search);
  if (query.get("page") === null || query.get("pageSize") === null) {
    console.log("Chưa có page hoặc pageSize, thiết lập mặc định");
    query.set("page", 1);
    query.set("pageSize", 5);
    CURRENT = 1;
    PAGE_SIZE = 5;
    // Thay đổi URL mà không reload
    const newUrl = window.location.pathname + "?" + query.toString();
    window.history.replaceState(null, "", newUrl);
  } else {
    console.log("query:", query.toString());
    console.log("page:", query.get("page"));
    console.log("pageSize:", query.get("pageSize"));
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
    console.log("Trang hiện tại:", pagination.current);
    console.log("Số bản ghi mỗi trang:", pagination.pageSize);
    console.log("query:", query.toString());
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
      title: "NO.",
      dataIndex: "index",
      key: "index",
      width: 50, // nhỏ lại
    },
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 50, // nhỏ lại
    },
    {
      title: (
        <div style={{ textAlign: "center", width: "100%" }}>Full Name</div>
      ),
      key: "fullName",

      render: (_, record) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          {/* Avatar tròn */}
          <div
            style={{
              textAlign: "center",
              height: "40px",
              width: "40px",
              lineHeight: "40px",
              borderRadius: "50%",
              color: "white",
              fontWeight: "bold",
              background: stringToHslColor(record.firstName + record.lastName),
            }}
          >
            {record.firstName && record.lastName
              ? record.firstName[0].toUpperCase() +
              record.lastName[0].toUpperCase()
              : ""}
          </div>

          {/* Tên người dùng */}
          <div style={{ marginLeft: "10px" }}>
            {record.firstName} {record.lastName}
          </div>
        </div>
      ),
    },
    {
      title: <div style={{ textAlign: "center", width: "100%" }}>Action</div>,
      key: "action",
      align: "center", // căn giữa nội dung trong cell
      render: (_, record) => (
        <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
          <Button
            size="small"
            danger
            type="primary"
            onClick={() => {
              Modal.confirm({
                title: "Bạn có muốn xóa không?",
                okText: "Yes",
                okType: "danger",
                maskClosable: true,
                centered: true,
                cancelText: "No",
                onOk() {
                  onDeleteClick(record.id);
                },
              });
            }}
          >
            Delete
          </Button>

          <Button
            size="small"
            type="dashed"
            onClick={() => {
              document.getElementById("button").scrollIntoView({
                behavior: "smooth",
                block: "center",
              });
              setTimeout(() => {
                onEditClick({
                  userId: record.id,
                  firstName: document.getElementById("firstName").value,
                  lastName: document.getElementById("lastName").value,
                });
                document.getElementById("firstName").focus();
              }, 200);
            }}
          >
            Edit
          </Button>
        </div>
      ),
    },
  ];
  return (
    <Table
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

// return (
//   <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
//     {/* Cột trái: ID + Avatar + Tên */}
//     <div style={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
//       {/* Cột ID */}
//       <div style={{ paddingLeft: '10px', width: '50px', textAlign: 'left' }}>
//         {user.id}
//       </div>

//       {/* Avatar tròn */}
//       <div
//         style={{
//           marginLeft: '-22px',
//           textAlign: 'center',
//           height: '40px',
//           width: '40px',
//           lineHeight: '40px',
//           borderRadius: '50%',
//           color: 'white',
//           fontWeight: 'bold',
//           background: stringToHslColor(user.firstName + user.lastName),
//         }}
//       >
//         {!!user && !!user.firstName && !!user.lastName
//           ? user.firstName[0].toUpperCase() + user.lastName[0].toUpperCase()
//           : ''}
//       </div>

//       {/* Tên người dùng */}
//       <div style={{ margin: 'auto 0', paddingLeft: '10px' }}>
//         {user.firstName} {user.lastName}
//       </div>
//     </div>

//     {/*Buttons */}
//     <div style={{ display: 'flex', gap: '8px', paddingRight: '10px' }}>
//       <Button
//         size="small"
//         danger
//         type="primary"
//         // onClick={() => {
//         //   if (window.confirm('Bạn có muốn xóa không?')) {
//         //     onDeleteClick(user.id);
//         //   }
//         // }}
//         onClick={() => {
//           Modal.confirm({
//               title: 'Bạn có muốn xóa không?',
//               okText: 'Yes',
//               okType: 'danger',
//               maskClosable: true, // ← Click ngoài modal
//                centered: true, // Căn giữa
//               cancelText: 'No',
//               onOk() {
//                 onDeleteClick(user.id);
//               },
//               onCancel() {
//                 console.log('Cancel');
//               },
//             });
//         }}
//       >
//         Delete
//       </Button>

//       <Button
//         size="small"
//         type="dashed"
//         onClick={() => {
//             document.getElementById('button').scrollIntoView({
//                   behavior: "smooth", // cuộn mượt
//                   block: "center"     // căn giữa trong màn hình (có thể dùng "start" hoặc "end")
//               });
//             setTimeout(() => {
//                 onEditClick({
//                   userId: user.id,
//                   firstName: document.getElementById('firstName').value,
//                   lastName: document.getElementById('lastName').value,
//                 });
//                 document.getElementById('firstName').focus();
//               }, 200);
//         }}

//       >
//         Edit
//       </Button>
//     </div>
//   </div>
// );

// };

export default UserListItem;

// import React, { lazy } from 'react';
// import { Button } from 'reactstrap';

// const UserListItem = ({ user, onDeleteClick , onUpdateClick}) => {

//     const stringToHslColor = (str = '') => {
//         let hash = 0;
//         for (let i = 0; i < str.length; i++) {
//             hash = str.charCodeAt(i) + ((hash << 5) - hash);
//         }

//         const h = hash % 360;
//         return `hsl(${h},60%,80%)`;
//     };

//     return (
//     <div style={{ display: 'flex', alignItems: 'center' }}>
//         <div style={{ paddingLeft: '10px', width: '50px', textAlign: 'left' }}>
//             {user.id}
//         </div>
//         <div style={{
//             marginLeft: '100px',
//             textAlign: 'center',
//             height: '40px',
//             width: '40px',
//             lineHeight: '40px',
//             borderRadius: '50%',
//             color: 'white',
//             fontWeight: 'bold',
//             background: stringToHslColor(user.firstName + user.lastName)
//         }}>
//             {!!user && !!user.firstName && !!user.lastName ? user.firstName[0].toUpperCase() + user.lastName[0].toUpperCase() : ''}
//         </div>
//         <div style={{ margin: 'auto 0', flexGrow: 1, paddingLeft: '10px' }}>
//             {user.firstName} {user.lastName}
//         </div>
//         <div style={{ margin: 'auto 0' }}>
//             <Button size="sm" color="danger" outline onClick={() => {
//                 if (window.confirm("bạn có muốn t xóa ko")) {
//                     onDeleteClick(user.id);
//                 }
//             }}
//             >
//                 Delete
//             </Button>

//              <Button size="sm" color="danger" outline onClick={() => {
//                 if (window.confirm("bạn có muốn cập nhật")) {
//                     onUpdateClick({
//                      userId :   user.id,
//                      firstName : document.getElementById('firstName').value,
//                      lastName : document.getElementById('lastName').value
//                     });
//                 }
//             }}
//             >
//                 Update
//             </Button>

//         </div>
//     </div>
// );
// };

// export default UserListItem;
