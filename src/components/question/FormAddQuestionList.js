import React, { Component } from 'react';
import { Modal, Button, Form, Input, Row, Col, Select, Radio, Checkbox } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { message, Upload } from 'antd';
import "../../style/FormAddQuestionList.css";

import * as api from "../../api/questionGroups";


class FormAddQuestionList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            editGroupId: null,   // 👈 id nhóm đang sửa
            questions: [
                {
                    text: '', type: 'Single',
                    answers: [
                        { text: '', isCorrect: false },
                        { text: '', isCorrect: false }
                    ]
                },
            ],
        };
        this.formRef = React.createRef();
    }
    openForEdit = async (id) => {
        console.log("Edit mode, groupId =", id);
        this.setState({ visible: true, editGroupId: id });

        try {
            const data = await api.getQuestionGroup(id);
            this.formRef.current.setFieldsValue({ groupName: data.name });
            this.setState({ questions: data.data });
        } catch (err) {
            console.error("Lỗi khi load group:", err);
        }
    };

    showModal = () => {
        this.setState({ visible: true, editGroupId: null }); // thêm mới
    };
    // showModal = () => {
    //     this.setState({ visible: true });
    // };

    handleOk = () => {
        const { questions } = this.state;

        if (questions.length < 1) {
            message.error('Nhóm câu hỏi phải có ít nhất 1 câu hỏi!');
            return;
        }

        for (let question of questions) {
            if (question.answers.length < 2) {
                message.error('Mỗi câu hỏi phải có ít nhất 2 đáp án!');
                return;
            }
            const hasCorrectAnswer = question.answers.some(ans => ans.isCorrect);
            if (question.type === 'Single' && !hasCorrectAnswer) {
                message.error('Câu hỏi Single phải có chính xác một đáp án đúng!');
                return;
            }
            if (question.type === 'Multiple' && !hasCorrectAnswer) {
                message.error('Câu hỏi Multiple phải có ít nhất một đáp án đúng!');
                return;
            }
        }

        this.formRef.current
            .validateFields()
            .then(async (values) => {
                // const newGroup = {
                //     groupName: values.groupName,
                //     questions: this.state.questions.map((question) => ({
                //         text: question.text,
                //         type: question.type,
                //         answers: question.answers.map((answer) => ({
                //             text: answer.text,
                //             isCorrect: answer.isCorrect,
                //         })),
                //     })),
                // };
                const newGroup = {
                    // Đổi groupName -> name
                    name: values.groupName,

                    // Đổi questions -> data
                    data: this.state.questions.map((question) => ({
                        // Đổi text -> item
                        item: question.text,
                        type: question.type,
                        answers: question.answers.map((answer) => ({
                            text: answer.text,
                            isCorrect: answer.isCorrect,
                        })),
                    })),
                };

                console.log('New Question Group:', newGroup);
                await api.createQuestionGroup(newGroup);
                message.success('Thêm chủ đề câu hỏi thành công!');

                if (this.props.onAdd) {
                    this.props.onAdd(newGroup); // <-- gọi callback của cha
                }


                this.formRef.current.resetFields();
                this.setState({
                    questions: [
                        { text: '', type: 'Single', answers: [{ text: '', isCorrect: false }, { text: '', isCorrect: false }] },
                    ],
                    visible: false,
                });
            })
            .catch((error) => {
                console.error('Validation failed:', error);
            });
    };

    handleCancel = () => {
        this.formRef.current.resetFields();
        this.setState({
            visible: false,
            questions: [
                { text: '', type: 'Single', answers: [{ text: '', isCorrect: false }, { text: '', isCorrect: false }] },
            ],
        });
        if (this.props.onCancel) {
            this.props.onCancel();
        }
    };

    handleAddQuestion = () => {
        this.setState((prevState) => ({
            questions: [...prevState.questions, { text: '', type: 'Single', answers: [{ text: '', isCorrect: false }, { text: '', isCorrect: false }] }],
        }));
    };

    handleDeleteQuestion = (index) => {
        this.setState((prevState) => ({
            questions: prevState.questions.filter((_, i) => i !== index),
        }));
    };

    handleAddAnswer = (questionIndex) => {
        this.setState((prevState) => {
            const updatedQuestions = [...prevState.questions];
            updatedQuestions[questionIndex].answers.push({ text: '', isCorrect: false });
            return { questions: updatedQuestions };
        });
    };

    handleDeleteAnswer = (questionIndex, answerIndex) => {
        this.setState((prevState) => {
            const updatedQuestions = [...prevState.questions];
            updatedQuestions[questionIndex].answers = updatedQuestions[questionIndex].answers.filter((_, i) => i !== answerIndex);
            return { questions: updatedQuestions };
        });
    };

    handleAnswerCorrectChange = (questionIndex, answerIndex, checked) => {
        this.setState((prevState) => {
            const updatedQuestions = [...prevState.questions];
            const question = updatedQuestions[questionIndex];
            if (question.type === 'Single') {
                question.answers = question.answers.map((ans, i) => ({
                    ...ans,
                    isCorrect: i === answerIndex ? checked : false,
                }));
            } else {
                question.answers[answerIndex] = { ...question.answers[answerIndex], isCorrect: checked };
            }
            return { questions: updatedQuestions };
        });
    };

    handleTypeChange = (questionIndex, value) => {
        this.setState((prevState) => {
            const updatedQuestions = [...prevState.questions];
            updatedQuestions[questionIndex].type = value;
            if (value === 'Single') {
                updatedQuestions[questionIndex].answers = updatedQuestions[questionIndex].answers.map(ans => ({
                    ...ans,
                    isCorrect: false,
                }));
            }
            return { questions: updatedQuestions };
        });
    };
    handleInsertAnswer = (questionIndex, answerIndex) => {
        console.log("Insert answer at question ", questionIndex, " answer ", answerIndex);
        this.setState((prevState) => {
            const updatedQuestions = [...prevState.questions];
            // chèn ngay dưới đáp án hiện tại
            updatedQuestions[questionIndex].answers.splice(answerIndex + 1, 0, { text: '', isCorrect: false });
            console.log(updatedQuestions);
            return { questions: updatedQuestions };
        });
    };

    handleInsertQuestion = (questionIndex) => {
        this.setState((prevState) => {
            const updatedQuestions = [...prevState.questions];
            // Chèn ngay sau câu hỏi hiện tại
            updatedQuestions.splice(questionIndex + 1, 0, {
                text: '',
                type: 'Single',
                answers: [
                    { text: '', isCorrect: false },
                    { text: '', isCorrect: false }
                ]
            });



            console.log(updatedQuestions);
            return { questions: updatedQuestions };
        });
    };



    render() {
        const { visible, questions } = this.state;
        const { icon } = this.props;

        return (
            <>
                <Button
                    type="primary"
                    icon={icon}
                    className="btn-add"
                    onClick={this.showModal}
                >
                    Thêm mới chủ đề câu hỏi
                </Button>

                <Modal
                    title="Thêm Nhóm Câu Hỏi Mới"
                    visible={visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    okText="Lưu"
                    cancelText="Hủy"
                    centered
                    className="custom-modal"
                    width={1000}     // chỉnh độ rộng
                >
                    <Form
                        ref={this.formRef}
                        layout="vertical"
                        initialValues={{ groupName: '', questions: questions }}
                    >
                        <Form.Item
                            name="groupName"
                            label="Tên Nhóm Câu Hỏi"
                            rules={[{ required: true, message: 'Vui lòng nhập tên chủ đề câu hỏi!' }]}
                        >
                            <Input.TextArea placeholder="Nhập tên chủ đề câu hỏi" rows={2} />
                        </Form.Item>

                        {/* /// thêm phần xử lý upload ảnh đại diện cho nhóm câu hỏi */}
                        {/* <Form.Item
                            label="Tên Nhóm Câu Hỏi"
                            required
                        >
                            <Row gutter={16} align="middle">
                    
                                <Col flex="auto">
                                    <Input.TextArea
                                        placeholder="Nhập tên chủ đề câu hỏi"
                                        rows={2}
                                        value={this.state.groupName}
                                        onChange={(e) => this.setState({ groupName: e.target.value })}
                                    />
                                </Col>
                                <Col>
                                    <Form.Item label="Avatar" name="image" noStyle>
                                        <Upload
                                            listType="picture-card"
                                            name="image"
                                            showUploadList={false}
                                            className='avatar-upload' 
                                            beforeUpload={(file) => {
                                                const isImage = file.type.startsWith("image/");
                                                if (!isImage) {
                                                    message.error("Chỉ cho phép upload hình ảnh!");
                                                    return Upload.LIST_IGNORE;
                                                }
                                                const previewUrl = URL.createObjectURL(file);
                                                this.setState({ avatarUrl: previewUrl, avatarFileName: file.name });
                                                return Upload.LIST_IGNORE;
                                            }}
                                        >
                                            <img
                                                src={this.state.avatarUrl || "/images/images_api/img_default.jpg"}
                                                alt="Avatar"
                                                className='avatar-upload-img'
                                              
                                            />
                                        </Upload>
                                    </Form.Item>
                                </Col>

                            </Row>
                        </Form.Item> */}



                        <Form.Item className="question-list">
                            <Form.Item
                                noStyle
                                shouldUpdate={(prev, curr) => prev.groupName !== curr.groupName}
                                className="inner-form-item-bordered"
                            >
                                {({ getFieldValue }) => {
                                    const groupName = getFieldValue("groupName");
                                    return groupName ? (
                                        <strong className="group-label-center">{groupName}</strong>

                                    ) : null;
                                }}
                            </Form.Item>
                            <Form.Item label="Danh sách câu hỏi">

                                {questions.map((question, qIndex) => (
                                    <div key={qIndex} style={{ marginBottom: 16 }}>
                                        <Row gutter={8} align="middle" style={{ marginBottom: 8 }}>
                                            {/* Thêm cột hiển thị số thứ tự */}
                                            <Col span={1}>
                                                <strong>{qIndex + 1}.</strong>
                                            </Col>

                                            <Col span={16}>
                                                {/* <Form.Item
                                                    name={['questions', qIndex, 'text']}
                                                    rules={[{ required: true, message: 'Vui lòng nhập tên câu hỏi!' }]}
                                                    noStyle
                                                >
                                                    <Input
                                                        placeholder={`Câu hỏi ${qIndex + 1}`}
                                                        value={question.text}
                                                        onChange={(e) => {
                                                            const newQuestions = [...this.state.questions];
                                                            newQuestions[qIndex].text = e.target.value;
                                                            this.setState({ questions: newQuestions });
                                                        }}
                                                    />
                                                </Form.Item> */}
                                                <Form.Item
                                                    rules={[{ required: true, message: 'Vui lòng nhập tên câu hỏi!' }]}
                                                    noStyle
                                                >
                                                    <Input
                                                        placeholder={`Câu hỏi ${qIndex + 1}`}
                                                        value={question.text}
                                                        onChange={(e) => {
                                                            const newQuestions = [...this.state.questions];
                                                            newQuestions[qIndex].text = e.target.value;
                                                            this.setState({ questions: newQuestions });
                                                        }}
                                                    />
                                                </Form.Item>
                                            </Col>
                                            <Col span={5}>
                                                <Select
                                                    value={question.type}
                                                    onChange={(value) => this.handleTypeChange(qIndex, value)}
                                                >
                                                    <Select.Option value="Single">Single (Radio)</Select.Option>
                                                    <Select.Option value="Multiple">Multiple (Checkbox)</Select.Option>
                                                </Select>
                                            </Col>
                                            <Col span={1}>
                                                <Button
                                                    type="link"
                                                    danger
                                                    icon={<DeleteOutlined />}
                                                    onClick={() => this.handleDeleteQuestion(qIndex)}
                                                    disabled={questions.length <= 1}
                                                />
                                            </Col>
                                            <Col span={1}>
                                                <Button
                                                    type="link"
                                                    icon={<PlusOutlined />}
                                                    onClick={() => this.handleInsertQuestion(qIndex)} // ✅ thêm ngay sau
                                                />
                                            </Col>

                                        </Row>
                                        {/* <Form.Item label="Đáp án"> */}
                                        <Form.Item >
                                            {question.answers.map((answer, aIndex) => (
                                                <div key={aIndex} style={{ marginBottom: 8 }}>
                                                    <Row gutter={8} align="middle">
                                                        <Col span={1}>
                                                            {question.type === 'Single' ? (
                                                                <Radio
                                                                    checked={answer.isCorrect}
                                                                    onChange={(e) => this.handleAnswerCorrectChange(qIndex, aIndex, e.target.checked)}
                                                                />
                                                            ) : (
                                                                <Checkbox
                                                                    checked={answer.isCorrect}
                                                                    onChange={(e) => this.handleAnswerCorrectChange(qIndex, aIndex, e.target.checked)}
                                                                />
                                                            )}
                                                        </Col>
                                                        <Col span={16}>
                                                            {/* <Form.Item
                                                                name={['questions', qIndex, 'answers', aIndex, 'text']}
                                                                rules={[{ required: true, message: 'Vui lòng nhập đáp án!' }]}
                                                                noStyle
                                                            >
                                                                <Input
                                                                    placeholder={`Đáp án ${aIndex + 1}`}
                                                                    value={answer.text}
                                                                    onChange={(e) => {
                                                                        const newQuestions = [...this.state.questions];
                                                                        newQuestions[qIndex].answers[aIndex].text = e.target.value;
                                                                        this.setState({ questions: newQuestions });
                                                                    }}
                                                                />
                                                            </Form.Item> */}
                                                            <Form.Item
                                                                rules={[{ required: true, message: 'Vui lòng nhập đáp án!' }]}
                                                                noStyle
                                                            >
                                                                <Input
                                                                    placeholder={`Đáp án ${aIndex + 1}`}
                                                                    value={answer.text}
                                                                    onChange={(e) => {
                                                                        const newQuestions = [...this.state.questions];
                                                                        newQuestions[qIndex].answers[aIndex].text = e.target.value;
                                                                        this.setState({ questions: newQuestions });
                                                                    }}
                                                                />
                                                            </Form.Item>

                                                        </Col>
                                                        <Col span={1}>
                                                            <Button
                                                                type="link"
                                                                danger
                                                                icon={<DeleteOutlined />}
                                                                onClick={() => this.handleDeleteAnswer(qIndex, aIndex)}
                                                                disabled={question.answers.length <= 2}
                                                            />
                                                        </Col>
                                                        <Col span={1}>
                                                            <Button
                                                                type="link"
                                                                icon={<PlusOutlined />}
                                                                onClick={() => this.handleInsertAnswer(qIndex, aIndex)}
                                                            >
                                                                {/* Thêm */}
                                                            </Button>
                                                        </Col>
                                                    </Row>
                                                </div>
                                            ))}

                                            {/* <Button
                                            type="dashed"
                                            onClick={() => this.handleAddAnswer(qIndex)}
                                            icon={<PlusOutlined />}
                                            style={{ width: '100%', marginTop: 8 }}
                                        >
                                            Thêm đáp án
                                        </Button> */}
                                        </Form.Item>
                                    </div>
                                )
                                )}
                            </Form.Item>
                            <Button
                                type="dashed"
                                onClick={this.handleAddQuestion}
                                icon={<PlusOutlined />}
                                style={{ width: '100%', marginTop: 8 }}
                            >
                                Thêm câu hỏi
                            </Button>
                        </Form.Item>
                    </Form>
                </Modal>
            </>
        );
    }
}

export default FormAddQuestionList;