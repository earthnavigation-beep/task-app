// ローカルストレージに順番変更を保存する
const updateStorageOrder = () => {
  const key = getTaskKeyFromURL(); // ← ここでKeyを取得
  const originalTasks = JSON.parse(localStorage.getItem(key)) || [];

  const newOrder = [];
  document.querySelectorAll('.task-item').forEach(item => {
    const taskId = parseInt(item.dataset.taskId);
    const task = originalTasks.find(t => t.id === taskId);
    if (task) newOrder.push(task);
  });

  localStorage.setItem(key, JSON.stringify(newOrder)); // ← Keyに保存
};