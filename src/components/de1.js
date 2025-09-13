import React, { Component } from "react";
import { Table, Input, Button, Select, message, Modal, Row, Col } from "antd";

const { Option } = Select;
const { confirm } = Modal;

class ElectricityBilling extends Component {
  state = {
    customers: [],
    selectedRowKeys: [],
    total: 0,
    name: "",
    area: "",
    quota: 0,
    oldNumber: "",
    newNumber: "",
    consumption: "",
    amount: "",
  };

  areaQuotas = {
    "Khu vực 1": 50,
    "Khu vực 2": 100,
    "Khu vực 3": 150,
  };

  columns = [
    { title: "Họ tên", dataIndex: "name", key: "name" },
    { title: "Khu vực", dataIndex: "area", key: "area" },
    { title: "Định mức", dataIndex: "quota", key: "quota" },
    { title: "Tiêu thụ", dataIndex: "consumption", key: "consumption" },
    { title: "Thành tiền", dataIndex: "amount", key: "amount" },
  ];

  handleAreaChange = (value) => {
    this.setState({ area: value, quota: this.areaQuotas[value] });
  };

  handleInputChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  calculate = () => {
    const { name, area, quota, oldNumber, newNumber } = this.state;
    if (!name || !area || !oldNumber || !newNumber) {
      message.error("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    const oldNum = parseFloat(oldNumber);
    const newNum = parseFloat(newNumber);
    if (isNaN(oldNum) || isNaN(newNum) || newNum < oldNum) {
      message.error("Số điện không hợp lệ!");
      return;
    }

    const consumption = newNum - oldNum;
    let amount = 0;
    if (consumption <= quota) {
      amount = consumption * 500;
    } else {
      amount = quota * 500 + (consumption - quota) * 1000;
    }

    const newCustomer = {
      key: Date.now(),
      name,
      area,
      quota,
      consumption,
      amount,
    };

    this.setState((prevState) => ({
      customers: [...prevState.customers, newCustomer],
      total: prevState.total + amount,
      consumption,
      amount,
    }));
  };

  resetForm = () => {
    this.setState({
      name: "",
      area: "",
      quota: 0,
      oldNumber: "",
      newNumber: "",
      consumption: "",
      amount: "",
    });
  };

  deleteSelected = () => {
    const { selectedRowKeys, customers } = this.state;
    if (selectedRowKeys.length === 0) {
      message.warning("Chọn dòng cần xóa!");
      return;
    }
    confirm({
      title: "Bạn có chắc chắn muốn xóa dòng này?",
      onOk: () => {
        const remaining = customers.filter(
          (item) => !selectedRowKeys.includes(item.key)
        );
        const total = remaining.reduce((sum, item) => sum + item.amount, 0);
        this.setState({ customers: remaining, selectedRowKeys: [], total });
      },
    });
  };

  render() {
    const {
      customers,
      selectedRowKeys,
      total,
      name,
      area,
      quota,
      oldNumber,
      newNumber,
      consumption,
      amount,
    } = this.state;

    const rowSelection = {
      selectedRowKeys,
      onChange: (selectedRowKeys) => this.setState({ selectedRowKeys }),
    };

    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          backgroundColor: "#f0f2f5",
          padding: 20,
        }}
      >
        <div
          style={{
            width: "1200px",
            border: "1px solid #ccc",
            borderRadius: 8,
            backgroundColor: "#f5f5f5",
            padding: 20,
          }}
        >
          {/* Tiêu đề */}
          <h4 style={{ textAlign: "left", marginBottom: 20, paddingLeft: 10, fontSize: 20 }}>
            BÁO CÁO TIÊU THỤ ĐIỆN
          </h4>

          <Row gutter={16}>

            {/* Form bên trái */}
            <Col
              span={8}
              style={{
                borderRight: "1px solid #eee",
                backgroundColor: "#fafafa",
                borderRadius: "8px 0 0 8px",
                padding: 20,
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end", // <--- đẩy xuống dưới
              }}
            >
              <div>
                <Row gutter={[16, 10]} align="middle">
                  {/** HỌ TÊN KH **/}
                  <Col span={8} style={{ fontWeight: "bold" }}>HỌ TÊN KH:</Col>
                  <Col span={16}>
                    <Input
                      placeholder="Họ tên"
                      name="name"
                      value={name}
                      onChange={this.handleInputChange}
                      style={{ height: 30, fontSize: 14 }}
                    />
                  </Col>

                  {/** KHU VỰC **/}
                  <Col span={8} style={{ fontWeight: "bold" }}>KHU VỰC:</Col>
                  <Col span={16}>
                    <Select
                      placeholder="Chọn khu vực"
                      value={area || undefined}
                      onChange={this.handleAreaChange}
                      style={{ width: "100%", height: 30, fontSize: 14 }}
                    >
                      <Option value="Khu vực 1">Khu vực 1</Option>
                      <Option value="Khu vực 2">Khu vực 2</Option>
                      <Option value="Khu vực 3">Khu vực 3</Option>
                    </Select>
                  </Col>

                  {/** ĐỊNH MỨC **/}
                  <Col span={8} style={{ fontWeight: "bold" }}>ĐỊNH MỨC:</Col>
                  <Col span={16}>
                    <Input value={quota} disabled style={{ height: 30, fontSize: 14 }} />
                  </Col>

                  {/** SỐ CŨ **/}
                  <Col span={8} style={{ fontWeight: "bold" }}>SỐ CŨ:</Col>
                  <Col span={16}>
                    <Input
                      placeholder="Số cũ"
                      name="oldNumber"
                      value={oldNumber}
                      onChange={this.handleInputChange}
                      style={{ height: 30, fontSize: 14 }}
                    />
                  </Col>

                  {/** SỐ MỚI **/}
                  <Col span={8} style={{ fontWeight: "bold" }}>SỐ MỚI:</Col>
                  <Col span={16}>
                    <Input
                      placeholder="Số mới"
                      name="newNumber"
                      value={newNumber}
                      onChange={this.handleInputChange}
                      style={{ height: 30, fontSize: 14 }}
                    />
                  </Col>

                  {/** TIÊU THỤ **/}
                  <Col span={8} style={{ fontWeight: "bold" }}>TIÊU THỤ:</Col>
                  <Col span={16}>
                    <Input value={consumption} disabled style={{ height: 30, fontSize: 14 }} />
                  </Col>

                  {/** THÀNH TIỀN **/}
                  <Col span={8} style={{ fontWeight: "bold" }}>THÀNH TIỀN:</Col>
                  <Col span={16}>
                    <Input value={amount} disabled style={{ height: 30, fontSize: 14 }} />
                  </Col>
                </Row>
              </div>

              {/** Nút bấm và tổng tiền ở dưới cùng **/}
              <Row justify="space-between" align="middle" style={{ marginTop: 15 }}>
                {/* <Col>
                  <div style={{ fontWeight: "bold", fontSize: 16 }}>
                    TỔNG TIỀN: {total}
                  </div>
                </Col> */}
                <Col style={{ display: "flex", marginTop: 19, gap: 1 }}>
                  <Button type="primary" onClick={this.calculate}>TÍNH TIỀN</Button>
                  <Button onClick={this.resetForm}>NHẬP MỚI</Button>
                  {/* <Button danger onClick={this.deleteSelected}>XÓA</Button> */}
                  <Button onClick={() => window.close()}>THOÁT</Button>
                </Col>
              </Row>
            </Col>

            <Col
              span={16}
              style={{
                padding: 20,
                backgroundColor: "#f0f0f0", // nền xám chung cột phải
                borderRadius: "0 8px 8px 0",
                border: "1px solid #ccc",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
                height: "fit-content",
                minHeight: 400, // tổng cột phải cao hơn
              }}
            >
              {/* Ô chứa Table, nền trắng, cao hơn */}
              <div
                style={{
                  width: "100%",
                  backgroundColor: "#fff", // nền trắng riêng cho Table
                  padding: 10,
                  borderRadius: 6,
                  flexGrow: 1, // tự động mở rộng
                  minHeight: 250, // tăng chiều cao ô Table
                  marginBottom: 10,
                }}
              >
                <Table
                  rowSelection={{ type: "checkbox", ...rowSelection }}
                  columns={this.columns}
                  dataSource={customers}
                  pagination={false}
                  rowClassName={() => "custom-row"}
                  style={{ width: "100%", backgroundColor: "#fff" }}
                />
              </div>

              {/* Vùng tổng tiền + nút XÓA */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 10,
                  marginTop: 10,
                }}
              >
                <div
                  style={{
                    backgroundColor: "#e0e0e0",
                    padding: "5px 15px",
                    borderRadius: 6,
                    fontWeight: "bold",
                    fontSize: 16,
                    minWidth: 120,
                    textAlign: "center",
                  }}
                >
                  {total} đ
                </div>
                <Button danger onClick={this.deleteSelected}>XÓA</Button>
              </div>
            </Col>



          </Row>

          {/* CSS cho chiều cao row Table */}
          <style>{`
            .custom-row td {
              height: 30px; 
              line-height: 30px; 
              font-size: 14px;
            }
          `}</style>
        </div>
      </div>
    );
  }
}

export default ElectricityBilling;