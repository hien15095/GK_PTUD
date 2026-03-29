from typing import List, Optional

from pydantic import BaseModel, Field


class PublicQuestion(BaseModel):
    """Schema trả về cho frontend, không chứa đáp án đúng."""

    id: int
    question: str
    options: List[str]


class SubmittedAnswer(BaseModel):
    """Mỗi đáp án người dùng chọn khi nộp bài."""

    question_id: int = Field(..., description="ID của câu hỏi")
    selected_answer: str = Field(..., description="Đáp án người dùng đã chọn")


class SubmitRequest(BaseModel):
    """Payload gửi lên API /submit."""

    answers: List[SubmittedAnswer]


class AnswerResult(BaseModel):
    """Kết quả đúng/sai chi tiết cho từng câu."""

    question_id: int
    question: str
    selected_answer: Optional[str]
    correct_answer: str
    is_correct: bool


class SubmitResponse(BaseModel):
    """Kết quả tổng hợp sau khi chấm điểm."""

    total_questions: int
    correct_count: int
    score: float
    details: List[AnswerResult]
