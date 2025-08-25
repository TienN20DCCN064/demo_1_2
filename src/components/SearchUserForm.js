import React, { Component } from "react";
import { Input, Button, Space } from "antd";
import { SearchOutlined, DeleteOutlined } from "@ant-design/icons";

class UserSearchBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      phone: ""
    };
  }

  handleInputChange = (e, field) => {
    this.setState({ [field]: e.target.value });
  };

  handleSearch = () => {
    const { name, phone } = this.state;
    console.log("Searching with:", { name, phone });
    // Gọi callback từ props nếu có, truyền giá trị tìm kiếm
    if (this.props.onSearch) {
      this.props.onSearch({ name, phone });
    }
  };

  handleReset = () => {
    this.setState({ name: "", phone: "" });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    const { name, phone } = this.state;

    return (
      <div
        style={{
          background: "#fff",
          padding: "16px",
          marginBottom: "16px",
          borderRadius: "8px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        }}
      >
        <Space style={{ width: "100%" }} size="middle">
          <Input
            placeholder="Họ và tên"
            style={{ width: 200 }}
            value={name}
            onChange={(e) => this.handleInputChange(e, "name")}
          />
          <Input
            placeholder="Số điện thoại"
            style={{ width: 200 }}
            value={phone}
            onChange={(e) => this.handleInputChange(e, "phone")}
          />
          <Button
            type="primary"
            icon={<SearchOutlined />}
            onClick={this.handleSearch}
          >
            Tìm kiếm
          </Button>

          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={this.handleReset}
          >
            Xóa
          </Button>
        </Space>
      </div>
    );
  }
}

export default UserSearchBar;
