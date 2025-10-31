// =========================
// 설정값 / 상수
// =========================

// 전체 문항 수
const QUESTIONS = 20;

// 답안 -> 기숙사 매핑용 키
// A=그리핀도르, B=슬리데린, C=래번클로, D=후플푸프
const MAPPING = {
    A: "그리핀도르",
    B: "슬리데린",
    C: "래번클로",
    D: "후플푸프",
};

// 각 기숙사 설명
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

// 각 기숙사 이미지 경로
const HOUSE_IMG = {
    "그리핀도르": "./img/gryffindor.webp",
    "슬리데린": "./img/slytherin.webp",
    "래번클로": "./img/ravenclaw.webp",
    "후플푸프": "./img/hufflepuff.webp",
};

// =========================
// DOM 요소 가져오기
// =========================

const warningBox = document.getElementById("warningBox");

const resultCard = document.getElementById("resultCard");
const resultHouse = document.getElementById("resultHouse");
const resultScores = document.getElementById("resultScores");
const resultDesc = document.getElementById("resultDesc");
const resultImg = document.getElementById("resultImg");

const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const calcBtn = document.getElementById("calcBtn");

const progressNow = document.getElementById("progressNow");
const progressTotal = document.getElementById("progressTotal");
const progressText = document.getElementById("progressText");
const progressBar = document.getElementById("progressBar");

progressTotal.textContent = QUESTIONS.toString();

// 모든 질문 블록들
const questionBlocks = Array.from(
    document.querySelectorAll(".question-block")
);

// 지금 보고 있는 문제 번호 (1부터 시작)
let currentStep = 1;

// =========================
// 유틸 / 헬퍼 함수
// =========================

// 현재 step 번호에 해당하는 question-block DOM 찾아오기
function getBlock(step) {
    return questionBlocks.find((blk) => {
        return parseInt(blk.getAttribute("data-step"), 10) === step;
    });
}

// 현재 step의 답이 체크되어 있는지 가져오기
function getAnswer(qName) {
    const checked = document.querySelector(
        'input[name="' + qName + '"]:checked'
    );
    return checked ? checked.value : null;
}

// 모든 문항의 점수(A/B/C/D 카운트) 집계
// 전 문항 다 안 골랐으면 null 리턴
function tallyScores() {
    const score = { A: 0, B: 0, C: 0, D: 0 };
    for (let i = 1; i <= QUESTIONS; i++) {
        const ans = getAnswer("q" + i);
        if (!ans) {
            return null; // 아직 안 고른 문제가 있다
        }
        score[ans] += 1;
    }
    return score;
}

// 최다 득표 하우스를 결정
function pickHouse(score) {
    let bestKey = "A";
    let bestVal = -1;
    for (const k of ["A", "B", "C", "D"]) {
        if (score[k] > bestVal) {
            bestVal = score[k];
            bestKey = k;
        }
    }
    return {
        houseKey: bestKey,
        houseName: MAPPING[bestKey],
    };
}

// =========================
// 결과 보여주기
// =========================
function showResult() {
    const score = tallyScores();

    if (!score) {
        // 아직 안 고른 문항이 하나라도 있으면 경고만 띄우고 결과는 안 보여줌
        warningBox.style.display = "block";
        resultCard.style.display = "none";
        return;
    }

    warningBox.style.display = "none";

    const { houseName } = pickHouse(score);

    // 점수 라인 텍스트 구성
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

    // 텍스트 결과 세팅
    resultHouse.textContent = "당신의 기숙사: " + houseName + " 🪄";
    resultScores.textContent = line;
    resultDesc.textContent = HOUSE_DESC[houseName] || "";

    // 이미지 세팅
    const imgUrl = HOUSE_IMG[houseName] || "";
    if (imgUrl) {
        resultImg.src = imgUrl;
        resultImg.alt = houseName + " 문장";
        resultImg.style.display = "block";
    } else {
        // 혹시라도 매칭 실패 시 이미지 감춤
        resultImg.removeAttribute("src");
        resultImg.style.display = "none";
    }

    // 카드 보여주기
    resultCard.style.display = "block";

    // 결과 카드로 스크롤 다운
    resultCard.scrollIntoView({ behavior: "smooth", block: "center" });
}

// =========================
// 스텝 전환 / UI 업데이트
// =========================

// 현재 step만 보이게 하고 나머지는 숨김
function renderStep() {
    // 질문 show/hide
    questionBlocks.forEach((blk) => {
        const step = parseInt(blk.getAttribute("data-step"), 10);
        if (step === currentStep) {
            blk.classList.remove("hidden");
        } else {
            blk.classList.add("hidden");
        }
    });

    // 진행도 텍스트, 번호
    const currentBlock = getBlock(currentStep);
    const qLabelEl = currentBlock.querySelector(".question-label");
    const qLabelText = qLabelEl ? qLabelEl.textContent.trim() : "";

    progressNow.textContent = currentStep.toString();
    progressText.textContent = qLabelText;

    // 진행 바 (%)
    const pct = (currentStep / QUESTIONS) * 100;
    progressBar.style.width = pct + "%";

    // 이전 버튼 상태
    if (currentStep === 1) {
        prevBtn.disabled = true;
    } else {
        prevBtn.disabled = false;
    }

    // 다음 / 결과 버튼 토글
    if (currentStep === QUESTIONS) {
        nextBtn.classList.add("hidden"); // 마지막 문제면 "다음" 숨기기
        calcBtn.classList.remove("hidden"); // "결과 보기" 보여주기
    } else {
        nextBtn.classList.remove("hidden");
        calcBtn.classList.add("hidden");
    }

    // 경고창은 스텝 렌더할 때 숨김
    warningBox.style.display = "none";

    // (결과카드는 그대로 둬서 사용자가 뒤로 가도 볼 수 있게 함)
}

// 현재 step이 답변되었는지 확인
function answeredCurrentStep() {
    const ans = getAnswer("q" + currentStep);
    return !!ans;
}

// 다음 step으로 이동
function goNext() {
    // 현재 문제 체크 안 했으면 경고 띄우고 이동 안 함
    if (!answeredCurrentStep()) {
        warningBox.style.display = "block";
        return;
    }

    if (currentStep < QUESTIONS) {
        currentStep += 1;
        renderStep();

        const blk = getBlock(currentStep);
        blk.scrollIntoView({ behavior: "smooth", block: "start" });
    }
}

// 이전 step으로 이동
function goPrev() {
    if (currentStep > 1) {
        currentStep -= 1;
        renderStep();

        const blk = getBlock(currentStep);
        blk.scrollIntoView({ behavior: "smooth", block: "start" });
    }
}

// =========================
// 이벤트 바인딩
// =========================

prevBtn.addEventListener("click", goPrev);
nextBtn.addEventListener("click", goNext);
calcBtn.addEventListener("click", showResult);

// 초기 렌더
renderStep();
