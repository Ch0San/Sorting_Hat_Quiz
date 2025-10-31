// A=그리핀도르, B=슬리데린, C=래번클로, D=후플푸프

const QUESTIONS = 20;
const MAPPING = {
    A: "그리핀도르",
    B: "슬리데린",
    C: "래번클로",
    D: "후플푸프",
};

const HOUSE_DESC = {
    그리핀도르:
        "용기, 행동력, 정의감. 위험해도 내 사람은 내가 지킨다.\n" +
        "도망보다 돌진 쪽에 더 가깝고, 옳다고 믿으면 그냥 간다.",
    슬리데린:
        "야망, 자원관리, 현실 감각. 원하는 건 결국 손에 넣는다.\n" +
        "판을 읽고 움직이는 전략가 성향이 강하다.",
    래번클로:
        "지식, 분석, 통찰. 왜인지 이해 못 하면 아직 안 끝난 거다.\n" +
        "감정보다 원리·논리를 우선한다.",
    후플푸프:
        "성실, 믿음, 배려. '우리 전부 괜찮아야 돼'가 기본값.\n" +
        "사람을 버리지 않는 안정형 탱커 타입.",
};

// DOM refs
const warningBox = document.getElementById("warningBox");
const resultCard = document.getElementById("resultCard");
const resultHouse = document.getElementById("resultHouse");
const resultScores = document.getElementById("resultScores");
const resultDesc = document.getElementById("resultDesc");

const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const calcBtn = document.getElementById("calcBtn");

const progressNow = document.getElementById("progressNow");
const progressTotal = document.getElementById("progressTotal");
const progressText = document.getElementById("progressText");
const progressBar = document.getElementById("progressBar");

progressTotal.textContent = QUESTIONS.toString();

// 모든 question-block 수집
const questionBlocks = Array.from(
    document.querySelectorAll(".question-block")
);

// 현재 몇 번째 문항을 보고 있는지 (1부터 시작)
let currentStep = 1;

// step에 해당하는 질문 DOM 찾기
function getBlock(step) {
    return questionBlocks.find(
        (blk) => parseInt(blk.getAttribute("data-step"), 10) === step
    );
}

// 현재 step에서 라디오 체크됐는지
function getAnswer(qName) {
    const checked = document.querySelector(
        'input[name="' + qName + '"]:checked'
    );
    return checked ? checked.value : null;
}

// 전체 점수 tally (모든 문항 답이 있어야 함)
function tallyScores() {
    const score = { A: 0, B: 0, C: 0, D: 0 };
    for (let i = 1; i <= QUESTIONS; i++) {
        const ans = getAnswer("q" + i);
        if (!ans) return null;
        score[ans] += 1;
    }
    return score;
}

// 최고 득표 기숙사 선택
function pickHouse(score) {
    let bestKey = "A";
    let bestVal = -1;
    for (const k of ["A", "B", "C", "D"]) {
        if (score[k] > bestVal) {
            bestVal = score[k];
            bestKey = k;
        }
    }
    return { houseKey: bestKey, houseName: MAPPING[bestKey] };
}

// 결과 표시
function showResult() {
    const score = tallyScores();

    if (!score) {
        // 아직 안 고른 문항이 있으면 경고
        warningBox.style.display = "block";
        resultCard.style.display = "none";
        return;
    }

    warningBox.style.display = "none";

    const { houseName } = pickHouse(score);

    const line =
        "그리핀도르(A): " +
        score.A +
        "점\n" +
        "슬리데린(B): " +
        score.B +
        "점\n" +
        "래번클로(C): " +
        score.C +
        "점\n" +
        "후플푸프(D): " +
        score.D +
        "점";

    resultHouse.textContent = "당신의 기숙사: " + houseName + " 🪄";
    resultScores.textContent = line;
    resultDesc.textContent = HOUSE_DESC[houseName] || "";

    resultCard.style.display = "block";

    // 결과 카드로 스크롤
    resultCard.scrollIntoView({ behavior: "smooth", block: "center" });
}

// 현재 step UI 반영
function renderStep() {
    // 블록 show/hide
    questionBlocks.forEach((blk) => {
        const step = parseInt(blk.getAttribute("data-step"), 10);
        if (step === currentStep) {
            blk.classList.remove("hidden");
        } else {
            blk.classList.add("hidden");
        }
    });

    // 진행 텍스트/번호 업데이트
    const currentBlock = getBlock(currentStep);
    const qLabelEl = currentBlock.querySelector(".question-label");
    const qLabelText = qLabelEl ? qLabelEl.textContent.trim() : "";

    progressNow.textContent = currentStep.toString();
    progressText.textContent = qLabelText;

    // 프로그레스 바 (%)
    const pct = (currentStep / QUESTIONS) * 100;
    progressBar.style.width = pct + "%";

    // 이전/다음/결과 버튼 상태
    if (currentStep === 1) {
        prevBtn.disabled = true;
    } else {
        prevBtn.disabled = false;
    }

    if (currentStep === QUESTIONS) {
        nextBtn.classList.add("hidden");
        calcBtn.classList.remove("hidden");
    } else {
        nextBtn.classList.remove("hidden");
        calcBtn.classList.add("hidden");
    }

    // 경고 숨김 (다음 문제 넘어오면 경고 리셋)
    warningBox.style.display = "none";

    // 결과 카드 아직은 숨기자 (사용자가 뒤로 가도 이전 결과 안 남아있게 할지? -> 남겨도 됨.
    // 여기선 남겨둘게. 그대로 두는 게 사용자 입장 친절.)
}

// 현재 step에서 답 체크 여부
function answeredCurrentStep() {
    const ans = getAnswer("q" + currentStep);
    return !!ans;
}

// 다음으로 이동
function goNext() {
    if (!answeredCurrentStep()) {
        // 아직 안 골랐으면 경고
        warningBox.style.display = "block";
        return;
    }
    if (currentStep < QUESTIONS) {
        currentStep += 1;
        renderStep();
        // 새 질문 카드로 스크롤
        const blk = getBlock(currentStep);
        blk.scrollIntoView({ behavior: "smooth", block: "start" });
    }
}

// 이전으로 이동
function goPrev() {
    if (currentStep > 1) {
        currentStep -= 1;
        renderStep();
        const blk = getBlock(currentStep);
        blk.scrollIntoView({ behavior: "smooth", block: "start" });
    }
}

// 이벤트 바인딩
prevBtn.addEventListener("click", goPrev);
nextBtn.addEventListener("click", goNext);
calcBtn.addEventListener("click", showResult);

// 초기 렌더
renderStep();
