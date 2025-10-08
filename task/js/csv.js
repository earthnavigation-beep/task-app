// タスクからCSVへのロジック
const taskToCSVRow = (task) => {
  const id = task.id;
  const content = task.content.replace(/"/g, '""').replace(/\n/g, '<br>');
  const date = task.date ? task.date.replace(/,/g, '') : '';
  const imagePath = task.imagePath ? task.imagePath.replace(/,/g, '') : '';
  return `${id},"${content}",${date},${imagePath}`;
};

// CSVからタスクへのロジック
const csvRowToTask = (line, index) => {
  if (line.trim() === '') return null;

  const [id, contentRaw, dateRaw, imagePathRaw] = line.split(',');

  if (index === 0 && contentRaw === 'タスク') return null;

  const content = contentRaw.replace(/"/g, '').replace(/<br>/g, '\n');
  const date = dateRaw ? dateRaw.trim() : null;
  const imagePath = imagePathRaw ? imagePathRaw.trim() : null;

  return {
    id: parseInt(id),
    content,
    date,
    imagePath,
    completed: false
  };
};



// CSV エクスポート
const downloadCSV = () => {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  if (tasks.length === 0) {
    alert("保存されたタスクがありません。");
    return;
  }

  let csv = "ID,タスク,期日,画像リンク\n";
  csv += tasks.map(taskToCSVRow).join('\r\n') + '\r\n';

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "tasks.csv";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};


// CSVインポート
document.getElementById('csv-import').addEventListener('change', function (e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (event) {
    const lines = event.target.result.split('\n');
    const importedTasks = lines
      .map((line, index) => csvRowToTask(line, index))
      .filter(task => task !== null);

    const currentTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const allTasks = [...currentTasks, ...importedTasks];
    localStorage.setItem('tasks', JSON.stringify(allTasks));

    displayTasks();
    TaskListBtnEvent();
  };

  reader.readAsText(file);
});
