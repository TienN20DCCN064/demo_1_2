import React, { Component } from "react";
import "../../style/Role_Question_Edit.css";   // ✅ import CSS riêng

import { Form, Input, Checkbox, Button, Card, Row, Col, Radio, Spin, Modal } from "antd";
import * as api from "../../api/questionGroups";
import { message } from "antd";
import { PlusOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import AddEditQuestionModal from "./FormAddQuestionModal";

class AddEditQuestionGroup extends Component {
    formRef = React.createRef();

    // state = {
    //     questionsData: [], // ✅ dữ liệu câu hỏi
    //     loading: false,
    //     id: null,
    // };
    state = {
        questionsData: [],
        loading: false,
        id: null,

        isAddQuestionModalVisible: false, // Thêm trạng thái cho modal
        currentGroupId: null, // Lưu groupId để biết thêm vào nhóm nào

        editingQuestion: null, // Lưu thông tin câu hỏi đang chỉnh sửa
        editingQuestionIndex: null, // Lưu index của câu hỏi trong nhóm

        currentQuestionIndex: null, // để check xem có phải là thêm sau hay là thêm cuối list
    };
    async componentDidMount() {
        const params = new URLSearchParams(window.location.search);
        const id = params.get("id");
        if (id) {
            this.setState({ loading: true, id });
            try {
                const res = await api.getQuestionGroup(id);
                this.handleLoadQuestions(res.data);
            } catch (err) {
                console.error(err);
                message.error("Lỗi khi tải dữ liệu!");
            } finally {
                this.setState({ loading: false });
            }
        } else {
            // Nếu là trang thêm mới, khởi tạo questionsData rỗng
            this.setState({
                questionsData: [{
                    id: null,
                    name: "",
                    data: []
                }]
            });
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

    handleSubmit = async (values) => {
        const { id, questionsData } = this.state;
        this.setState({ loading: true });

        try {
            const groupData = questionsData[0]; // Lấy nhóm đầu tiên (giả sử chỉ có 1 nhóm)

            // Cập nhật isCorrect trong questionsData dựa trên lựa chọn trong form
            const updatedData = groupData.data.map((q, qIdx) => {
                const fieldName = `question_${groupData.id || "new"}_${qIdx}`;
                const selectedValues = values[fieldName];

                const updatedAnswers = q.answers.map((ans) => {
                    let isCorrect = false;
                    if (q.type === "Single") {
                        isCorrect = selectedValues === ans.text;
                    } else if (q.type === "Multiple") {
                        isCorrect = Array.isArray(selectedValues) && selectedValues.includes(ans.text);
                    }
                    return { ...ans, isCorrect };
                });

                return { ...q, answers: updatedAnswers };
            });

            // Cập nhật questionsData với dữ liệu mới
            const updatedGroups = questionsData.map((group) => ({
                ...group,
                data: updatedData,
            }));

            this.setState({ questionsData: updatedGroups }, async () => {
                const payload = {
                    name: values.name || groupData.name,
                    data: updatedData, // Sử dụng data đã cập nhật
                };

                // có id là đang edit và làm bài 
                if (id) {
                    // làm bài 
                    if (this.getPageInfo() === "answers") {
                        console.log("Submitting answers:", values);
                    }
                    // cập nhật
                    else {
                        // Cập nhật nhóm câu hỏi
                        await api.updateQuestionGroup({ groupId: id, ...payload });
                        message.success("Cập nhật nhóm câu hỏi thành công!");
                    }
                } else {
                    // Tạo mới nhóm câu hỏi
                    await api.createQuestionGroup(payload);
                    message.success("Thêm nhóm câu hỏi thành công!");
                }

                if (this.props.go_page_question_group && this.getPageInfo() !== "answers") {
                    this.props.go_page_question_group(); // gọi hàm do cha truyền xuống
                }
            });
        } catch (error) {
            console.error("Lỗi khi lưu nhóm câu hỏi:", error);
            message.error("Có lỗi xảy ra, vui lòng thử lại!");
        } finally {
            this.setState({ loading: false });
        }
    };

    handleClickHuy = () => {
        if (this.props.go_page_question_group) {
            this.props.go_page_question_group(); // gọi hàm do cha truyền xuống
        }
    };


    //     if (this.getPageInfo() === "answers") {
    //         return null;
    //     }

    //     return (
    //         <div className="question-actions">
    //             {/* Hàng 1: Thêm + Xóa */}
    //             <div className="action-top">
    //                 <Button
    //                     size="small"
    //                     type="link"
    //                     onClick={() => this.handleAddQuestion(groupId, qIdx)}
    //                 >
    //                     Thêm
    //                 </Button>
    //                 <Button
    //                     size="small"
    //                     type="link"
    //                     danger
    //                     onClick={() => {
    //                         this.handleDeleteQuestion(groupId, qIdx);
    //                     }}
    //                 >
    //                     Xóa
    //                 </Button>
    //             </div>

    //             {/* Hàng 2: Sửa (nằm dưới chữ Thêm) */}
    //             <div className="action-bottom">
    //                 <Button
    //                     size="small"
    //                     type="link"
    //                     onClick={() => this.handleEditQuestion(groupId, qIdx)}
    //                 >
    //                     Sửa
    //                 </Button>
    //             </div>
    //         </div>
    //     );
    // };
    renderQuestionActions = (groupId, qIdx) => {
        if (this.getPageInfo() === "answers") {
            return null;
        }
        return (
            <div className="question-actions">
                <Button
                    size="small"
                    type="link"
                    icon={<PlusOutlined />}
                    onClick={() => this.handleAddQuestion(groupId, qIdx)}
                />
                <Button
                    size="small"
                    type="link"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => this.handleDeleteQuestion(groupId, qIdx)}
                />
                <Button
                    size="small"
                    type="link"
                    icon={<EditOutlined />}
                    onClick={() => this.handleEditQuestion(groupId, qIdx)}
                />
            </div>
        );
    };


    handleAddQuestion = (groupId, qIdx = null) => {
        console.log(groupId);
        this.setState({
            isAddQuestionModalVisible: true,
            currentGroupId: groupId,
            currentQuestionIndex: qIdx, // Lưu index câu hỏi để chèn sau
        });
    };


    handleAddQuestionSuccess = (newQuestion) => {
        this.setState(
            (prevState) => {
                const { currentGroupId, editingQuestion, editingQuestionIndex } = prevState;
                const updatedGroups = prevState.questionsData.map((group) => {
                    if (group.id === currentGroupId || (!currentGroupId && group.id === null)) {
                        if (editingQuestion) {
                            // Chế độ chỉnh sửa: thay thế câu hỏi tại editingQuestionIndex
                            const updatedData = group.data.map((q, idx) =>
                                idx === editingQuestionIndex ? newQuestion : q
                            );
                            return { ...group, data: updatedData };
                        } else {
                            // Chế độ thêm mới
                            if (this.state.currentQuestionIndex !== null) {
                                // Chèn câu hỏi mới ngay sau currentQuestionIndex
                                const updatedData = [
                                    ...group.data.slice(0, this.state.currentQuestionIndex + 1),
                                    newQuestion,
                                    ...group.data.slice(this.state.currentQuestionIndex + 1),
                                ];
                                return { ...group, data: updatedData };
                            } else {
                                // Thêm vào cuối nếu không có currentQuestionIndex
                                return {
                                    ...group,
                                    data: [...group.data, newQuestion],
                                };
                            }
                        }
                    }
                    return group;
                });
                return {
                    questionsData: updatedGroups,
                    isAddQuestionModalVisible: false,
                    editingQuestion: null, // Xóa thông tin chỉnh sửa
                    editingQuestionIndex: null, // Xóa index chỉnh sửa
                    currentQuestionIndex: null, // Reset sau khi thêm
                };
            },
            () => {
                // Cập nhật giá trị form sau khi thêm/sửa
                const { questionsData, currentGroupId } = this.state;
                const group = questionsData.find(
                    (g) => g.id === currentGroupId || (!currentGroupId && g.id === null)
                );
                if (group && this.formRef.current) {
                    const formValues = this.mapAnswersToForm(group.data, group.id || "new");
                    this.formRef.current.setFieldsValue(formValues);
                }
            }
        );
    };

    handleAddQuestionCancel = () => {
        this.setState({
            isAddQuestionModalVisible: false,
            editingQuestion: null, // Xóa thông tin chỉnh sửa
            editingQuestionIndex: null, // Xóa index chỉnh sửa
            currentQuestionIndex: null, // Reset index
        });
    };


    handleEditQuestion = (groupId, qIdx) => {
        const group = this.state.questionsData.find(
            (g) => g.id === groupId || (!groupId && g.id === null)
        );
        const question = group && group.data && group.data[qIdx] ? group.data[qIdx] : {};

        this.setState({
            isAddQuestionModalVisible: true,
            currentGroupId: groupId,
            editingQuestion: question, // Lưu câu hỏi cần chỉnh sửa
            editingQuestionIndex: qIdx, // Lưu index của câu hỏi
        });
    };


    handleDeleteQuestion = (groupId, qIdx) => {
        Modal.confirm({
            title: "Bạn có muốn xóa câu hỏi này không?",
            okText: "Yes",
            okType: "danger",
            cancelText: "No",
            onOk: () => {
                this.setState((prevState) => {
                    const updatedGroups = prevState.questionsData.map((group) => {
                        if (group.id === groupId || (!groupId && group.id === null)) {
                            return {
                                ...group,
                                data: group.data.filter((_, idx) => idx !== qIdx)
                            };
                        }
                        return group;
                    });
                    return { questionsData: updatedGroups };
                },
                    () => {
                        // Đồng bộ Form sau khi xóa
                        const { questionsData, currentGroupId } = this.state;
                        const group = questionsData.find(
                            (g) => g.id === groupId || (!groupId && g.id === null)
                        );
                        if (group && this.formRef.current) {
                            // Tạo lại giá trị Form dựa trên questionsData mới
                            const formValues = this.mapAnswersToForm(group.data, group.id || "new");
                            // Xóa tất cả các trường hiện tại
                            this.formRef.current.resetFields();
                            // Cập nhật lại các trường còn tồn tại
                            this.formRef.current.setFieldsValue({
                                name: group.name,
                                ...formValues,
                            });
                        }
                        message.success("Xóa câu hỏi thành công!");
                    }

                );
                // message.success("Xóa câu hỏi thành công!");
            }
        });
    };

    renderGroupNameField = () => {
        if (this.getPageInfo() === "answers") {
            return null; // không hiển thị khi ở chế độ làm bài
        }

        return (
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
        );
    };


    renderQuestions = (questionsData) => {
        if (!questionsData || questionsData.length === 0 || questionsData[0].data.length === 0) {
            if (this.getPageInfo() === "answers") {
                return null;
            }
            // Trường hợp chưa có câu hỏi nào
            return (
                <Form.Item className="add-first-question-btn-container">
                    <Button
                        type="dashed"
                        icon={<PlusOutlined />}
                        onClick={() => this.handleAddQuestion(questionsData && questionsData[0] ? questionsData[0].id : null)}
                        className="add-first-question-btn"
                    >
                        Thêm câu hỏi đầu tiên
                    </Button>
                </Form.Item>
            );
        }

        return (
            <Form.Item label="Câu hỏi">
                {questionsData.map((group) => (
                    <div key={group.id || "new"} className="permission-group">
                        <strong className="group-label">{group.name}</strong>
                        {group.data.map((q, qIdx) => (
                            <Form.Item
                                key={`${group.id || "new"}-${qIdx}`}
                                name={`question_${group.id || "new"}_${qIdx}`}
                                label={
                                    <div className="question-label">
                                        <span className="question-number">{qIdx + 1}. </span>
                                        <span className="question-text">{q.item}</span>
                                        <div className="question-actions">{this.renderQuestionActions(group.id, qIdx)}</div>
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
                        {this.getPageInfo() !== "answers" && (
                            <Button
                                type="dashed"
                                icon={<PlusOutlined />}
                                onClick={() => this.handleAddQuestion(group.id)}
                                style={{ width: "100%", marginTop: 16 }}
                            >
                                Thêm câu hỏi
                            </Button>
                        )}
                    </div>
                ))}
            </Form.Item>
        );
    };


    render() {
        const { questionsData, loading, isAddQuestionModalVisible } = this.state;
        console.log(questionsData);
        return (
            <div className="page-container">
                <Card className="card-container" bodyStyle={{ padding: 0 }}>
                    <Form
                        ref={this.formRef}
                        layout="vertical"
                        onFinish={this.handleSubmit}
                        className="form-container"
                        requiredMark={false}
                        onValuesChange={(changedValues) => {
                            if (changedValues.name !== undefined) {
                                this.setState((prevState) => {
                                    const updatedGroups = prevState.questionsData.map((group, idx) => {
                                        if (idx === 0) { // giả sử chỉ có 1 nhóm
                                            return { ...group, name: changedValues.name };
                                        }
                                        return group;
                                    });
                                    return { questionsData: updatedGroups };
                                });
                            }
                        }}
                    >
                        {this.renderGroupNameField()}  {/* ✅ thay bằng hàm */}
                        {this.renderQuestions(questionsData)}
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
                </Card>
                <AddEditQuestionModal
                    visible={isAddQuestionModalVisible}
                    onAdd={this.handleAddQuestionSuccess}
                    onCancel={this.handleAddQuestionCancel}
                    editingQuestion={this.state.editingQuestion} // Truyền câu hỏi đang chỉnh sửa
                />
            </div>
        );
    }


}

export default AddEditQuestionGroup;