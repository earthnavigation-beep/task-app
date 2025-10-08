//ローカルストレージにタスクを保存する
const saveLocalStorage = (task) => {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks.push(task);
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

document.getElementById('reset-storage').addEventListener('click', () => {
  localStorage.removeItem('tasks'); // または clear()
  displayTasks(); // UIを再描画
});

document.getElementById('image-upload').addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;

  // ファイル名を取得して表示（保存用）
  document.getElementById('image-name').value = file.name;
});