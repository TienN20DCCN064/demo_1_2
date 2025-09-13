import React, { Component, createRef } from "react";
import { Input, Button, Select, List, message } from "antd";

const { Option } = Select;

export default class NumberForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            inputValue: "",
            numbers: [],      // Dữ liệu cho Combobox
            divisors: [],     // Dữ liệu cho Listbox
            selectedNumber: null,
        };
        this.inputRef = createRef(); // Để focus vào textbox khi load
    }

    componentDidMount() {
        // Khi component load, focus vào input
        this.inputRef.current.focus();
    }

    isPrime = (num) => {
        if (num < 2) return false;
        for (let i = 2; i <= Math.sqrt(num); i++) {
            if (num % i === 0) return false;
        }
        return true;
    };

    getDivisors = (num) => {
        let divisors = [];
        for (let i = 1; i <= num; i++) {
            if (num % i === 0) divisors.push(i);
        }
        return divisors;
    };

    handleAddNumber = () => {
        const { inputValue, numbers } = this.state;
        const num = parseInt(inputValue);
        if (isNaN(num) || num <= 0) {
            message.error("Vui lòng nhập số nguyên dương hợp lệ!");
            return;
        }
        if (numbers.includes(num)) {
            message.warning("Số này đã có trong danh sách!");
            return;
        }
        this.setState(
            {
                numbers: [...numbers, num],
                inputValue: "",
            },
            () => this.inputRef.current.focus() // focus lại input
        );
    };

    handleSelectNumber = (value) => {
        const divisors = this.getDivisors(value);
        this.setState({
            selectedNumber: value,
            divisors,
        });
    };

    handleTotalDivisors = () => {
        const { divisors } = this.state;
        const total = divisors.reduce((a, b) => a + b, 0);
        message.info(`Tổng các ước số: ${total}`);
    };

    handleEvenDivisors = () => {
        const { divisors } = this.state;
        const count = divisors.filter((d) => d % 2 === 0).length;
        message.info(`Số lượng ước số chẵn: ${count}`);
    };

    handlePrimeDivisors = () => {
        const { divisors } = this.state;
        const count = divisors.filter((d) => this.isPrime(d)).length;
        message.info(`Số lượng ước số nguyên tố: ${count}`);
    };

    handleKeyPress = (e) => {
        if (e.key === "Enter") {
            this.handleAddNumber();
        }
    };

    render() {
        const { inputValue, numbers, divisors } = this.state;
        return (
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: "100vh",
                    backgroundColor: "#f0f2f5",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        gap: "40px",
                        padding: "30px",
                        border: "1px solid #ccc",
                        borderRadius: "12px",
                        backgroundColor: "#fff",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                        width: "800px", // tổng chiều rộng form
                        maxWidth: "90%", // co dãn trên màn hình nhỏ
                    }}
                >
                    {/* Bên trái */}
                    {/* Bên trái */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 10, flex: 1, marginTop: 20 }}>
                        <label>Nhập số:</label>
                        {/* Hàng Input + Button */}
                        <div style={{ display: "flex", gap: 10, }}>
                            <Input
                                ref={this.inputRef}
                                value={inputValue}
                                onChange={(e) => this.setState({ inputValue: e.target.value })}
                                onKeyPress={this.handleKeyPress}
                                style={{ flex: 0.6 }} // chiếm 60%
                            />
                            <Button
                                onClick={this.handleAddNumber}
                                // type="primary"
                                style={{ flex: 0.4 }} // chiếm 40%
                            >
                                Cập nhật
                            </Button>
                            
                        </div>
                        {/* 
  <label>Chọn số:</label> */}
                        <Select
                            style={{ width: "100%", marginTop: 30 }}
                            value={this.state.selectedNumber}
                            onChange={this.handleSelectNumber}
                            placeholder="Chọn số"
                        >
                            {numbers.map((num) => (
                                <Option key={num} value={num}>
                                    {num}
                                </Option>
                            ))}
                        </Select>
                    </div>


                    {/* Bên phải */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
                        <label>Danh sách các ước số:</label>
                        <List
                            bordered
                            style={{ width: "100%", height: 200, overflowY: "auto" }}
                            dataSource={divisors}
                            renderItem={(item) => <List.Item>{item}</List.Item>}
                        />

                        <Button onClick={this.handleTotalDivisors} style={{ width: "100%" }}>
                            Tổng các ước số
                        </Button>
                        <Button onClick={this.handleEvenDivisors} style={{ width: "100%" }}>
                            Số lượng các ước số chẵn
                        </Button>
                        <Button onClick={this.handlePrimeDivisors} style={{ width: "100%" }}>
                            Số lượng các ước số nguyên tố
                        </Button>
                    </div>
                </div>
            </div>

        );
    }

}
