# Sorting Hat Quiz 🪄  
호그와트 기숙사 배정 테스트 (비공식 팬메이드)

이 프로젝트는 20개의 질문에 답하면 사용자의 성향을 분석해서
그리핀도르 / 슬리데린 / 래번클로 / 후플푸프 중 어느 기숙사에 가까운지 보여주는 간단한 웹 앱입니다.

> Hogwarts Sorting Quiz (fan-made).  
> Harry Potter IP belongs to its respective rights holders.  
> 이 프로젝트는 팬 작업이며, 상업적 의도가 없습니다.


---

## 🌟 데모 방식 / 실행 방법

### 1. 로컬에서 실행
1. 이 레포를 클론하거나 ZIP으로 내려받습니다.
2. 폴더 구조는 예를 들어 아래와 같습니다:
   ```text
   Sorting_Hat_Quiz/
   ├─ index.html      # 메인 페이지 (질문/결과 UI)
   ├─ index.js        # 로직 (진행/채점/결과 표시)
   ├─ style.css       # 스타일 (다크+골드 테마)
   └─ img/            # 각 기숙사 문장 이미지
      ├─ gryffindor.webp
      ├─ slytherin.webp
      ├─ ravenclaw.webp
      └─ hufflepuff.webp

3. `index.html`을 브라우저로 그냥 열면 바로 동작합니다.  
(별도 서버나 빌드 과정 필요 없음)

### 2. GitHub Pages로 배포
1. GitHub Repository → Settings → Pages 로 이동
2. **Build and deployment**
- Source: `Deploy from a branch`
- Branch: `main` / folder: `/ (root)`
3. 저장 후, 한 번 commit/push 하면  
`https://<GitHub아이디>.github.io/<레포명>/` 주소에서 동작합니다.

예:  
`https://ch0san.github.io/Sorting_Hat_Quiz/`


---

## 🧙 사용 흐름

1. 화면에는 한 번에 하나의 질문만 보여집니다.
2. 각 질문은 보기 A / B / C / D 중 하나를 선택하는 단일 선택 라디오 버튼입니다.
3. `다음 →` 버튼으로 다음 문항으로 이동합니다.
4. 마지막(20번) 문제까지 선택하면 `결과 보기 🪄` 버튼이 활성화됩니다.
5. 결과 카드를 통해 다음 정보가 표시됩니다:
- 당신의 기숙사
- 기숙사 문장(이미지)
- 각 선택지 타입별 득표 수 (A, B, C, D)
- 성향 설명


---

## 🧮 점수 계산 로직

- 각 보기 선택지는 내부적으로 다음 4가지 성향 중 하나에 매핑됩니다:

| 보기 | 기숙사 성향          |
|------|----------------------|
| A    | 그리핀도르 (용기, 정의) |
| B    | 슬리데린 (야망, 전략)   |
| C    | 래번클로 (지적 호기심)  |
| D    | 후플푸프 (배려, 협력)  |

- 사용자가 A/B/C/D 중 어떤 걸 골랐는지 전부 누적해서 카운트합니다.
```js
const score = { A: 0, B: 0, C: 0, D: 0 };
