from pathlib import Path
from typing import List

from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from questions_data import QUESTIONS
from schemas import AnswerResult, PublicQuestion, SubmitRequest, SubmitResponse

# Ghi chú:
# - BASE_DIR là thư mục chứa file main.py.
# - STATIC_DIR là thư mục chứa giao diện HTML/CSS/JS.
# - Tách ra biến giúp sửa đường dẫn dễ hơn khi đổi cấu trúc project.
BASE_DIR = Path(__file__).resolve().parent
STATIC_DIR = BASE_DIR / "static"

# Ghi chú:
# - app là đối tượng FastAPI chính của dự án.
# - Tất cả route và cấu hình backend đều gắn vào biến này.
app = FastAPI(
    title="Quiz App API",
    description="API đơn giản cho ứng dụng trắc nghiệm FastAPI + HTML/CSS/JS thuần.",
    version="1.0.0",
)

# Ghi chú:
# - Sau khi tối giản, frontend được viết bằng HTML/CSS/JS thuần.
# - FastAPI sẽ phục vụ luôn giao diện nên không cần Node.js hay CORS riêng nữa.
app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")


@app.get("/")
def read_root():
    """Trả về giao diện chính của ứng dụng quiz."""

    # Khi người dùng mở trang chủ, backend trả file index.html.
    # Nhờ đó project chỉ cần 1 server Python là chạy được toàn bộ app.
    return FileResponse(STATIC_DIR / "index.html")


@app.get("/questions", response_model=List[PublicQuestion])
def get_questions():
    """
    Trả về danh sách câu hỏi cho frontend.

    Lưu ý:
    - Không trả `correct_answer` để tránh lộ đáp án trước khi nộp bài.
    """

    # Duyệt toàn bộ danh sách câu hỏi gốc.
    # Mỗi phần tử trả về chỉ gồm id, question và options.
    # Không trả correct_answer để tránh lộ đáp án trước khi nộp bài.
    return [
        PublicQuestion(
            id=question["id"],
            question=question["question"],
            options=question["options"],
        )
        for question in QUESTIONS
    ]


@app.post("/submit", response_model=SubmitResponse)
def submit_answers(payload: SubmitRequest):
    """
    Nhận câu trả lời từ frontend và trả về kết quả chấm điểm.

    Cách tính:
    - Mỗi câu đúng được 1 điểm thô.
    - Điểm cuối cùng quy về thang 10 và làm tròn 2 chữ số.
    """

    # Chuyển danh sách câu trả lời sang dictionary để tra cứu nhanh theo question_id.
    answers_by_question_id = {
        answer.question_id: answer.selected_answer for answer in payload.answers
    }

    # details dùng để lưu kết quả chi tiết từng câu.
    # correct_count dùng để đếm số câu làm đúng.
    details: List[AnswerResult] = []
    correct_count = 0

    # Lặp qua từng câu trong bộ đề để chấm điểm.
    for question in QUESTIONS:
        # Lấy đáp án người dùng đã chọn cho câu hiện tại.
        selected_answer = answers_by_question_id.get(question["id"])

        # So sánh với đáp án đúng để xác định đúng hay sai.
        is_correct = selected_answer == question["correct_answer"]

        # Nếu đúng thì tăng số câu đúng lên 1.
        if is_correct:
            correct_count += 1

        # Lưu kết quả chi tiết của từng câu để frontend hiển thị sau khi nộp bài.
        details.append(
            AnswerResult(
                question_id=question["id"],
                question=question["question"],
                selected_answer=selected_answer,
                correct_answer=question["correct_answer"],
                is_correct=is_correct,
            )
        )

    # total_questions là tổng số câu trong đề.
    total_questions = len(QUESTIONS)

    # Quy đổi điểm từ số câu đúng sang thang điểm 10.
    score = round((correct_count / total_questions) * 10, 2) if total_questions else 0

    # Trả dữ liệu tổng hợp về cho frontend.
    return SubmitResponse(
        total_questions=total_questions,
        correct_count=correct_count,
        score=score,
        details=details,
    )
