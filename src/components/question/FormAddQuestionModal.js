import React, { Component } from "react";
import { Form, Input, Button, Select, Radio, Checkbox, Row, Col, Modal } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { message } from "antd";

class AddEditQuestionModal extends Component {
  formRef = React.createRef();

  state = {
    questionType: "Single",
    answers: [
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
    ],
  };

  componentDidUpdate(prevProps) {
    if (prevProps.editingQuestion !== this.props.editingQuestion && this.props.editingQuestion) {
      const { editingQuestion } = this.props;
      this.setState({
        questionType: editingQuestion.type || "Single",
        answers: editingQuestion.answers || [
          { text: "", isCorrect: false },
          { text: "", isCorrect: false },
        ],
      });
      this.formRef.current.setFieldsValue({
        item: editingQuestion.item || "",
        type: editingQuestion.type || "Single",
        answers: editingQuestion.answers ? editingQuestion.answers.map((ans) => ans.text) : [],
      });
    }
  }

  handleSubmit = () => {
    if (this.state.answers.length < 2) {
      message.error("Câu hỏi phải có ít nhất 2 đáp án!");
      return;
    }

    const hasCorrectAnswer = this.state.answers.some((ans) => ans.isCorrect);
    if (this.state.questionType === "Single" && !hasCorrectAnswer) {
      message.error("Câu hỏi Single phải có chính xác một đáp án đúng!");
      return;
    }
    if (this.state.questionType === "Multiple" && !hasCorrectAnswer) {
      message.error("Câu hỏi Multiple phải có ít nhất một đáp án đúng!");
      return;
    }

    this.formRef.current
      .validateFields()
      .then((values) => {
        const { answers, questionType } = this.state;
        const newQuestion = {
          type: values.type,
          item: values.item,
          answers: values.answers.map((text, index) => ({
            text,
            isCorrect: (answers[index] && answers[index].isCorrect) || false,
          })),
        };

        this.props.onAdd(newQuestion);
        message.success(this.props.editingQuestion ? "Cập nhật câu hỏi thành công!" : "Thêm câu hỏi thành công!");

        this.formRef.current.resetFields();
        this.setState({
          questionType: "Single",
          answers: [
            { text: "", isCorrect: false },
            { text: "", isCorrect: false },
          ],
        });
        this.props.onCancel();
      })
      .catch((error) => {
        console.error("Validation failed:", error);
      });
  };

  handleCancel = () => {
    this.formRef.current.resetFields();
    this.setState({
      questionType: "Single",
      answers: [
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
      ],
    });
    this.props.onCancel();
  };

  handleAddAnswer = () => {
    this.setState((prevState) => ({
      answers: [...prevState.answers, { text: "", isCorrect: false }],
    }));
  };

  handleDeleteAnswer = (index) => {
    this.setState((prevState) => ({
      answers: prevState.answers.filter((_, i) => i !== index),
    }));
  };

  handleAnswerCorrectChange = (index, checked) => {
    const { questionType } = this.state;
    this.setState((prevState) => {
      let updatedAnswers = [...prevState.answers];
      if (questionType === "Single") {
        updatedAnswers = updatedAnswers.map((ans, i) => ({
          ...ans,
          isCorrect: i === index ? checked : false,
        }));
      } else {
        updatedAnswers[index] = { ...updatedAnswers[index], isCorrect: checked };
      }
      return { answers: updatedAnswers };
    });
  };

  handleTypeChange = (value) => {
    this.setState((prevState) => {
      let updatedAnswers = [...prevState.answers];
      if (value === "Single") {
        updatedAnswers = updatedAnswers.map((ans) => ({ ...ans, isCorrect: false }));
      }
      return {
        questionType: value,
        answers: updatedAnswers,
      };
    });
  };

  render() {
    const { visible, onCancel, editingQuestion } = this.props;
    const { answers, questionType } = this.state;

    return (
      <Modal
        title={editingQuestion ? "Chỉnh sửa câu hỏi" : "Thêm câu hỏi mới"}
        visible={visible}
        onOk={this.handleSubmit}
        onCancel={this.handleCancel}
        okText={editingQuestion ? "Lưu" : "Thêm"}
        cancelText="Hủy"
      >
        <Form ref={this.formRef} layout="vertical" initialValues={{ type: "Single", item: "" }}>
          <Form.Item
            name="item"
            label="Tên câu hỏi"
            rules={[{ required: true, message: "Vui lòng nhập tên câu hỏi!" }]}
          >
            <Input placeholder="Nhập tên câu hỏi" />
          </Form.Item>

          <Form.Item
            name="type"
            label="Loại câu hỏi"
            rules={[{ required: true, message: "Vui lòng chọn loại câu hỏi!" }]}
          >
            <Select onChange={this.handleTypeChange}>
              <Select.Option value="Single">Single (Radio)</Select.Option>
              <Select.Option value="Multiple">Multiple (Checkbox)</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label="Đáp án">
            {answers.map((answer, index) => (
              <Row key={index} gutter={8} align="middle" style={{ marginBottom: 8 }}>
                <Col span={16}>
                  <Form.Item
                    name={["answers", index]}
                    rules={[{ required: true, message: "Vui lòng nhập đáp án!" }]}
                    noStyle
                  >
                    <Input placeholder={`Đáp án ${index + 1}`} />
                  </Form.Item>
                </Col>
                <Col span={4}>
                  {questionType === "Single" ? (
                    <Radio
                      checked={answer.isCorrect}
                      onChange={(e) => this.handleAnswerCorrectChange(index, e.target.checked)}
                    >
                      Đúng
                    </Radio>
                  ) : (
                    <Checkbox
                      checked={answer.isCorrect}
                      onChange={(e) => this.handleAnswerCorrectChange(index, e.target.checked)}
                    >
                      Đúng
                    </Checkbox>
                  )}
                </Col>
                <Col span={4}>
                  <Button
                    type="link"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => this.handleDeleteAnswer(index)}
                    disabled={answers.length <= 1}
                  />
                </Col>
              </Row>
            ))}
            <Button
              type="dashed"
              onClick={this.handleAddAnswer}
              icon={<PlusOutlined />}
              style={{ width: "100%", marginTop: 8 }}
            >
              Thêm đáp án
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default AddEditQuestionModal;