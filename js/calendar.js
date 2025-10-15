const today = new Date();
const currentYear = today.getFullYear();
const currentMonth = today.getMonth() + 1;

const renderCalendar = (year, month) => {
  const calendar = document.getElementById('calendar');
  calendar.innerHTML = ''; // 前の表示をクリア

  const daysOfWeek = ['日', '月', '火', '水', '木', '金', '土'];
  const firstDate = new Date(year, month - 1, 1);
  const lastDate = new Date(year, month, 0).getDate(); // 今月の最終日

  let html = `<h2>${year}年${month}月のカレンダー</h2>`;
  html += '<table border="1"><thead><tr>';

  // 曜日のヘッダーを表示
  for (const day of daysOfWeek) {
    if (day === "日") {
      html += `<th class="sun">${day}</th>`;
    } else {
      html += `<th>${day}</th>`;
    }
  }
  html += '</tr></thead><tbody><tr>';

  // 空白の曜日位置まで埋める
  let weekday = firstDate.getDay();
  for (let i = 0; i < weekday; i++) {
    html += '<td></td>';
  }

  // 日付のセル
  for (let date = 1; date <= lastDate; date++) {
    const isToday = year === today.getFullYear() &&
      month === (today.getMonth() + 1) &&
      date === today.getDate();

    if (isToday) {
      html += `<td class="today">${date}</td>`; // 薄いグリーン
    } else {
      html += `<td>${date}</td>`;
    }
    
    weekday++;
    if (weekday > 6) {
      html += '</tr><tr>';
      weekday = 0;
    }
  }

  // 最終週の空白を埋める
  if (weekday !== 0) {
    for (let i = weekday; i < 7; i++) {
      html += '<td></td>';
    }
  }

  html += '</tr></tbody></table>';
  calendar.innerHTML = html;
};

// セレクトボックスを生成
const setupMonthSelector = () => {
  const selector = document.getElementById('monthSelector');
  for (let m = 1; m <= 12; m++) {
    const option = document.createElement('option');
    option.value = m;
    option.text = `${m}月`;
    if (m === currentMonth) option.selected = true;
    selector.appendChild(option);
  }

  selector.addEventListener('change', () => {
    const selectedMonth = parseInt(selector.value);
    renderCalendar(currentYear, selectedMonth);
  });
};

// 初期セットアップ
setupMonthSelector();
renderCalendar(currentYear, currentMonth);
