/**
 * ============================================================
 *  SAST — Google Apps Script (Web App)
 *  
 *  이 코드를 Google Spreadsheet의 Apps Script 편집기에
 *  붙여넣으세요.
 *  
 *  스프레드시트 ID: 1Yt0tv6kkAqUAS7RmDTnYYDOCwsH4bBFsniLQorxM-iE
 * ============================================================
 */

// ─── 설정 ────────────────────────────────────────────────────
const SHEET_NAME_REGISTRATION = "스텝등록";
const SHEET_NAME_STATS = "통계";

// ─── 시트 초기화 (헤더 자동 생성) ─────────────────────────────
function initSheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // 스텝등록 시트
  let regSheet = ss.getSheetByName(SHEET_NAME_REGISTRATION);
  if (!regSheet) {
    regSheet = ss.insertSheet(SHEET_NAME_REGISTRATION);
  }
  if (regSheet.getLastRow() === 0) {
    const headers = [
      "제출일시", "이름", "성별", "나이", "거주지역",
      "연락처", "이메일", "경력", "특기파트", "SAST유형"
    ];
    regSheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    regSheet.getRange(1, 1, 1, headers.length)
      .setFontWeight("bold")
      .setBackground("#4298B4")
      .setFontColor("#FFFFFF");
    regSheet.setFrozenRows(1);
    // 열 너비 설정
    regSheet.setColumnWidth(1, 160);  // 제출일시
    regSheet.setColumnWidth(2, 100);  // 이름
    regSheet.setColumnWidth(3, 60);   // 성별
    regSheet.setColumnWidth(4, 60);   // 나이
    regSheet.setColumnWidth(5, 100);  // 거주지역
    regSheet.setColumnWidth(6, 140);  // 연락처
    regSheet.setColumnWidth(7, 200);  // 이메일
    regSheet.setColumnWidth(8, 80);   // 경력
    regSheet.setColumnWidth(9, 250);  // 특기파트
    regSheet.setColumnWidth(10, 120); // SAST유형
  }

  // 통계 시트
  let statsSheet = ss.getSheetByName(SHEET_NAME_STATS);
  if (!statsSheet) {
    statsSheet = ss.insertSheet(SHEET_NAME_STATS);
  }
  if (statsSheet.getLastRow() === 0) {
    const statsHeaders = ["유형ID", "유형명", "아이콘", "색상", "건수", "비율(%)"];
    statsSheet.getRange(1, 1, 1, statsHeaders.length).setValues([statsHeaders]);
    statsSheet.getRange(1, 1, 1, statsHeaders.length)
      .setFontWeight("bold")
      .setBackground("#88619A")
      .setFontColor("#FFFFFF");
    statsSheet.setFrozenRows(1);

    // 초기 유형 데이터 입력
    const typeData = [
      ["ambient", "앰비언스", "🎙️", "#4298B4", 0, 0],
      ["wireless", "와이어리스", "📡", "#33A474", 0, 0],
      ["mixer", "믹서", "🎚️", "#88619A", 0, 0],
      ["dynamic", "다이나믹", "🎤", "#E4AE3A", 0, 0]
    ];
    statsSheet.getRange(2, 1, typeData.length, typeData[0].length).setValues(typeData);

    // 열 너비 설정
    statsSheet.setColumnWidth(1, 100);
    statsSheet.setColumnWidth(2, 100);
    statsSheet.setColumnWidth(3, 60);
    statsSheet.setColumnWidth(4, 80);
    statsSheet.setColumnWidth(5, 80);
    statsSheet.setColumnWidth(6, 80);
  }

  SpreadsheetApp.getUi().alert("시트 초기화 완료! ✅");
}

// ─── POST: 콜시트 데이터 저장 ─────────────────────────────────
function doPost(e) {
  try {
    const ss = SpreadsheetApp.openById("1Yt0tv6kkAqUAS7RmDTnYYDOCwsH4bBFsniLQorxM-iE");
    let sheet = ss.getSheetByName(SHEET_NAME_REGISTRATION);

    // 시트가 없으면 생성
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME_REGISTRATION);
      const headers = [
        "제출일시", "이름", "성별", "나이", "거주지역",
        "연락처", "이메일", "경력", "특기파트", "SAST유형"
      ];
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold");
      sheet.setFrozenRows(1);
    }

    // 데이터 파싱
    const data = JSON.parse(e.postData.contents);

    // 특기파트가 배열이면 콤마로 합치기
    const skills = Array.isArray(data.cs_skills)
      ? data.cs_skills.join(", ")
      : (data.cs_skills || "");

    // SAST 유형 한글 매핑
    const typeMap = {
      'ambient': '🎙️ 앰비언스',
      'wireless': '📡 와이어리스',
      'mixer': '🎚️ 믹서',
      'dynamic': '🎤 다이나믹'
    };

    const row = [
      new Date().toLocaleString("ko-KR", { timeZone: "Asia/Seoul" }),
      data.cs_name || "",
      data.cs_gender || "",
      data.cs_age || "",
      data.cs_region || "",
      data.cs_phone || "",
      data.cs_email || "",
      data.cs_career || "",
      skills,
      typeMap[data.resultType] || data.resultType || ""
    ];

    sheet.appendRow(row);

    // 통계 업데이트
    updateStats(ss);

    return ContentService
      .createTextOutput(JSON.stringify({ success: true, message: "등록 완료!" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: error.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ─── GET: 통계 데이터 반환 ────────────────────────────────────
function doGet(e) {
  try {
    const ss = SpreadsheetApp.openById("1Yt0tv6kkAqUAS7RmDTnYYDOCwsH4bBFsniLQorxM-iE");

    // 통계 재계산
    updateStats(ss);

    // 통계 시트에서 데이터 읽기
    const statsSheet = ss.getSheetByName(SHEET_NAME_STATS);
    if (!statsSheet || statsSheet.getLastRow() < 2) {
      return ContentService
        .createTextOutput(JSON.stringify({
          success: true,
          stats: [
            { id: "ambient", pct: 25 },
            { id: "wireless", pct: 25 },
            { id: "mixer", pct: 25 },
            { id: "dynamic", pct: 25 }
          ],
          total: 0
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    const data = statsSheet.getRange(2, 1, 4, 6).getValues();
    const stats = data.map(row => ({
      id: row[0],
      label: row[1],
      icon: row[2],
      color: row[3],
      count: row[4],
      pct: row[5]
    }));

    const total = stats.reduce((sum, s) => sum + s.count, 0);

    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        stats: stats,
        total: total
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: error.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ─── 통계 자동 업데이트 ───────────────────────────────────────
function updateStats(ss) {
  const regSheet = ss.getSheetByName(SHEET_NAME_REGISTRATION);
  let statsSheet = ss.getSheetByName(SHEET_NAME_STATS);

  if (!regSheet) return;

  // 통계 시트가 없으면 생성
  if (!statsSheet) {
    statsSheet = ss.insertSheet(SHEET_NAME_STATS);
    const headers = ["유형ID", "유형명", "아이콘", "색상", "건수", "비율(%)"];
    statsSheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    statsSheet.getRange(1, 1, 1, headers.length).setFontWeight("bold");
    statsSheet.setFrozenRows(1);
    const typeData = [
      ["ambient", "앰비언스", "🎙️", "#4298B4", 0, 0],
      ["wireless", "와이어리스", "📡", "#33A474", 0, 0],
      ["mixer", "믹서", "🎚️", "#88619A", 0, 0],
      ["dynamic", "다이나믹", "🎤", "#E4AE3A", 0, 0]
    ];
    statsSheet.getRange(2, 1, typeData.length, typeData[0].length).setValues(typeData);
  }

  // 스텝등록 시트에서 유형 카운트
  const lastRow = regSheet.getLastRow();
  if (lastRow < 2) return; // 헤더만 있는 경우

  const typeColumn = regSheet.getRange(2, 10, lastRow - 1, 1).getValues(); // J열 = SAST유형
  const counts = { ambient: 0, wireless: 0, mixer: 0, dynamic: 0 };

  const typeKeyMap = {
    '🎙️ 앰비언스': 'ambient',
    '📡 와이어리스': 'wireless',
    '🎚️ 믹서': 'mixer',
    '🎤 다이나믹': 'dynamic'
  };

  typeColumn.forEach(row => {
    const val = (row[0] || "").toString().trim();
    const key = typeKeyMap[val] || val;
    if (counts.hasOwnProperty(key)) counts[key]++;
  });

  const total = Object.values(counts).reduce((a, b) => a + b, 0);

  // 통계 시트 업데이트
  const typeOrder = ["ambient", "wireless", "mixer", "dynamic"];
  const typeNames = {
    ambient: "앰비언스", wireless: "와이어리스",
    mixer: "믹서", dynamic: "다이나믹"
  };
  const typeIcons = {
    ambient: "🎙️", wireless: "📡",
    mixer: "🎚️", dynamic: "🎤"
  };
  const typeColors = {
    ambient: "#4298B4", wireless: "#33A474",
    mixer: "#88619A", dynamic: "#E4AE3A"
  };

  const updatedData = typeOrder.map(id => [
    id,
    typeNames[id],
    typeIcons[id],
    typeColors[id],
    counts[id],
    total > 0 ? Math.round((counts[id] / total) * 100) : 25
  ]);

  statsSheet.getRange(2, 1, 4, 6).setValues(updatedData);
}

// ─── 메뉴 추가 (수동 실행용) ──────────────────────────────────
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu("🎙️ SAST")
    .addItem("📋 시트 초기화", "initSheets")
    .addItem("📊 통계 새로고침", "refreshStats")
    .addToUi();
}

function refreshStats() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  updateStats(ss);
  SpreadsheetApp.getUi().alert("통계가 업데이트되었습니다! 📊");
}
