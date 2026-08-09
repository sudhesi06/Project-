/* ============================================================
   AI Study Planner — Quizzes App Logic
   Frontend-only interactions with mock data
   ============================================================ */

(function () {
    "use strict";

    /* ---------- DOM References ---------- */
    const $ = (sel) => document.querySelector(sel);
    const $$ = (sel) => document.querySelectorAll(sel);

    // Views
    const viewDashboard = $("#view-dashboard");
    const viewQuiz = $("#view-quiz");
    const viewResult = $("#view-result");

    // Dashboard
    const quizGrid = $("#quiz-grid");
    const emptyState = $("#empty-state");
    const filterChips = $$(".filter-chip");

    // Quiz
    const quizSubjectName = $("#quiz-subject-name");
    const questionCounter = $("#question-counter");
    const progressBar = $("#progress-bar");
    const timerEl = $("#timer");
    const timerDisplay = $("#timer-display");
    const questionNavigator = $("#question-navigator");
    const questionLabel = $("#question-label");
    const questionText = $("#question-text");
    const optionsGrid = $("#options-grid");
    const btnPrev = $("#btn-prev");
    const btnNext = $("#btn-next");
    const btnSubmit = $("#btn-submit");
    const btnQuitQuiz = $("#btn-quit-quiz");

    // Result
    const resultIcon = $("#result-icon");
    const resultSubject = $("#result-subject");
    const scoreValue = $("#score-value");
    const scoreTotal = $("#score-total");
    const scoreFill = $("#score-fill");
    const resultCorrect = $("#result-correct");
    const resultIncorrect = $("#result-incorrect");
    const resultPercentage = $("#result-percentage");
    const performanceMessage = $("#performance-message");
    const btnRetry = $("#btn-retry");
    const btnBackDashboard = $("#btn-back-dashboard");
    const reviewList = $("#review-list");

    // Modal
    const modalQuit = $("#modal-quit");
    const modalCancel = $("#modal-cancel");
    const modalConfirm = $("#modal-confirm");

    // Sidebar
    const sidebar = $("#sidebar");
    const sidebarOverlay = $("#sidebar-overlay");
    const menuToggle = $("#menu-toggle");

    // Loading
    const loadingScreen = $("#loading-screen");
    const app = $("#app");

    // Topbar heading
    const topbarHeading = $("#topbar-heading");

    /* ---------- State ---------- */
    let currentQuiz = null;
    let currentQuestionIndex = 0;
    let userAnswers = [];
    let timerInterval = null;
    let timeRemaining = 0;
    let activeFilter = "all";

    /* ---------- Option Labels ---------- */
    const LABELS = ["A", "B", "C", "D", "E", "F", "G", "H"];

    /* ============================================================
       INITIALIZATION
       ============================================================ */
    function init() {
        // Simulate loading
        setTimeout(() => {
            loadingScreen.classList.add("hidden");
            app.classList.remove("hidden");
        }, 1500);

        renderQuizCards();
        bindEvents();
        injectSVGGradient();
    }

    /* ---------- SVG Gradient for Score Circle ---------- */
    function injectSVGGradient() {
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("width", "0");
        svg.setAttribute("height", "0");
        svg.style.position = "absolute";
        svg.innerHTML = `
            <defs>
                <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#6366F1"/>
                    <stop offset="100%" style="stop-color:#8B5CF6"/>
                </linearGradient>
            </defs>
        `;
        document.body.appendChild(svg);
    }

    /* ============================================================
       DASHBOARD — RENDER QUIZ CARDS
       ============================================================ */
    function renderQuizCards(filter = "all") {
        const quizzes = filter === "all"
            ? QUIZ_DATA
            : QUIZ_DATA.filter(q => q.difficulty === filter);

        quizGrid.innerHTML = "";

        if (quizzes.length === 0) {
            quizGrid.classList.add("hidden");
            emptyState.classList.remove("hidden");
            return;
        }

        quizGrid.classList.remove("hidden");
        emptyState.classList.add("hidden");

        quizzes.forEach((quiz, index) => {
            const card = document.createElement("div");
            card.className = "quiz-card";
            card.style.animationDelay = `${index * 80}ms`;
            card.innerHTML = `
                <div class="quiz-card-accent" style="background: ${quiz.gradient}"></div>
                <div class="quiz-card-body">
                    <div class="quiz-card-icon" style="background: ${quiz.gradient}; color: #fff;">
                        <i class="${quiz.icon}"></i>
                    </div>
                    <h3 class="quiz-card-name">${quiz.name}</h3>
                    <p class="quiz-card-desc">${quiz.description}</p>
                    <div class="quiz-card-meta">
                        <span class="meta-tag">
                            <i class="fas fa-list-ol"></i>
                            ${quiz.questions.length} Questions
                        </span>
                        <span class="meta-tag difficulty-${quiz.difficulty}">
                            <i class="fas fa-signal"></i>
                            ${capitalize(quiz.difficulty)}
                        </span>
                        <span class="meta-tag">
                            <i class="fas fa-clock"></i>
                            ${quiz.estimatedTime}
                        </span>
                    </div>
                </div>
                <div class="quiz-card-footer">
                    <button class="btn-start" style="background: ${quiz.gradient}" data-quiz-id="${quiz.id}">
                        <i class="fas fa-play"></i> Start Quiz
                    </button>
                </div>
            `;
            quizGrid.appendChild(card);
        });

        // Animate cards in
        requestAnimationFrame(() => {
            quizGrid.querySelectorAll(".quiz-card").forEach((card, i) => {
                card.style.opacity = "0";
                card.style.transform = "translateY(20px)";
                setTimeout(() => {
                    card.style.transition = "opacity 0.4s ease, transform 0.4s ease";
                    card.style.opacity = "1";
                    card.style.transform = "translateY(0)";
                }, i * 80);
            });
        });
    }

    /* ============================================================
       EVENT BINDING
       ============================================================ */
    function bindEvents() {
        // Quiz card start buttons (delegated)
        quizGrid.addEventListener("click", (e) => {
            const btn = e.target.closest(".btn-start");
            if (!btn) return;
            const quizId = btn.dataset.quizId;
            startQuiz(quizId);
        });

        // Filter chips
        filterChips.forEach(chip => {
            chip.addEventListener("click", () => {
                filterChips.forEach(c => c.classList.remove("active"));
                chip.classList.add("active");
                activeFilter = chip.dataset.filter;
                renderQuizCards(activeFilter);
            });
        });

        // Navigation
        btnPrev.addEventListener("click", goToPrevQuestion);
        btnNext.addEventListener("click", goToNextQuestion);
        btnSubmit.addEventListener("click", submitQuiz);

        // Quit quiz
        btnQuitQuiz.addEventListener("click", () => {
            modalQuit.classList.remove("hidden");
        });

        modalCancel.addEventListener("click", () => {
            modalQuit.classList.add("hidden");
        });

        modalConfirm.addEventListener("click", () => {
            modalQuit.classList.add("hidden");
            quitQuiz();
        });

        // Close modal on overlay click
        modalQuit.addEventListener("click", (e) => {
            if (e.target === modalQuit) {
                modalQuit.classList.add("hidden");
            }
        });

        // Result actions
        btnRetry.addEventListener("click", () => {
            if (currentQuiz) startQuiz(currentQuiz.id);
        });

        btnBackDashboard.addEventListener("click", goToDashboard);

        // Sidebar toggle
        menuToggle.addEventListener("click", () => {
            sidebar.classList.toggle("open");
            sidebarOverlay.classList.toggle("show");
        });

        sidebarOverlay.addEventListener("click", () => {
            sidebar.classList.remove("open");
            sidebarOverlay.classList.remove("show");
        });

        // Keyboard navigation
        document.addEventListener("keydown", (e) => {
            if (!viewQuiz.classList.contains("active-view")) return;

            if (e.key === "ArrowRight" || e.key === "Enter") {
                if (!btnNext.classList.contains("hidden")) {
                    goToNextQuestion();
                }
            } else if (e.key === "ArrowLeft") {
                goToPrevQuestion();
            } else if (e.key >= "1" && e.key <= "4") {
                const optionIndex = parseInt(e.key) - 1;
                selectAnswer(optionIndex);
            }
        });
    }

    /* ============================================================
       START QUIZ
       ============================================================ */
    function startQuiz(quizId) {
        currentQuiz = QUIZ_DATA.find(q => q.id === quizId);
        if (!currentQuiz) return;

        currentQuestionIndex = 0;
        userAnswers = new Array(currentQuiz.questions.length).fill(-1);

        // Parse timer from estimatedTime
        const timeMatch = currentQuiz.estimatedTime.match(/(\d+)/);
        const minutes = timeMatch ? parseInt(timeMatch[1]) : 5;
        timeRemaining = minutes * 60;

        showView("quiz");
        topbarHeading.textContent = currentQuiz.name + " Quiz";
        quizSubjectName.textContent = currentQuiz.name;

        renderNavigator();
        renderQuestion();
        startTimer();
    }

    /* ============================================================
       RENDER QUESTION
       ============================================================ */
    function renderQuestion() {
        const q = currentQuiz.questions[currentQuestionIndex];
        const total = currentQuiz.questions.length;

        // Counter
        questionCounter.textContent = `Question ${currentQuestionIndex + 1} of ${total}`;
        questionLabel.textContent = `Question ${currentQuestionIndex + 1}`;

        // Progress
        progressBar.style.width = `${((currentQuestionIndex + 1) / total) * 100}%`;

        // Question text
        questionText.textContent = q.question;

        // Options
        optionsGrid.innerHTML = "";
        q.options.forEach((opt, i) => {
            const card = document.createElement("div");
            card.className = "option-card";
            if (userAnswers[currentQuestionIndex] === i) {
                card.classList.add("selected");
            }
            card.innerHTML = `
                <span class="option-label">${LABELS[i]}</span>
                <span class="option-text">${opt}</span>
            `;
            card.addEventListener("click", () => selectAnswer(i));
            optionsGrid.appendChild(card);
        });

        // Buttons
        btnPrev.disabled = currentQuestionIndex === 0;

        if (currentQuestionIndex === total - 1) {
            btnNext.classList.add("hidden");
            btnSubmit.classList.remove("hidden");
        } else {
            btnNext.classList.remove("hidden");
            btnSubmit.classList.add("hidden");
        }

        // Update navigator
        updateNavigator();
    }

    /* ---------- Select Answer ---------- */
    function selectAnswer(index) {
        const q = currentQuiz.questions[currentQuestionIndex];
        if (index < 0 || index >= q.options.length) return;

        userAnswers[currentQuestionIndex] = index;

        // Update UI
        optionsGrid.querySelectorAll(".option-card").forEach((card, i) => {
            card.classList.toggle("selected", i === index);
        });

        updateNavigator();
    }

    /* ============================================================
       NAVIGATOR
       ============================================================ */
    function renderNavigator() {
        questionNavigator.innerHTML = "";
        currentQuiz.questions.forEach((_, i) => {
            const dot = document.createElement("button");
            dot.className = "nav-dot";
            dot.textContent = i + 1;
            dot.addEventListener("click", () => {
                currentQuestionIndex = i;
                renderQuestion();
            });
            questionNavigator.appendChild(dot);
        });
    }

    function updateNavigator() {
        const dots = questionNavigator.querySelectorAll(".nav-dot");
        dots.forEach((dot, i) => {
            dot.classList.remove("current", "answered");
            if (i === currentQuestionIndex) dot.classList.add("current");
            if (userAnswers[i] !== -1) dot.classList.add("answered");
        });
    }

    /* ============================================================
       NAVIGATION
       ============================================================ */
    function goToPrevQuestion() {
        if (currentQuestionIndex > 0) {
            currentQuestionIndex--;
            renderQuestion();
        }
    }

    function goToNextQuestion() {
        if (currentQuestionIndex < currentQuiz.questions.length - 1) {
            currentQuestionIndex++;
            renderQuestion();
        }
    }

    /* ============================================================
       TIMER
       ============================================================ */
    function startTimer() {
        clearInterval(timerInterval);
        updateTimerDisplay();

        timerInterval = setInterval(() => {
            timeRemaining--;

            if (timeRemaining <= 0) {
                timeRemaining = 0;
                clearInterval(timerInterval);
                submitQuiz();
            }

            updateTimerDisplay();
        }, 1000);
    }

    function updateTimerDisplay() {
        const mins = Math.floor(timeRemaining / 60);
        const secs = timeRemaining % 60;
        timerDisplay.textContent = `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;

        // Timer color states
        timerEl.classList.remove("warning", "danger");
        if (timeRemaining <= 30) {
            timerEl.classList.add("danger");
        } else if (timeRemaining <= 60) {
            timerEl.classList.add("warning");
        }
    }

    function stopTimer() {
        clearInterval(timerInterval);
    }

    /* ============================================================
       SUBMIT QUIZ
       ============================================================ */
    function submitQuiz() {
        stopTimer();

        const total = currentQuiz.questions.length;
        let correct = 0;

        currentQuiz.questions.forEach((q, i) => {
            if (userAnswers[i] === q.correct) correct++;
        });

        const incorrect = total - correct;
        const percentage = Math.round((correct / total) * 100);

        showView("result");
        topbarHeading.textContent = "Quiz Results";

        // Result icon
        resultIcon.className = "result-icon";
        if (percentage >= 80) {
            resultIcon.classList.add("gold");
            resultIcon.innerHTML = '<i class="fas fa-trophy"></i>';
        } else if (percentage >= 50) {
            resultIcon.classList.add("silver");
            resultIcon.innerHTML = '<i class="fas fa-medal"></i>';
        } else {
            resultIcon.classList.add("bronze");
            resultIcon.innerHTML = '<i class="fas fa-award"></i>';
        }

        resultSubject.textContent = currentQuiz.name;

        // Animate score
        animateValue(scoreValue, 0, correct, 1200);
        scoreTotal.textContent = `/ ${total}`;

        // Score circle
        const circumference = 2 * Math.PI * 52;
        const offset = circumference - (percentage / 100) * circumference;
        setTimeout(() => {
            scoreFill.style.strokeDashoffset = offset;
        }, 300);

        // Stats
        resultCorrect.textContent = correct;
        resultIncorrect.textContent = incorrect;
        resultPercentage.textContent = percentage + "%";

        // Performance message
        performanceMessage.className = "performance-message";
        if (percentage >= 90) {
            performanceMessage.textContent = "🌟 Outstanding! You're a genius!";
            performanceMessage.classList.add("excellent");
        } else if (percentage >= 70) {
            performanceMessage.textContent = "🎉 Great job! Keep it up!";
            performanceMessage.classList.add("good");
        } else if (percentage >= 50) {
            performanceMessage.textContent = "👍 Good effort! Room for improvement.";
            performanceMessage.classList.add("average");
        } else {
            performanceMessage.textContent = "📚 Keep studying! You'll get there!";
            performanceMessage.classList.add("poor");
        }

        // Render review
        renderReview();
    }

    /* ---------- Animate Number ---------- */
    function animateValue(el, start, end, duration) {
        let startTime = null;
        el.textContent = start;

        function step(timestamp) {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            const current = Math.floor(progress * (end - start) + start);
            el.textContent = current;
            if (progress < 1) {
                requestAnimationFrame(step);
            }
        }

        requestAnimationFrame(step);
    }

    /* ============================================================
       REVIEW ANSWERS
       ============================================================ */
    function renderReview() {
        reviewList.innerHTML = "";

        currentQuiz.questions.forEach((q, i) => {
            const userAnswer = userAnswers[i];
            const isCorrect = userAnswer === q.correct;

            const item = document.createElement("div");
            item.className = "review-item";

            let answersHTML = "";
            q.options.forEach((opt, j) => {
                let classes = "review-answer-row";
                let indicatorContent = LABELS[j];

                if (j === q.correct && j === userAnswer) {
                    classes += " user-selected correct-answer";
                    indicatorContent = '<i class="fas fa-check"></i>';
                } else if (j === userAnswer && j !== q.correct) {
                    classes += " user-selected wrong";
                    indicatorContent = '<i class="fas fa-times"></i>';
                } else if (j === q.correct) {
                    classes += " correct-answer";
                    indicatorContent = '<i class="fas fa-check"></i>';
                }

                answersHTML += `
                    <div class="${classes}">
                        <span class="review-answer-indicator">${indicatorContent}</span>
                        <span>${opt}</span>
                    </div>
                `;
            });

            item.innerHTML = `
                <div class="review-item-header">
                    <span class="review-q-number">Question ${i + 1}</span>
                    <span class="review-status ${isCorrect ? "correct" : "incorrect"}">
                        <i class="fas fa-${isCorrect ? "check-circle" : "times-circle"}"></i>
                        ${isCorrect ? "Correct" : "Incorrect"}
                    </span>
                </div>
                <div class="review-item-body">
                    <p class="review-question-text">${q.question}</p>
                    <div class="review-answers">
                        ${answersHTML}
                    </div>
                    <div class="review-explanation">
                        <strong><i class="fas fa-lightbulb"></i> Explanation:</strong> ${q.explanation}
                    </div>
                </div>
            `;

            reviewList.appendChild(item);
        });
    }

    /* ============================================================
       QUIT QUIZ
       ============================================================ */
    function quitQuiz() {
        stopTimer();
        goToDashboard();
    }

    function goToDashboard() {
        stopTimer();
        // Reset score circle for next time
        scoreFill.style.strokeDashoffset = 326.73;
        showView("dashboard");
        topbarHeading.textContent = "Quizzes";
    }

    /* ============================================================
       VIEW MANAGEMENT
       ============================================================ */
    function showView(name) {
        [viewDashboard, viewQuiz, viewResult].forEach(v => {
            v.classList.remove("active-view");
        });

        const map = {
            dashboard: viewDashboard,
            quiz: viewQuiz,
            result: viewResult,
        };

        if (map[name]) {
            map[name].classList.add("active-view");
            // Scroll to top
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    }

    /* ============================================================
       UTILITIES
       ============================================================ */
    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    /* ---------- Start ---------- */
    document.addEventListener("DOMContentLoaded", init);
})();
