"""Dữ liệu mẫu cho ứng dụng trắc nghiệm."""

# Ghi chú:
# - File này chỉ chứa dữ liệu tĩnh để dễ sửa.
# - Nếu muốn đổi nội dung câu hỏi, chỉ cần chỉnh danh sách QUESTIONS.

QUESTIONS = [
    {
        "id": 1,
        "question": "React là thư viện của ngôn ngữ nào?",
        "options": ["Python", "JavaScript", "Java", "C#"],
        "correct_answer": "JavaScript",
    },
    {
        "id": 2,
        "question": "FastAPI thường dùng để xây dựng thành phần nào?",
        "options": ["Cơ sở dữ liệu", "Backend API", "Thiết kế ảnh", "Hệ điều hành"],
        "correct_answer": "Backend API",
    },
    {
        "id": 3,
        "question": "HTTP GET thường dùng để làm gì?",
        "options": ["Lấy dữ liệu", "Xóa dữ liệu", "Tắt server", "Nén ảnh"],
        "correct_answer": "Lấy dữ liệu",
    },
    {
        "id": 4,
        "question": "Trong React, state dùng để làm gì?",
        "options": [
            "Lưu trạng thái dữ liệu của giao diện",
            "Tạo database mới",
            "Biên dịch mã Python",
            "Cài đặt hệ điều hành",
        ],
        "correct_answer": "Lưu trạng thái dữ liệu của giao diện",
    },
    {
        "id": 5,
        "question": "API `/submit` trong bài này dùng để làm gì?",
        "options": [
            "Tải giao diện frontend",
            "Gửi đáp án và chấm điểm",
            "Tạo tài khoản mới",
            "Xóa toàn bộ câu hỏi",
        ],
        "correct_answer": "Gửi đáp án và chấm điểm",
    },
    {
        "id": 6,
        "question": "Trong CSS, thuộc tính nào thường dùng để đổi màu chữ?",
        "options": ["font-size", "color", "margin", "border"],
        "correct_answer": "color",
    },
    {
        "id": 7,
        "question": "CSS dùng để làm gì trong một website?",
        "options": [
            "Xử lý cơ sở dữ liệu",
            "Trang trí và bố cục giao diện",
            "Gửi email tự động",
            "Biên dịch mã Python",
        ],
        "correct_answer": "Trang trí và bố cục giao diện",
    },
    {
        "id": 8,
        "question": "Phương thức HTTP nào thường dùng để gửi dữ liệu lên server?",
        "options": ["GET", "POST", "TRACE", "HEAD"],
        "correct_answer": "POST",
    },
    {
        "id": 9,
        "question": "JavaScript trong trình duyệt thường dùng để làm gì?",
        "options": [
            "Tạo tương tác cho giao diện",
            "Lắp ráp phần cứng",
            "Cài đặt driver máy in",
            "Phân vùng ổ cứng",
        ],
        "correct_answer": "Tạo tương tác cho giao diện",
    },
    {
        "id": 10,
        "question": "Trong FastAPI, file `requirements.txt` thường dùng để làm gì?",
        "options": [
            "Lưu danh sách thư viện cần cài",
            "Chứa ảnh giao diện",
            "Lưu mật khẩu người dùng",
            "Tạo câu hỏi trắc nghiệm",
        ],
        "correct_answer": "Lưu danh sách thư viện cần cài",
    },
]
