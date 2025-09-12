import React from "react";
import QuestionGroupListItem from "./QuestionGroupListItem";

const QuestionGroupList = ({
  groups,
  onDeleteGroupClick,
  onEditGroupClick,
  onStartQuizClick,
  onPageChange,
  pageSize,
  total,
  totalPages,
  currentPage
}) => {
  return (
    <QuestionGroupListItem
      data={groups}
      onDeleteClick={onDeleteGroupClick}
      onEditClick={onEditGroupClick}
      onStartQuizClick={onStartQuizClick}
      currentPage={currentPage}
      onPageChange={onPageChange}
      pageSize={pageSize}
      total={total}
      totalPages={totalPages}
    />
  );
};

export default QuestionGroupList;
