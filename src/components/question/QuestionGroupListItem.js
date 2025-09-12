import React from "react";
import { Table, Button, Modal } from "antd";
import { DeleteOutlined, EditOutlined, ReadOutlined } from "@ant-design/icons";
import "../../style/UserEdit.css";   // ✅ import CSS riêng

function handleCheckPageParam() {
  const query = new URLSearchParams(window.location.search);
  if (!query.get("page") || !query.get("pageSize")) {
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

const QuestionGroupListItem = ({
  data,
  onDeleteClick,
  onEditClick,
  onStartQuizClick,
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
      title: "#",
      key: "index",
      width: 60,
      align: "center",
      render: (_, __, index) => index + 1, // index bắt đầu từ 0, nên +1
    },
    {
      title: "Tên Nhóm",
      dataIndex: "name",
      key: "name",
      ellipsis: true,
    },
    {
      title: "Số câu hỏi",
      key: "questionCount",
      render: (_, record) => (record.data && record.data.length) ? record.data.length : 0,

      // align: "center",
      ellipsis: true,
    },
    {
      title: "Hành động",
      key: "action",
      align: "right",
      width: 150,
      ellipsis: true,
      render: (_, record) => (
        <div>
          <Button
            size="small"
            type="primary"
            icon={<ReadOutlined />}
            onClick={() => onStartQuizClick(record.id)}
            style={{ marginLeft: 8 }}
          />
          <Button
            size="small"
            type="dashed"
            icon={<EditOutlined />}
            onClick={() => onEditClick(record.id)}
            style={{ marginLeft: 8 }}
          />
          <Button
            size="small"
            danger
            type="primary"
            icon={<DeleteOutlined />}
            onClick={() =>
              Modal.confirm({
                title: "Bạn có muốn xóa nhóm câu hỏi này không?",
                okText: "Yes",
                okType: "danger",
                cancelText: "No",
                onOk() {
                  onDeleteClick(record.id);
                },
              })
            }
            style={{ marginLeft: 8 }}
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
            return null; // ẩn số 1 nếu chỉ có 1 trang
          }
          return originalElement;
        },
      }}
      onChange={handleTableChange}
      style={{ width: "100%" }}     // fit cha
      tableLayout="fixed"
    />
  );
};

export default QuestionGroupListItem;
