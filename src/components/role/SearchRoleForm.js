import React, { Component } from "react";
import { Input, Button, Space } from "antd";
import { SearchOutlined, DeleteOutlined } from "@ant-design/icons";

class UserSearchBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nameRole: props.initialRoleName || "",

    };
  }
  componentDidUpdate(prevProps) {
    if (prevProps.initialRoleName !== this.props.initialRoleName) {
      this.setState({ nameRole: this.props.initialRoleName || "" });
    }
  }

  handleInputChange = (e, field) => {
    this.setState({ [field]: e.target.value });
  };

  handleSearch = () => {
    const { nameRole } = this.state;
    console.log("Searching with:", { nameRole });
    // Gọi callback từ props nếu có, truyền giá trị tìm kiếm
    if (this.props.onSearch) {
      this.props.onSearch({ nameRole });
    }
  };

  handleReset = () => {
    this.setState({ nameRole: "" });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    const { nameRole } = this.state;

    return (
      <div
        style={{
          background: "#fff", // nền trắng
          marginBottom: "16px", // khoảng cách dưới
          marginTop: "16px",
        }}
      >
        <Space style={{ width: "100%" }} size="middle">
          <Input
            placeholder="Tên Quyền"
            style={{ width: 200 }}
            value={this.state.nameRole}
            onChange={(e) => this.handleInputChange(e, "nameRole")}
          />
          {/* <Input
            placeholder="Số điện thoại"
            style={{ width: 200 }}
            value={phone}
            onChange={(e) => this.handleInputChange(e, "phone")}
          /> */}
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
