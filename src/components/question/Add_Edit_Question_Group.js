import React, { Component } from "react";
import "../../style/RoleEdit.css";   // ✅ import CSS riêng

import { Form, Input, Checkbox, Button, Card, Row, Col, Radio, Spin, Modal } from "antd";
import * as api from "../../api/questionGroups";
import { message } from "antd";

class AddEditQuestionGroup extends Component {
    formRef = React.createRef();

    state = {
        questionsData: [], // ✅ dữ liệu câu hỏi
        loading: false,
        id: null,
    };

    async componentDidMount() {
        const params = new URLSearchParams(window.location.search);
        const id = params.get("id");
        if (id) {
            this.setState({ loading: true, id });
            try {
                const res = await api.getQuestionGroup(id);
                this.handleLoadQuestions(res.data); // ✅ xử lý riêng
            } catch (err) {
                console.error(err);
            } finally {
                this.setState({ loading: false });
            }
        }
    }
    getPageInfo = () => {
        const path = window.location.pathname;
        const parts = path.split("/").filter(Boolean);
        const lastPart = parts[parts.length - 1]; // lấy đoạn cuối

        if (lastPart === "answers") {
            return "answers";
        } else if (lastPart === "add_group") {
            return "add_group";
        } else if (lastPart === "edit_group") {
            return "edit_group";
        }
        return null;
    }


    handleLoadQuestions = (data) => {
        const groupName = data.name || "";
        const questions = data.data || [];

        this.setState({
            questionsData: [
                {
                    id: data.id,
                    name: groupName,
                    data: questions,
                },
            ],
        });

        if (this.getPageInfo() === "answers") {
            if (this.formRef.current) {
                this.formRef.current.setFieldsValue({
                    name: groupName,
                    // ...this.mapAnswersToForm(questions, data.id),
                });
            }
        }
        else if (this.getPageInfo() === "edit_group") {
            if (this.formRef.current) {
                this.formRef.current.setFieldsValue({
                    name: groupName,
                    ...this.mapAnswersToForm(questions, data.id),
                });
            }
        }
        else if (this.getPageInfo() === "add_group") {
            // if (this.formRef.current) {
            //     this.formRef.current.setFieldsValue({
            //         name: "",
            //         ...this.mapAnswersToForm(questions, data.id),
            //     });
            // }
        }
    };

    mapAnswersToForm = (questions, groupId) => {
        const values = {};
        questions.forEach((q, qIdx) => {
            const fieldName = `question_${groupId}_${qIdx}`;

            if (q.type === "Single") {
                const correct = q.answers.find((a) => a.isCorrect);
                values[fieldName] = correct ? correct.text : null;
            } else if (q.type === "Multiple") {
                values[fieldName] = q.answers
                    .filter((a) => a.isCorrect)
                    .map((a) => a.text);
            }
        });
        return values;
    };
    // 📌 Xử lý submit form
    handleSubmit = async (values) => {
        try {
            const id = (this.props.match && this.props.match.params && this.props.match.params.id) || null;

            let response;
            console.log("Form values on submit:", values);
            // if (id) {
            //     // ✅ Gọi API update nhóm câu hỏi
            //     response = await api.updateQuestionGroup(id, values);
            //     message.success("Cập nhật nhóm câu hỏi thành công!");
            // } else {
            //     // ✅ Gọi API tạo mới nhóm câu hỏi
            //     response = await api.createQuestionGroup(values);
            //     message.success("Thêm nhóm câu hỏi thành công!");
            // }

            // // Sau khi thêm/sửa xong thì quay lại danh sách
            // this.props.history.push("/list_question");
        } catch (error) {
            console.error("Lỗi khi lưu nhóm câu hỏi:", error);
            message.error("Có lỗi xảy ra, vui lòng thử lại!");
        }
    };


    // handleSubmit = async (values) => {
    //     const { id } = this.state;
    //     const { name, description, permissions } = values;

    //     this.setState({ loading: true });

    //     try {
    //         // Chuyển mảng permissions thành object { KEY: 1, ... }
    //         const permissionsObj = {};
    //         (permissions || []).forEach(key => {
    //             permissionsObj[key] = 1;
    //         });

    //         if (id) {
    //             // Lấy permission hiện tại của role để giữ các key không chọn = 0
    //             const currentRole = await api.getRole(id);
    //             const updatedPermissions = { ...currentRole.data.permissions };

    //             // Cập nhật các key được chọn = 1, còn lại giữ nguyên
    //             Object.keys(updatedPermissions).forEach(key => {
    //                 updatedPermissions[key] = permissionsObj[key] ? 1 : 0;
    //             });

    //             await api.updateRole({ id, name, mo_ta: description, permissions: updatedPermissions });
    //             message.success("Cập nhật role thành công!");
    //         } else {
    //             // Tạo mới role, permissions mặc định = 0 + key được chọn = 1
    //             const defaultPermissions = {};
    //             this.state.permissions.forEach(group => {
    //                 group.options.forEach(opt => {
    //                     defaultPermissions[opt.value] = permissionsObj[opt.value] ? 1 : 0;
    //                 });
    //             });


    //             await api.createRole({ id: name.toUpperCase(), name, mo_ta: description, permissions: defaultPermissions });
    //             message.success("Tạo mới role thành công!");
    //         }

    //         // Quay lại trang role
    //         if (this.props.go_page_role) {
    //             this.props.go_page_role();
    //         }
    //     } catch (error) {
    //         console.error(error);
    //         message.error("Có lỗi xảy ra, vui lòng thử lại.");
    //     } finally {
    //         this.setState({ loading: false });
    //     }
    // };



    handleClickHuy = () => {
        if (this.props.go_page_question_group) {
            this.props.go_page_question_group(); // gọi hàm do cha truyền xuống
        }
    };

    renderQuestionActions = (groupId, qIdx) => {
        if (this.getPageInfo() === "answers") {
            return null;
        }

        return (
            <div className="question-actions">
                {/* Hàng 1: Thêm + Xóa */}
                <div className="action-top">
                    <Button
                        size="small"
                        type="link"
                        onClick={() => this.handleAddQuestion(groupId, qIdx)}
                    >
                        Thêm
                    </Button>
                    <Button
                        size="small"
                        type="link"
                        danger
                        onClick={() => {
                            Modal.confirm({
                                title: "Bạn có muốn xóa nhóm câu hỏi này không?",
                                okText: "Yes",
                                okType: "danger",
                                cancelText: "No",
                                onOk: () => {
                                    this.handleDeleteQuestion(groupId, qIdx);
                                },

                            });
                        }}
                    >
                        Xóa
                    </Button>
                </div>

                {/* Hàng 2: Sửa (nằm dưới chữ Thêm) */}
                <div className="action-bottom">
                    <Button
                        size="small"
                        type="link"
                        onClick={() => this.handleEditQuestion(groupId, qIdx)}
                    >
                        Sửa
                    </Button>
                </div>
            </div>
        );
    };

    handleAddQuestion = (questionId, groupId) => {
        console.log("Add question to group:", questionId, groupId);
        // TODO: mở form thêm câu hỏi mới
    };


  handleDeleteQuestion = async (groupId, qIdx) => {
    try {
        await api.deleteQuestionInGroup({ groupId, index: qIdx });

        this.setState((prevState) => {
            const updatedGroups = prevState.questionsData.map((group) => {
                if (group.id === groupId) {
                    return {
                        ...group,
                        data: group.data.filter((_, idx) => idx !== qIdx),
                    };
                }
                return group;
            });
            return { questionsData: updatedGroups };
        });

        message.success("Xóa câu hỏi thành công!");
    } catch (error) {
        console.error("Lỗi khi xóa câu hỏi:", error);
        message.error("Xóa câu hỏi thất bại!");
    }
};

    handleEditQuestion = (questionId, groupId) => {
        console.log("Edit:", questionId, groupId);
        // TODO: mở form sửa, hoặc setState để chỉnh sửa
    };


    renderQuestions = (questionsData) => {
        // const { questionsData } = this.state;
        return (
            <Form.Item label="Câu hỏi">
                {questionsData.map((group) => (
                    <div key={group.id} className="permission-group">

                        <strong className="group-label">{group.name}</strong>

                        {group.data.map((q, qIdx) => (
                            // <Form.Item
                            //     key={`${group.id}-${qIdx}`}
                            //     name={`question_${group.id}_${qIdx}`}
                            //     label={q.item}
                            //     rules={[{ required: true, message: "Vui lòng chọn đáp án!" }]}
                            // >
                            //     {q.type === "Single" ? (
                            //         <Radio.Group className="options-grid">
                            //             {q.answers.map((ans, i) => (
                            //                 <Radio key={i} value={ans.text} className="checkbox-item">
                            //                     <span className="checkbox-label">{ans.text}</span>
                            //                 </Radio>
                            //             ))}
                            //         </Radio.Group>
                            //     ) : (
                            //         <Checkbox.Group className="options-grid">
                            //             {q.answers.map((ans, i) => (
                            //                 <Checkbox key={i} value={ans.text} className="checkbox-item">
                            //                     <span className="checkbox-label">{ans.text}</span>
                            //                 </Checkbox>
                            //             ))}
                            //         </Checkbox.Group>
                            //     )}
                            // </Form.Item>
                            <Form.Item
                                key={`${group.id}-${qIdx}`}
                                name={`question_${group.id}_${qIdx}`}
                                label={
                                    <div>
                                        <div className="question-label">

                                            <span className="question-text">{q.item}</span>

                                            {this.renderQuestionActions(group.id, qIdx)}

                                        </div>

                                    </div>
                                }
                                rules={[{ required: true, message: "Vui lòng chọn đáp án!" }]}
                            >
                                {q.type === "Single" ? (
                                    <Radio.Group className="options-grid">
                                        {q.answers.map((ans, i) => (
                                            <Radio key={i} value={ans.text} className="checkbox-item">
                                                <span className="checkbox-label">{ans.text}</span>
                                            </Radio>
                                        ))}
                                    </Radio.Group>
                                ) : (
                                    <Checkbox.Group className="options-grid">
                                        {q.answers.map((ans, i) => (
                                            <Checkbox key={i} value={ans.text} className="checkbox-item">
                                                <span className="checkbox-label">{ans.text}</span>
                                            </Checkbox>
                                        ))}
                                    </Checkbox.Group>
                                )}
                            </Form.Item>

                        ))}
                    </div>
                ))}
            </Form.Item>

        );


    };



    render() {
        const { questionsData, loading } = this.state;
        // if (loading || questionsData.length === 0) {
        //     return (
        //         <div className="page-container">
        //             <Spin size="large" tip="Đang tải dữ liệu..." />
        //         </div>
        //     );
        // }
        return (
            <div className="page-container">

                <Card
                    className="card-container"
                    bodyStyle={{ padding: 0 }}
                >


                    {/* <Spin spinning={loading}> */}
                    <Form
                        ref={this.formRef}
                        layout="vertical"
                        onFinish={this.handleSubmit}
                        className="form-container"

                    >
                        {/* Tên nhóm */}
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    name="name"
                                    label="Tên nhóm"
                                    rules={[{ required: true, message: "Vui lòng nhập tên nhóm!" }]}
                                >
                                    <Input.TextArea placeholder="Nhập tên nhóm câu hỏi" rows={2} />
                                </Form.Item>
                            </Col>
                        </Row>

                        {/* Danh sách câu hỏi động */}
                        {this.renderQuestions(questionsData)}

                        {/* Nút hành động */}
                        <Row justify="end" gutter={8} className="button-row">
                            <Col>
                                <Button danger onClick={() => this.handleClickHuy()}>
                                    Hủy
                                </Button>
                            </Col>
                            <Col>
                                <Button type="primary" htmlType="submit" loading={loading}>
                                    {this.getPageInfo() === "answers" ? "Nộp bài" : "Lưu"}
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                    {/* </Spin> */}
                </Card>
            </div>


        );
    }


}

export default AddEditQuestionGroup;