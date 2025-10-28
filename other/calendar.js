const renderDateList = (year, month) => {
  const calendar = document.getElementById('calendar');
  calendar.innerHTML = ''; // 前の表示をクリア

  const daysOfWeek = ['日', '月', '火', '水', '木', '金', '土'];
  const firstDate = new Date(year, month -1, 1)
  const lastDate = new Date(year, month, 0).getDate(); // 今月の最終日

  let html = `<h2>${year}年${month}月の日付一覧</h2><ul>`;
  html += `<table border="1"><thead><tr>`;

  // 曜日のヘッダーを表示
  for (const day of daysOfWeek) {
    html += `<th>${day}</th>`;
  }
  html += `</tr></thead><tr>`;

  // 空白の曜日位置まで埋める
  let weekday = firstDate.getDay();
  for (let i = 0; i < weekday; i++) {
    html += `<td></td>`;
  }

  // 日付のセル
  for (let date = 1; date <= lastDate; date++) {
    html += `<td>${date}</td>`
    weekday++;
    if (weekday > 6) {
      html += `</tr><tr>`;
      weekday = 0;
    }
  }

  // 最終週の空白を埋める
  if (weekday !== 0) {
    for (let i = weekday; i < 7; i++) {
      html += `<td></td>`;
    }
  }

  html += `</tr></tbody></table>`;
  calendar.innerHTML = html;

};

// ✅ 呼び出し部分
const today = new Date();
renderDateList(today.getFullYear(), today.getMonth() + 1);

