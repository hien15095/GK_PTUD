// Ghi chú tổng:
// - File này xử lý toàn bộ phần giao diện bằng JavaScript thuần.
// - Mục tiêu là dễ sửa khi đi thi và không cần Node.js.
// - Mỗi tính năng chính được tách thành hàm riêng để dễ học, dễ gỡ và dễ nâng cấp.

// state là nơi lưu dữ liệu đang dùng trên giao diện.
// Khi muốn hiểu app đang chạy ra sao, thường nên đọc phần state trước.
const state = {
  questions: [],
  answers: {},
  result: null,
  userInfo: {
    fullName: "",
    studentId: "",
  },
  currentQuestionIndex: 0,
  remainingSeconds: 0,
  timerId: null,
};

// elements gom toàn bộ phần tử HTML cần thao tác.
// Làm vậy để không phải truy vấn lại DOM nhiều lần.
const elements = {
  errorBox: document.getElementById("error-box"),
  loadingBox: document.getElementById("loading-box"),
  startBox: document.getElementById("start-box"),
  quizBox: document.getElementById("quiz-box"),
  resultBox: document.getElementById("result-box"),
  questionCount: document.getElementById("question-count"),
  fullNameInput: document.getElementById("full-name-input"),
  studentIdInput: document.getElementById("student-id-input"),
  userInfoBox: document.getElementById("user-info-box"),
  resultUserInfo: document.getElementById("result-user-info"),
  timerBox: document.getElementById("timer-box"),
  timerText: document.getElementById("timer-text"),
  questionPosition: document.getElementById("question-position"),
  progressText: document.getElementById("progress-text"),
  progressBar: document.getElementById("progress-bar"),
  progressPercent: document.getElementById("progress-percent"),
  statusList: document.getElementById("status-list"),
  questionView: document.getElementById("question-view"),
  resultContent: document.getElementById("result-content"),
  startButton: document.getElementById("start-button"),
  prevButton: document.getElementById("prev-button"),
  nextButton: document.getElementById("next-button"),
  submitButton: document.getElementById("submit-button"),
  retryButton: document.getElementById("retry-button"),
  redoButton: document.getElementById("redo-button"),
};

// Thời gian làm bài: 10 phút, tính theo giây.
const QUIZ_DURATION_SECONDS = 10 * 60;

// Tính năng: tải câu hỏi từ backend khi app khởi động.
async function loadQuestions() {
  try {
    // Xóa lỗi cũ trước khi gọi API mới.
    showError("");

    // Gọi API lấy danh sách câu hỏi.
    const response = await fetch("/questions");

    // Nếu API lỗi thì dừng và báo lỗi.
    if (!response.ok) {
      throw new Error("Không thể tải danh sách câu hỏi.");
    }

    // Lưu câu hỏi vào state để toàn bộ giao diện dùng chung.
    state.questions = await response.json();

    // Hiển thị tổng số câu ở màn hình bắt đầu.
    elements.questionCount.textContent = `Bài hiện có ${state.questions.length} câu hỏi.`;

    // Ẩn loading và hiện màn hình bắt đầu.
    elements.loadingBox.classList.add("hidden");
    elements.startBox.classList.remove("hidden");
  } catch (error) {
    // Nếu thất bại thì báo lỗi cho người dùng.
    showError(error.message);
    elements.loadingBox.classList.add("hidden");
  }
}

// Tính năng: bắt đầu bài làm.
function startQuiz() {
  // Kiểm tra người dùng đã nhập họ tên và MSSV chưa.
  if (!saveUserInfo()) {
    return;
  }

  // Chuyển sang giao diện làm bài.
  elements.startBox.classList.add("hidden");
  elements.quizBox.classList.remove("hidden");
  elements.resultBox.classList.add("hidden");
  elements.timerBox.classList.remove("hidden");
  renderUserInfo();

  // Reset toàn bộ dữ liệu cho một lượt làm mới.
  state.answers = {};
  state.currentQuestionIndex = 0;
  state.result = null;
  state.remainingSeconds = QUIZ_DURATION_SECONDS;

  // Khởi động timer và vẽ câu đầu tiên.
  startTimer();
  renderQuizScreen();
}

// Tính năng: nhập thông tin người làm bài trước khi bắt đầu.
function saveUserInfo() {
  const fullName = elements.fullNameInput.value.trim();
  const studentId = elements.studentIdInput.value.trim();

  if (!fullName || !studentId) {
    showError("Vui lòng nhập đầy đủ họ tên và MSSV trước khi làm bài.");
    return false;
  }

  state.userInfo.fullName = fullName;
  state.userInfo.studentId = studentId;
  showError("");
  return true;
}

// Hàm phụ: hiển thị thông tin sinh viên trong màn hình làm bài và màn hình kết quả.
function renderUserInfo() {
  const infoText = `Họ tên: ${state.userInfo.fullName} | MSSV: ${state.userInfo.studentId}`;

  elements.userInfoBox.textContent = infoText;
  elements.resultUserInfo.textContent = infoText;
  elements.userInfoBox.classList.remove("hidden");
  elements.resultUserInfo.classList.remove("hidden");
}

// Tính năng: đồng hồ đếm ngược.
function startTimer() {
  // Dừng timer cũ nếu còn tồn tại.
  stopTimer();

  // Hiện thời gian ban đầu ngay lập tức.
  renderTimer();

  state.timerId = window.setInterval(() => {
    // Mỗi giây trừ đi 1.
    state.remainingSeconds -= 1;
    renderTimer();

    // Hết giờ thì tự nộp bài.
    if (state.remainingSeconds <= 0) {
      stopTimer();
      showError("Hết thời gian, hệ thống đã tự nộp bài.");
      submitQuiz(true);
    }
  }, 1000);
}

// Hàm phụ để dừng đồng hồ.
function stopTimer() {
  if (state.timerId) {
    window.clearInterval(state.timerId);
    state.timerId = null;
  }
}

// Hàm phụ để hiển thị thời gian theo dạng mm:ss.
function renderTimer() {
  const minutes = String(Math.max(0, Math.floor(state.remainingSeconds / 60))).padStart(2, "0");
  const seconds = String(Math.max(0, state.remainingSeconds % 60)).padStart(2, "0");
  elements.timerText.textContent = `${minutes}:${seconds}`;
}

// Hàm tổng: vẽ lại toàn bộ giao diện làm bài.
function renderQuizScreen() {
  renderStatusList();
  renderQuestion();
  renderProgress();
}

// Tính năng: chọn đáp án cho câu hiện tại.
function chooseAnswer(questionId, selectedAnswer) {
  // Ghi đáp án đã chọn vào state.
  state.answers[questionId] = selectedAnswer;

  // Vẽ lại các phần liên quan sau khi chọn.
  renderStatusList();
  renderQuestion();
  renderProgress();
}

// Tính năng: đánh dấu câu đã làm, chưa làm và câu hiện tại.
function renderStatusList() {
  elements.statusList.innerHTML = state.questions
    .map((question, index) => {
      // Xác định trạng thái của từng câu để tô màu khác nhau.
      const isCurrent = index === state.currentQuestionIndex;
      const isAnswered = Boolean(state.answers[question.id]);
      const statusClass = isCurrent ? "current" : isAnswered ? "answered" : "unanswered";
      const statusText = isAnswered ? "Da lam" : "Chua lam";

      return `
        <button
          type="button"
          class="status-button ${statusClass}"
          data-go-to-index="${index}"
          title="Cau ${index + 1} - ${statusText}"
        >
          Câu ${index + 1}
        </button>
      `;
    })
    .join("");

  // Gắn sự kiện click để người dùng nhảy nhanh tới câu bất kỳ.
  elements.statusList.querySelectorAll(".status-button").forEach((button) => {
    button.addEventListener("click", () => {
      state.currentQuestionIndex = Number(button.dataset.goToIndex);
      renderQuizScreen();
    });
  });
}

// Tính năng: chỉ hiển thị từng câu một.
function renderQuestion() {
  // Lấy câu hỏi theo vị trí hiện tại.
  const question = state.questions[state.currentQuestionIndex];

  // Nếu không có câu hợp lệ thì dừng để tránh lỗi.
  if (!question) {
    return;
  }

  // Tạo danh sách 4 đáp án bằng HTML.
  const optionsHtml = question.options
    .map((option, optionIndex) => {
      const selected = state.answers[question.id] === option ? "selected" : "";

      return `
        <button
          type="button"
          class="option ${selected}"
          data-question-id="${question.id}"
          data-option-index="${optionIndex}"
        >
          ${option}
        </button>
      `;
    })
    .join("");

  // Vẽ nội dung câu hỏi hiện tại ra giao diện.
  elements.questionView.innerHTML = `
    <div class="question-meta">
      <span class="question-badge">Câu ${state.currentQuestionIndex + 1}</span>
      <span class="question-note">
        ${state.answers[question.id] ? "Đã chọn đáp án cho câu này" : "Câu này chưa chọn đáp án"}
      </span>
    </div>
    <h2 class="question-title">${question.question}</h2>
    <div class="option-list">${optionsHtml}</div>
  `;

  // Sau khi render xong HTML, gắn sự kiện click cho từng đáp án.
  elements.questionView.querySelectorAll(".option").forEach((button) => {
    button.addEventListener("click", () => {
      const questionId = Number(button.dataset.questionId);
      const optionIndex = Number(button.dataset.optionIndex);
      const question = state.questions.find((item) => item.id === questionId);

      // Nếu không tìm thấy câu hỏi thì bỏ qua để tránh lỗi JS.
      if (!question) {
        return;
      }

      // Gọi hàm chính để lưu đáp án.
      chooseAnswer(questionId, question.options[optionIndex]);
    });
  });

  // Tự khóa nút trước/sau ở đầu hoặc cuối danh sách câu hỏi.
  elements.prevButton.disabled = state.currentQuestionIndex === 0;
  elements.nextButton.disabled = state.currentQuestionIndex === state.questions.length - 1;
}

// Tính năng: thanh tiến độ và phần trăm hoàn thành.
function renderProgress() {
  // Đếm số câu đã chọn đáp án.
  const selectedCount = Object.keys(state.answers).length;
  elements.progressText.textContent = `Đã chọn ${selectedCount}/${state.questions.length} câu`;
  elements.questionPosition.textContent = `Câu ${state.currentQuestionIndex + 1} / ${state.questions.length}`;

  // Quy đổi sang phần trăm để đổ vào progress bar.
  const percent = state.questions.length
    ? Math.round((selectedCount / state.questions.length) * 100)
    : 0;

  elements.progressBar.style.width = `${percent}%`;
  elements.progressPercent.textContent = `${percent}%`;
}

// Tính năng: màn hình kết quả riêng.
function renderResult() {
  // Tính thêm số câu đã làm và chưa làm để hiện thống kê.
  const answeredCount = Object.keys(state.answers).length;
  const unansweredCount = state.questions.length - answeredCount;

  // Tạo HTML chi tiết đúng/sai cho từng câu.
  const detailHtml = state.result.details
    .map((item, index) => {
      const statusClass = item.is_correct ? "correct" : "wrong";
      const statusText = item.is_correct ? "Kết quả: Đúng" : "Kết quả: Sai";

      return `
        <div class="result-item ${statusClass}">
          <p><strong>Câu ${index + 1}:</strong> ${item.question}</p>
          <p>Bạn chọn: <strong>${item.selected_answer || "Chưa chọn đáp án"}</strong></p>
          <p>Đáp án đúng: <strong>${item.correct_answer}</strong></p>
          <p>${statusText}</p>
        </div>
      `;
    })
    .join("");

  // Gắn toàn bộ dữ liệu kết quả vào giao diện.
  elements.resultContent.innerHTML = `
    <div class="result-summary">
      <div class="summary-card">
        <span>Số câu đúng</span>
        <strong>${state.result.correct_count}/${state.result.total_questions}</strong>
      </div>
      <div class="summary-card">
        <span>Đã làm</span>
        <strong>${answeredCount}</strong>
      </div>
      <div class="summary-card">
        <span>Chưa làm</span>
        <strong>${unansweredCount}</strong>
      </div>
    </div>
    <div class="score-box">
      <p>Số câu đúng: ${state.result.correct_count}/${state.result.total_questions}</p>
      <p>Điểm số: ${state.result.score}</p>
    </div>
    <div class="result-list">${detailHtml}</div>
  `;
}

// Tính năng: nộp bài để backend chấm điểm.
async function submitQuiz(autoSubmit) {
  // Nếu đã có kết quả rồi thì không nộp lại.
  if (state.result) {
    return;
  }

  try {
    // Nếu người dùng tự bấm nộp thì xóa lỗi cũ trước.
    if (!autoSubmit) {
      showError("");
    }

    // Đổi trạng thái nút nộp để tránh bấm liên tục.
    elements.submitButton.disabled = true;
    elements.submitButton.textContent = "Đang nộp bài...";

    // Gom toàn bộ đáp án hiện có để gửi lên server.
    const payload = {
      answers: state.questions.map((question) => ({
        question_id: question.id,
        selected_answer: state.answers[question.id] || "",
      })),
    };

    // Gọi API POST /submit để backend chấm bài.
    const response = await fetch("/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    // Nếu có lỗi từ server thì báo ra ngoài.
    if (!response.ok) {
      throw new Error("Không thể nộp bài. Vui lòng thử lại.");
    }

    // Lưu kết quả, dừng timer và chuyển sang màn hình kết quả.
    state.result = await response.json();
    stopTimer();
    elements.quizBox.classList.add("hidden");
    elements.resultBox.classList.remove("hidden");
    elements.timerBox.classList.add("hidden");
    renderUserInfo();
    renderResult();
  } catch (error) {
    // Hiện lỗi nếu nộp bài thất bại.
    showError(error.message);
  } finally {
    // Dù thành công hay lỗi cũng trả nút nộp về trạng thái bình thường.
    elements.submitButton.disabled = false;
    elements.submitButton.textContent = "Nộp bài";
  }
}

// Tính năng: làm lại bài ngay trong giao diện quiz.
function retryQuiz() {
  // Dừng timer và reset dữ liệu về đầu bài.
  stopTimer();
  state.answers = {};
  state.result = null;
  state.currentQuestionIndex = 0;
  state.remainingSeconds = QUIZ_DURATION_SECONDS;
  showError("");
  // Hiện lại màn hình làm bài.
  elements.resultBox.classList.add("hidden");
  elements.quizBox.classList.remove("hidden");
  elements.timerBox.classList.remove("hidden");
  startTimer();
  renderQuizScreen();
}

// Tính năng: quay về màn hình bắt đầu từ màn hình kết quả.
function redoQuiz() {
  stopTimer();
  state.answers = {};
  state.result = null;
  state.currentQuestionIndex = 0;
  state.remainingSeconds = QUIZ_DURATION_SECONDS;
  showError("");
  // Ẩn kết quả, ẩn quiz và hiện lại màn hình bắt đầu.
  elements.resultBox.classList.add("hidden");
  elements.quizBox.classList.add("hidden");
  elements.timerBox.classList.add("hidden");
  elements.startBox.classList.remove("hidden");

  // Cho phép sửa lại thông tin người dùng nếu muốn làm lại như một người khác.
  elements.userInfoBox.classList.add("hidden");
  elements.resultUserInfo.classList.add("hidden");
}

// Tính năng: chuyển về câu trước.
function goPrevQuestion() {
  if (state.currentQuestionIndex > 0) {
    state.currentQuestionIndex -= 1;
    renderQuizScreen();
  }
}

// Tính năng: chuyển sang câu sau.
function goNextQuestion() {
  if (state.currentQuestionIndex < state.questions.length - 1) {
    state.currentQuestionIndex += 1;
    renderQuizScreen();
  }
}

// Hàm phụ: hiện hoặc ẩn thông báo lỗi chung của app.
function showError(message) {
  if (!message) {
    elements.errorBox.textContent = "";
    elements.errorBox.classList.add("hidden");
    return;
  }

  elements.errorBox.textContent = message;
  elements.errorBox.classList.remove("hidden");
}

// Ghi chú:
// - Nếu muốn gỡ một tính năng, thường phải gỡ 4 nơi:
//   1. HTML giao diện
//   2. CSS liên quan
//   3. Hàm JavaScript
//   4. Dòng addEventListener gọi tới hàm đó
elements.startButton.addEventListener("click", startQuiz);
elements.prevButton.addEventListener("click", goPrevQuestion);
elements.nextButton.addEventListener("click", goNextQuestion);
elements.submitButton.addEventListener("click", () => submitQuiz(false));
elements.retryButton.addEventListener("click", retryQuiz);
elements.redoButton.addEventListener("click", redoQuiz);

// Khi file JS tải xong thì gọi API lấy câu hỏi ngay.
loadQuestions();
