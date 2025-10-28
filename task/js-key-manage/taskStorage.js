// ローカルストレージに保存する
const saveLocalStorage = (task) => {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks.push(task);
  localStorage.setItem('tasks', JSON.stringify(tasks));
};

// ローカルストレージに順番変更を保存する
const updateStorageOrder = () => {
  const newOrder = [];
  document.querySelectorAll('.task-item').forEach(item => {
    const taskId = parseInt(item.dataset.taskId);
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const task = tasks.find(t => t.id === taskId);
    if (task) newOrder.push(task);
  });
  localStorage.setItem('tasks', JSON.stringify(newOrder));
};