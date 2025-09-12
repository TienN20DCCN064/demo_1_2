import React, { Component } from "react";
import { Input, Button, Space, Row, Col } from "antd";
import { SearchOutlined, DeleteOutlined } from "@ant-design/icons";

class QuestionGroupSearchBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      groupName: props.initialGroupName || "", // giá trị khởi tạo từ props
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.initialGroupName !== this.props.initialGroupName) {
      this.setState({ groupName: this.props.initialGroupName || "" });
    }
  }

  handleInputChange = (e) => {
    this.setState({ groupName: e.target.value });
  };

  handleSearch = () => {
    const { groupName } = this.state;
    console.log("Searching Question Groups with:", groupName);
    // Gọi callback từ props nếu có
    if (this.props.onSearch) {
      this.props.onSearch({ groupName });
    }
  };

  handleReset = () => {
    this.setState({ groupName: "" });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    const { groupName } = this.state;

    return (
      <div
          style={{
          background: "#fff", // nền trắng
          marginBottom: "16px", // khoảng cách dưới
          marginTop: "16px",
        }}
      >
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <Input
              placeholder="Tên nhóm câu hỏi"
              value={groupName}
              onChange={this.handleInputChange}
            />
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Space style={{ width: "100%" }}>
              <Button
                type="primary"
                icon={<SearchOutlined />}
                onClick={this.handleSearch}
              >
                Tìm kiếm
              </Button>
              <Button danger icon={<DeleteOutlined />} onClick={this.handleReset}>
                Xóa
              </Button>
            </Space>
          </Col>
        </Row>
      </div>
    );
  }
}

export default QuestionGroupSearchBar;
