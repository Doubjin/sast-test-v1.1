# 📊 SAST Google Sheets 연동 가이드

## 1단계: Apps Script 배포

1. [Google Spreadsheet 열기](https://docs.google.com/spreadsheets/d/1Yt0tv6kkAqUAS7RmDTnYYDOCwsH4bBFsniLQorxM-iE/edit)
2. 상단 메뉴 → **확장 프로그램** → **Apps Script** 클릭
3. 기본 코드를 모두 삭제하고, `google_apps_script.js` 파일의 내용을 **전체 복사하여 붙여넣기**
4. 💾 **저장** (Ctrl+S / ⌘+S)
5. 왼쪽 상단 드롭다운에서 `initSheets` 함수 선택 → ▶️ **실행** 클릭
   - 처음 실행 시 권한 승인 필요 → "고급" → "SAST(으)로 이동(안전하지 않음)" 클릭
6. 스프레드시트에 `스텝등록`, `통계` 시트가 자동 생성됨을 확인

## 2단계: 웹 앱 배포

1. Apps Script 편집기에서 **배포** → **새 배포** 클릭
2. ⚙️ 유형 선택: **웹 앱**
3. 설정:
   - **설명**: SAST 스텝 등록
   - **실행 사용자**: 나 (본인 계정)
   - **액세스 권한**: **모든 사용자**
4. **배포** 클릭
5. 생성된 **웹 앱 URL** 복사 (예: `https://script.google.com/macros/s/AKfy.../exec`)

## 3단계: 앱 연결

`app.js` 261번째 줄의 `GOOGLE_SHEET_URL`에 복사한 URL 붙여넣기:

```javascript
const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/여기에URL/exec";
```

## 4단계: 테스트

1. `index.html` 을 브라우저에서 열기
2. 테스트를 완료하고 콜시트에 정보 입력 후 등록
3. Google Spreadsheet의 `스텝등록` 시트에 데이터가 기록되는지 확인
4. 마무리 화면에서 통계 비율이 표시되는지 확인

---

## 시트 구조

### 📋 스텝등록 시트
| 제출일시 | 이름 | 성별 | 나이 | 거주지역 | 연락처 | 이메일 | 경력 | 특기파트 | SAST유형 |
|---------|------|------|------|---------|-------|--------|------|---------|---------|

### 📊 통계 시트
| 유형ID | 유형명 | 아이콘 | 색상 | 건수 | 비율(%) |
|--------|-------|-------|------|------|---------|
| ambient | 앰비언스 | 🎙️ | #4298B4 | 자동 | 자동 |
| wireless | 와이어리스 | 📡 | #33A474 | 자동 | 자동 |
| mixer | 믹서 | 🎚️ | #88619A | 자동 | 자동 |
| dynamic | 다이나믹 | 🎤 | #E4AE3A | 자동 | 자동 |
