import React, { Component } from "react";
import "../../style/RoleEdit.css";   // ✅ import CSS riêng

import { Form, Input, Checkbox, Button, Card, Row, Col } from "antd";
import * as api from "../../api/role";
import { message } from "antd";

class RoleEdit extends Component {
    formRef = React.createRef();

    state = {
        permissions: [],
        loading: false,
        id: null,
    };

    async componentDidMount() {
        this.setState({
            permissions: [
                {
                    label: "Subject History",
                    options: [
                        { label: "Get list subject history", value: "GET_LIST_SUBJECT_HISTORY" },
                        { label: "Get subject history", value: "GET_SUBJECT_HISTORY" },
                    ],
                },
                {
                    label: "Group",
                    options: [
                        { label: "Delete group", value: "DELETE_GROUP" },
                        { label: "Delete group permission", value: "DELETE_GROUP_PERMISSION" },
                    ],
                },
                {
                    label: "Lecture Content",
                    options: [
                        { label: "Update content", value: "UPDATE_LECTURE_CONTENT" },
                        { label: "Get content", value: "GET_LECTURE_CONTENT" },
                        { label: "Get content by lecture id", value: "GET_LECTURE_CONTENT_BY_ID" },
                        { label: "Delete lecture content", value: "DELETE_LECTURE_CONTENT" },
                        { label: "Create lecture content", value: "CREATE_LECTURE_CONTENT" },
                        { label: "Get list lecture content", value: "GET_LIST_LECTURE_CONTENT" },
                    ],
                },
                {
                    label: "File",
                    options: [
                        { label: "Upload video", value: "UPLOAD_VIDEO" },
                        { label: "Upload file", value: "UPLOAD_FILE" },
                    ],
                },
                {
                    label: "Account Book",
                    options: [
                        { label: "Create account book", value: "CREATE_ACCOUNT_BOOK" },
                        { label: "Delete account book", value: "DELETE_ACCOUNT_BOOK" },
                        { label: "Get account book", value: "GET_ACCOUNT_BOOK" },
                        { label: "Get list account book", value: "GET_LIST_ACCOUNT_BOOK" },
                    ],
                },
                {
                    label: "Book Permission",
                    options: [
                        { label: "Synchronize book permission", value: "SYNC_BOOK_PERMISSION" },
                        { label: "Delete book permission", value: "DELETE_BOOK_PERMISSION" },
                        { label: "Get book permission", value: "GET_BOOK_PERMISSION" },
                        { label: "Get list book permission", value: "GET_LIST_BOOK_PERMISSION" },
                    ],
                },
                {
                    label: "Account Group",
                    options: [
                        { label: "List account group", value: "LIST_ACCOUNT_GROUP" },
                        { label: "Get account group", value: "GET_ACCOUNT_GROUP" },
                        { label: "Delete account group", value: "DELETE_ACCOUNT_GROUP" },
                    ],
                },
                {
                    label: "Category",
                    options: [
                        { label: "List category", value: "LIST_CATEGORY" },
                        { label: "Get category", value: "GET_CATEGORY" },
                        { label: "Update category", value: "UPDATE_CATEGORY" },
                        { label: "Create category", value: "CREATE_CATEGORY" },
                        { label: "Delete category", value: "DELETE_CATEGORY" },
                    ],
                },
                {
                    label: "Lecture",
                    options: [
                        { label: "Get lecture by subject", value: "GET_LECTURE_BY_SUBJECT" },
                        { label: "Get list lecture", value: "GET_LIST_LECTURE" },
                        { label: "Update lecture", value: "UPDATE_LECTURE" },
                        { label: "Create lecture", value: "CREATE_LECTURE" },
                        { label: "Delete lecture", value: "DELETE_LECTURE" },
                        { label: "Update sort lecture", value: "UPDATE_SORT_LECTURE" },
                    ],
                },
                {
                    label: "Publisher",
                    options: [
                        { label: "Delete publisher", value: "DELETE_PUBLISHER" },
                        { label: "Get publisher", value: "GET_PUBLISHER" },
                        { label: "Create publisher", value: "CREATE_PUBLISHER" },
                        { label: "Get list publisher", value: "GET_LIST_PUBLISHER" },
                    ],
                },
                {
                    label: "Reader",
                    options: [
                        { label: "Delete reader", value: "DELETE_READER" },
                        { label: "Get reader", value: "GET_READER" },
                        { label: "Create reader", value: "CREATE_READER" },
                        { label: "Get list reader", value: "GET_LIST_READER" },
                        { label: "Update reader", value: "UPDATE_READER" },
                    ],
                },
                {
                    label: "Setting",
                    options: [
                        { label: "Create setting", value: "CREATE_SETTING" },
                        { label: "Get setting", value: "GET_SETTING" },
                        { label: "Get list setting", value: "GET_LIST_SETTING" },
                        { label: "Update setting", value: "UPDATE_SETTING" },
                    ],
                },
                {
                    label: "Permission",
                    options: [
                        { label: "Create permission", value: "CREATE_PERMISSION" },
                        { label: "List permission", value: "LIST_PERMISSION" },
                        { label: "Update group permission", value: "UPDATE_GROUP_PERMISSION" },
                        { label: "Get group permission", value: "GET_GROUP_PERMISSION" },
                        { label: "Create group permission", value: "CREATE_GROUP_PERMISSION" },
                        { label: "Get list group permission", value: "GET_LIST_GROUP_PERMISSION" },
                    ],
                },
                {
                    label: "Account",
                    options: [
                        { label: "Update admin account", value: "UPDATE_ADMIN_ACCOUNT" },
                        { label: "Create admin account", value: "CREATE_ADMIN_ACCOUNT" },
                        { label: "Delete account", value: "DELETE_ACCOUNT" },
                        { label: "Get account", value: "GET_ACCOUNT" },
                        { label: "Get list account", value: "GET_LIST_ACCOUNT" },
                    ],
                },
            ],
        });

        const params = new URLSearchParams(window.location.search);
        const id = params.get("id");

        if (id) {
            this.setState({ loading: true, id });
            try {
                const res = await api.getRole(id);
                console.log("Role data:", res.data);

                if (this.formRef.current) {
                    // Lấy danh sách permission = 1
                    const checkedPermissions = Object.keys(res.data.permissions || {}).filter(
                        key => res.data.permissions[key] === 1
                    );

                    // Set form values
                    this.formRef.current.setFieldsValue({
                        name: res.data.name,
                        description: res.data.mo_ta,
                        permissions: checkedPermissions,
                    });
                }
            } finally {
                this.setState({ loading: false });
            }
        }
    }

    handleSubmit = async (values) => {
        const { id } = this.state;
        const { name, description, permissions } = values;

        this.setState({ loading: true });

        try {
            // Chuyển mảng permissions thành object { KEY: 1, ... }
            const permissionsObj = {};
            (permissions || []).forEach(key => {
                permissionsObj[key] = 1;
            });

            if (id) {
                // Lấy permission hiện tại của role để giữ các key không chọn = 0
                const currentRole = await api.getRole(id);
                const updatedPermissions = { ...currentRole.data.permissions };

                // Cập nhật các key được chọn = 1, còn lại giữ nguyên
                Object.keys(updatedPermissions).forEach(key => {
                    updatedPermissions[key] = permissionsObj[key] ? 1 : 0;
                });

                await api.updateRole({ id, name, mo_ta: description, permissions: updatedPermissions });
                message.success("Cập nhật role thành công!");
            } else {
                // Tạo mới role, permissions mặc định = 0 + key được chọn = 1
                const defaultPermissions = {};
                this.state.permissions.forEach(group => {
                    group.options.forEach(opt => {
                        defaultPermissions[opt.value] = permissionsObj[opt.value] ? 1 : 0;
                    });
                });


                await api.createRole({ id: name.toUpperCase(), name, mo_ta: description, permissions: defaultPermissions });
                message.success("Tạo mới role thành công!");
            }

            // Quay lại trang role
            if (this.props.go_page_role) {
                this.props.go_page_role();
            }
        } catch (error) {
            console.error(error);
            message.error("Có lỗi xảy ra, vui lòng thử lại.");
        } finally {
            this.setState({ loading: false });
        }
    };



    handleClickHuy = () => {
        if (this.props.go_page_role) {
            this.props.go_page_role(); // gọi hàm do cha truyền xuống
        }
    };




    render() {
        const { permissions, loading } = this.state;

        return (
            <div className="page-container">
                <Card
                    className="card-container"
                    bodyStyle={{ padding: 0 }}
                >
                    <Form
                        ref={this.formRef}
                        layout="vertical"
                        onFinish={this.handleSubmit}
                        className="form-container"
                    >
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    name="name"
                                    label="Tên"
                                    rules={[{ required: true }]}
                                >
                                    <Input placeholder="ROLE_ADMIN" />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="description"
                                    label="Mô tả"
                                    rules={[{ required: true }]}
                                >
                                    <Input.TextArea placeholder="Nhập mô tả" rows={4} />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Form.Item name="permissions" label="Quyền">
                            <Checkbox.Group className="checkbox-group">
                                {permissions.map((group) => (
                                    <div
                                        key={group.label}
                                        className="permission-group"
                                    >
                                        <strong className="group-label">
                                            {group.label}
                                        </strong>

                                        <div className="options-grid">
                                            {group.options.map((opt) => (
                                                <Checkbox
                                                    key={opt.value}
                                                    value={opt.value}
                                                    className="checkbox-item"
                                                >
                                                    <span className="checkbox-label"
                                                        style={{
                                                            WebkitBoxOrient: "vertical",
                                                        }}
                                                    >
                                                        {opt.label}
                                                    </span>
                                                </Checkbox>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </Checkbox.Group>
                        </Form.Item>

                        <Row justify="end" gutter={8} className="button-row">
                            <Col>
                                <Button danger onClick={() => this.handleClickHuy()}>
                                    Hủy
                                </Button>
                            </Col>
                            <Col>
                                <Button type="primary" htmlType="submit" loading={loading}>
                                    Lưu
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </Card>
            </div>
        );
    }

    // render() {
    //     const { permissions, loading } = this.state;

    //     return (
    //         <div style={{ background: "#ebeef4ff", minHeight: "100vh", marginTop: "12px" }}>
    //             <Card
    //                 style={{
    //                     width: "100%",
    //                     maxWidth: 1024,
    //                     marginLeft: 0,
    //                     border: "none",
    //                     boxShadow: "none"
    //                 }}
    //                 bodyStyle={{ padding: 0 }}
    //             >
    //                 <Form
    //                     ref={this.formRef}
    //                     layout="vertical"
    //                     onFinish={this.handleSubmit}
    //                     style={{ width: "100%", padding: "25px 20px" }}
    //                 >
    //                     <Row gutter={16}>
    //                         <Col span={12}>
    //                             <Form.Item
    //                                 name="name"
    //                                 label="Tên"
    //                                 rules={[{ required: true }]}
    //                             >
    //                                 <Input placeholder="ROLE_ADMIN" />
    //                             </Form.Item>
    //                         </Col>
    //                         <Col span={12}>
    //                             <Form.Item
    //                                 name="description"
    //                                 label="Mô tả"
    //                                 rules={[{ required: true }]}
    //                             >
    //                                 <Input.TextArea placeholder="Nhập mô tả" rows={4} />
    //                             </Form.Item>
    //                         </Col>
    //                     </Row>

    //                     <Form.Item name="permissions" label="Quyền">
    //                         <Checkbox.Group style={{ width: "100%" }}>
    //                             {permissions.map((group) => (
    //                                 <div
    //                                     key={group.label}
    //                                     style={{
    //                                         width: "100%",
    //                                         marginBottom: 30,
    //                                         border: "1px solid #d9d9d9",
    //                                         borderRadius: 4,
    //                                         padding: "4px 0"
    //                                     }}
    //                                 >
    //                                     <strong
    //                                         style={{
    //                                             display: "block",
    //                                             width: "100%",
    //                                             marginBottom: 3,
    //                                             borderBottom: "1px solid #d9d9d9",
    //                                             paddingBottom: 6,
    //                                             paddingLeft: 10,
    //                                             paddingRight: 10,
    //                                             boxSizing: "border-box"
    //                                         }}
    //                                     >
    //                                         {group.label}
    //                                     </strong>

    //                                     <div
    //                                         style={{
    //                                             display: "grid",
    //                                             gridTemplateColumns: "repeat(3, 1fr)",
    //                                             gap: "16px",
    //                                             padding: "10px 10px 23px",
    //                                             boxSizing: "border-box"
    //                                         }}
    //                                     >
    //                                         {group.options.map((opt) => (
    //                                             <Checkbox
    //                                                 key={opt.value}
    //                                                 value={opt.value}
    //                                                 style={{ display: "flex", alignItems: "center" }}
    //                                             >
    //                                                 <span
    //                                                     style={{
    //                                                         display: "-webkit-box",
    //                                                         WebkitLineClamp: 2,
    //                                                         WebkitBoxOrient: "vertical",
    //                                                         overflow: "hidden",
    //                                                         textOverflow: "ellipsis",
    //                                                         whiteSpace: "normal",
    //                                                         lineHeight: "1.4",
    //                                                         wordBreak: "break-word",
    //                                                         maxWidth: "100%",
    //                                                         boxSizing: "border-box"
    //                                                     }}
    //                                                 >
    //                                                     {opt.label}
    //                                                 </span>
    //                                             </Checkbox>
    //                                         ))}
    //                                     </div>
    //                                 </div>
    //                             ))}
    //                         </Checkbox.Group>
    //                     </Form.Item>

    //                     <Row justify="end" gutter={8} style={{ marginTop: 16 }}>
    //                         <Col>
    //                             <Button danger onClick={() => this.handleClickHuy()}>
    //                                 Hủy
    //                             </Button>
    //                         </Col>
    //                         <Col>
    //                             <Button type="primary" htmlType="submit" loading={loading}>
    //                                 Lưu
    //                             </Button>
    //                         </Col>
    //                     </Row>
    //                 </Form>
    //             </Card>
    //         </div>
    //     );
    // }

}

export default RoleEdit;