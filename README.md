# App 1 - Quiz App

Ứng dụng trắc nghiệm đơn giản gồm:

- Backend: FastAPI
- Frontend: HTML/CSS/JavaScript thuần
- Chức năng: tải câu hỏi, chọn đáp án, nộp bài, chấm điểm và hiển thị kết quả chi tiết

- Không cần `Node.js`
- Không cần `npm install`
- Chỉ cần Python + FastAPI
- Dễ thêm chức năng mới theo đề bài
- Có sẵn 10 câu hỏi mẫu
- Có đồng hồ đếm ngược, làm từng câu, thanh tiến độ và trạng thái câu hỏi
- Có form nhập `Họ và tên` và `MSSV` trước khi bắt đầu làm bài

## 1. Mục tiêu của app

Người dùng mở ứng dụng, bấm bắt đầu, làm bài trắc nghiệm gồm 10 câu hỏi, sau đó nộp bài để xem:

- Họ và tên
- MSSV
- Số câu đúng
- Điểm số theo thang 10
- Đúng/sai của từng câu
- Đáp án đúng và đáp án đã chọn

## 2. Cấu trúc thư mục

```text
app-1-quiz/
├── backend/
│   ├── main.py
│   ├── questions_data.py
│   ├── requirements.txt
│   ├── schemas.py
│   └── static/
│       ├── app.js
│       ├── index.html
│       └── styles.css
└── README.md
```

## 2.1. Lưu ý về UTF-8

- Các file trong project nên được lưu bằng mã hóa `UTF-8`
- Project đã có file `.editorconfig` để hỗ trợ editor nhận đúng encoding
- Khi chỉnh sửa nội dung tiếng Việt, nên dùng VS Code hoặc editor có hỗ trợ UTF-8 tốt

## 3. Backend FastAPI cần làm những gì?

Trong ứng dụng này, FastAPI đóng vai trò là phần backend API. Backend cần thực hiện các việc chính sau:

### 3.1. Lưu và quản lý dữ liệu câu hỏi

- Tạo danh sách câu hỏi mẫu
- Mỗi câu hỏi có:
  - `id`
  - `question`
  - `options`
  - `correct_answer`

Ở project này, dữ liệu đang được lưu đơn giản trong file `questions_data.py` để dễ sửa.

### 3.2. Tạo API lấy danh sách câu hỏi

API `GET /questions` có nhiệm vụ:

- Trả về danh sách câu hỏi cho frontend
- Không trả về `correct_answer`

Lý do không trả về đáp án đúng: tránh lộ đáp án trước khi người dùng nộp bài.

### 3.3. Tạo API nhận bài làm và chấm điểm

API `POST /submit` có nhiệm vụ:

- Nhận danh sách đáp án người dùng gửi lên
- So sánh với đáp án đúng
- Đếm số câu đúng
- Tính điểm
- Trả về kết quả chi tiết từng câu

### 3.4. Kiểm tra dữ liệu đầu vào bằng schema

FastAPI kết hợp với Pydantic để:

- Kiểm tra dữ liệu người dùng gửi lên có đúng định dạng không
- Giúp code rõ ràng hơn
- Dễ mở rộng thêm trường dữ liệu về sau

Ví dụ:

- `SubmitRequest`: dữ liệu frontend gửi lên
- `SubmitResponse`: dữ liệu backend trả về

### 3.5. Cho phép frontend gọi API

Ở phiên bản hiện tại, frontend và backend chạy cùng một chỗ trong FastAPI nên không cần `Node.js` và cũng không cần cấu hình `CORS` riêng để phát triển.

## 3.6. Thu thập thông tin sinh viên trước khi làm bài

Phiên bản hiện tại có thêm bước nhập thông tin người làm bài trước khi bắt đầu:

- Họ và tên
- MSSV

Thông tin này hiện được xử lý ở frontend để:

- kiểm tra người dùng đã nhập đủ chưa
- hiển thị lại trong màn hình làm bài
- hiển thị lại trong màn hình kết quả

Nếu sau này muốn lưu thông tin này vào backend hoặc database, có thể mở rộng thêm payload gửi lên API.

## 4. API của ứng dụng

### GET `/questions`

Lấy danh sách câu hỏi.

Ví dụ dữ liệu trả về:

```json
[
  {
    "id": 1,
    "question": "React là thư viện của ngôn ngữ nào?",
    "options": ["Python", "JavaScript", "Java", "C#"]
  }
]
```

### POST `/submit`

Gửi danh sách đáp án đã chọn để chấm điểm.

Ví dụ dữ liệu gửi lên:

```json
{
  "answers": [
    { "question_id": 1, "selected_answer": "JavaScript" },
    { "question_id": 2, "selected_answer": "Backend API" }
  ]
}
```

Ví dụ dữ liệu trả về:

```json
{
  "total_questions": 10,
  "correct_count": 4,
  "score": 8,
  "details": [
    {
      "question_id": 1,
      "question": "React là thư viện của ngôn ngữ nào?",
      "selected_answer": "JavaScript",
      "correct_answer": "JavaScript",
      "is_correct": true
    }
  ]
}
```

## 5. Cách chạy backend

Yêu cầu:

- Python 3.8 trở lên
- Project đã ghim `fastapi==0.104.1` và `uvicorn==0.24.0.post1` để phù hợp với Python 3.8+

Các bước:

```bash
cd app-1-quiz/backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

Backend sẽ chạy tại:

```text
http://127.0.0.1:8000
```

Tài liệu Swagger tự động của FastAPI:

```text
http://127.0.0.1:8000/docs
```

## 6. Cách chạy ứng dụng

Yêu cầu:

- Chỉ cần Python 3.8 trở lên

Các bước:

```bash
cd app-1-quiz/backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

Mở trình duyệt tại:

```text
http://127.0.0.1:8000
```

Khi mở app:

1. Nhập `Họ và tên`
2. Nhập `MSSV`
3. Bấm `Bắt đầu làm bài`

## 7. Luồng hoạt động của app

1. Trình duyệt mở giao diện từ FastAPI tại `/`.
2. JavaScript trong trang gọi `GET /questions` để lấy danh sách câu hỏi.
3. Người dùng nhập `Họ và tên` và `MSSV` trước khi bắt đầu.
4. Người dùng làm từng câu, theo dõi thanh tiến độ và đồng hồ đếm ngược.
5. Khi bấm `Nộp bài` hoặc khi hết giờ, giao diện gửi dữ liệu đến `POST /submit`.
6. Backend chấm điểm và trả về kết quả.
7. Giao diện kết quả riêng sẽ hiển thị:
   - họ và tên
   - MSSV
   - số câu đúng
   - điểm số
   - đúng/sai từng câu
   - đáp án đúng

## 8. Điểm nổi bật của phiên bản này

- Code đơn giản, dễ học
- Không cần Node.js để chạy
- Có chú thích tiếng Việt trong các file chính
- Giao diện màu sáng, dễ nhìn
- Dễ mở rộng thêm số lượng câu hỏi hoặc lưu dữ liệu từ database sau này
- Toàn bộ giao diện nằm trong HTML/CSS/JS thuần để tiện sửa nhanh lúc thi
- Có form nhập thông tin sinh viên trước khi bắt đầu làm bài
- Có timer đếm ngược và tự nộp bài khi hết giờ
- Làm bài theo từng câu với nút trước/sau
- Có thanh tiến độ và đánh dấu câu đã làm/chưa làm
- Màn hình kết quả tách riêng khỏi màn hình làm bài

## 8.1. Những chỗ nên sửa nhanh khi đi thi

Nếu đề yêu cầu thêm tính năng mới, bạn nên sửa ở các vị trí sau:

- `backend/questions_data.py`: thêm hoặc đổi câu hỏi
- `backend/main.py`: thêm API mới hoặc đổi cách chấm điểm
- `backend/static/index.html`: thêm nút hoặc thêm khối giao diện
- `backend/static/app.js`: thêm logic xử lý giao diện
- `backend/static/styles.css`: chỉnh màu, bố cục, khoảng cách

Với cấu trúc hiện tại, phần giao diện nằm gọn trong 3 file nên rất nhanh để:

- thêm đồng hồ đếm thời gian
- thêm nút chuyển câu
- giới hạn số lần nộp
- hiển thị thông báo mới
- thêm bộ lọc hoặc màn hình kết thúc

Nếu muốn sửa phần thông tin sinh viên:

- `backend/static/index.html`: sửa ô nhập `Họ và tên`, `MSSV`
- `backend/static/app.js`: sửa phần kiểm tra dữ liệu trước khi bắt đầu
- `backend/static/styles.css`: sửa giao diện form nhập

## 8.2. Nếu muốn gỡ một tính năng thì làm sao?

Không nên xóa một đoạn code đơn lẻ ngay, vì mỗi tính năng thường đi cùng 4 phần:

1. `backend/static/index.html`: phần giao diện
2. `backend/static/styles.css`: phần màu sắc và bố cục
3. `backend/static/app.js`: phần logic xử lý
4. `backend/main.py` hoặc dữ liệu nếu tính năng liên quan backend

Ví dụ cách gỡ an toàn:

- Gỡ `đồng hồ đếm ngược`
  - Xóa `timer-box` trong `index.html`
  - Xóa style `.timer-box` trong `styles.css`
  - Xóa hàm `startTimer`, `stopTimer`, `renderTimer` trong `app.js`
  - Xóa các dòng gọi timer trong `startQuiz`, `submitQuiz`, `retryQuiz`, `redoQuiz`

- Gỡ `nút câu trước / câu sau`
  - Xóa 2 nút trong `index.html`
  - Xóa hàm `goPrevQuestion`, `goNextQuestion` trong `app.js`
  - Xóa 2 dòng `addEventListener` tương ứng

- Gỡ `danh sách trạng thái câu hỏi`
  - Xóa `status-list` trong `index.html`
  - Xóa style `.status-list`, `.status-button`
  - Xóa hàm `renderStatusList` và các chỗ gọi hàm này

- Gỡ `thanh tiến độ`
  - Xóa khối `progress-wrapper` trong `index.html`
  - Xóa style `.progress-track`, `.progress-bar`
  - Rút gọn hàm `renderProgress`

- Gỡ `form nhập Họ tên / MSSV`
  - Xóa 2 ô nhập trong `index.html`
  - Xóa khối hiển thị `user-info-box` và `result-user-info`
  - Xóa `userInfo`, `saveUserInfo`, `renderUserInfo` trong `app.js`
  - Xóa phần CSS của `.form-grid`, `.field-group`, `.text-input`, `.user-info-box`

Nguyên tắc an toàn khi gỡ:

- Gỡ theo cụm tính năng, không gỡ lẻ từng dòng rời rạc
- Tìm toàn bộ tên hàm, `id`, `class` liên quan trước khi xóa
- Sau khi gỡ xong phải chạy lại app để kiểm tra ngay
- Nếu chưa chắc, nên comment theo cụm tính năng rồi test trước khi xóa hẳn

## 9. Gợi ý mở rộng sau này

- Thêm nhiều bộ đề
- Trộn ngẫu nhiên câu hỏi
- Giới hạn thời gian làm bài
- Lưu lịch sử làm bài
- Thêm đăng nhập người dùng
- Dùng database thay cho dữ liệu tĩnh
