// こちらはタスクアプリを使用するうえで、タスク1と2と3の共通関数をまとめています。

//期日のフォーマットを変更する
const formattedDate = (dateString) => {
  const selectedDate = new Date(dateString);
  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth() + 1;
  const day = selectedDate.getDate();
  const getDay = selectedDate.getDay();
  const daysOfWeek = ['日', '月', '火', '水', '木', '金', '土'];
  const dayOfWeek = daysOfWeek[getDay];

  return `${year}年${month}月${day}日(${dayOfWeek})`;
}

function insertSpanNote() {
  const textarea = document.getElementById('task-input');
  const noteTag = '<span class="task-note">※ここに注意書きを入力</span>';
  textarea.value += noteTag;
}

function insertDivNote() {
  const textarea = document.getElementById('task-input');
  const noteTag = '<div class="task-note">※ここに注意書きを入力</div>';
  textarea.value += '\n' + noteTag + '\n';
}