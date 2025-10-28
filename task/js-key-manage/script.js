const inputForm = document.querySelector('.task-input');
const inputDate = document.querySelector('.date');
const addBtn = document.querySelector('.add-btn');
const taskList = document.querySelector('.task-list');
let editingTaskId = null; // ← ファイルの最初の方に書いてOK

//ページがロードされたら処理を実行する
window.addEventListener('load', () => {
  displayTasksByKey();
  initSortable(); // ← 追加！
  ImageBtnEvent(); // 画像
});

// タスクを上下に移動させる
const upBtns = document.querySelectorAll('.up-btn');
const downBtns = document.querySelectorAll('.down-btn');

upBtns.forEach((upBtn) => {
  upBtn.addEventListener('click', (e) => {
    const item = e.target.closest('.task-item');
    const prev = item.previousElementSibling;
    if (prev) {
      taskList.insertBefore(item, prev);
    }
  });
});

// すべてが完了すれば、フラグがリセットされる
const resetAllFlagsIfComplete = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const key = urlParams.get('key') || 'tasks';
  const tasks = JSON.parse(localStorage.getItem(key)) || [];
  if (tasks.length === 0) return;

  const allCompleted = tasks.every(task => task.completed === true);

  if (allCompleted) {
    const resetTasks = tasks.map(task => {
      task.completed = false;
      return task;
    });
    localStorage.setItem(key, JSON.stringify(resetTasks));
    displayTasksByKey(); // UIを再描画
    // TaskListBtnEvent(); ← displayTasksByKey() の中で呼ばれているなら不要
  }
};

downBtns.forEach((downBtn) => {
  downBtn.addEventListener('click', (e) => {
    const item = e.target.closest('.task-item');
    const next = item.nextElementSibling;
    if (next) {
      taskList.insertBefore(next, item);
    }
  });
});

// ドラッグアンドドロップによる上下入れ替え
const sortable = new Sortable(taskList, {
  animation: 150,
  onEnd: () => {
    updateStorageOrder(); // 並び替え後にローカルストレージを更新
  }
});

// Sortableの初期化関数
const initSortable = () => {
  new Sortable(taskList, {
    animation: 150,
    ghostClass: 'sortable-ghost',
    onEnd: () => {
      updateStorageOrder(); // 並び替え後に保存
    }
  });
};


function getTaskKeyFromURL() {
    const params = new URLSearchParams(window.location.search);
    return decodeURIComponent(params.get('key'));
}

const displayTasksByKey = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const key = urlParams.get('key') || 'tasks';
  const tasks = JSON.parse(localStorage.getItem(key)) || [];

  taskList.innerHTML = ""; // 表示領域をクリア

  tasks.forEach(task => {
    const taskHTML = createTaskElement(task);
    taskList.insertAdjacentHTML('beforeend', taskHTML);
  });

  // ← HTMLを挿入した後にイベントを登録
  TaskListBtnEvent();
};

const key = new URLSearchParams(window.location.search).get('key') || 'tasks';
document.getElementById('task-title').textContent = `${key}`;
document.getElementById('main-title').textContent = `${key}`;