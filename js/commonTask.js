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
  textarea.value = textarea.value.trimEnd(); // 末尾の改行を削除
  textarea.value += noteTag;
}

function insertDivNote() {
  const textarea = document.getElementById('task-input');
  const noteTag = '<div class="task-note">※ここに注意書きを入力</div>';
  textarea.value += noteTag;
}

function sanitizeHtml(input) {
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: ['span', 'div', 'a', 'br'],
    ALLOWED_ATTR: ['class', 'href', 'target', 'rel']
  });
}

// const quill = new Quill('#editor', {
//   theme: 'snow',
//   modules: {
//     toolbar: [
//       [{ 'color': [] }, { 'background': [] }],
//       ['bold', 'italic', 'underline'],
//       ['link', 'image'],
//       [{ 'list': 'ordered' }, { 'list': 'bullet' }]
//     ]
//   }
// });

// document.addEventListener('DOMContentLoaded', () => {
//   const quill = new Quill('#task-input', {
//     theme: 'snow'
//   });
// });