document.getElementById('reset-storage').addEventListener('click', () => {
  localStorage.removeItem('tasks'); // または clear()
  displayTasks(); // UIを再描画
});

document.getElementById('reset-storage2').addEventListener('click', () => {
  localStorage.removeItem('tasks'); // または clear()
  displayTasks(); // UIを再描画
});

document.getElementById('image-upload').addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;

  // ファイル名を取得して表示（保存用）
  document.getElementById('image-name').value = file.name;
});

// ローカルストレージの更新関数
function updateLocalStorage(taskId, updatedData) {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  const updatedTasks = tasks.map(task => {
    if (task.id == taskId) {
      task.raw = updatedData.raw;
      task.content = updatedData.content;
    }
    return task;
  });
  localStorage.setItem('tasks', JSON.stringify(updatedTasks));
}