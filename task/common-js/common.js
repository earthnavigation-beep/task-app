// index、task、task-runner共通コード

const inputDate = document.querySelector('.date');
const addBtn = document.querySelector('.add-btn');
const taskList = document.querySelector('.task-list');
const inputImageName = document.getElementById('image-name');
let editingTaskId = null; // ← ファイルの最初の方に書いてOK



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

downBtns.forEach((downBtn) => {
  downBtn.addEventListener('click', (e) => {
    const item = e.target.closest('.task-item');
    const next = item.nextElementSibling;
    if (next) {
      taskList.insertBefore(next, item);
    }
  });
});

// index、tasks、すべてが完了すれば、フラグがリセットされる
const resetAllFlagsIfComplete = () => {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  if (tasks.length === 0) return;

  const allCompleted = tasks.every(task => task.completed === true);

  if (allCompleted) {
    const resetTasks = tasks.map(task => {
      task.completed = false;
      return task;
    });
    localStorage.setItem('tasks', JSON.stringify(resetTasks));
    displayTasks(); // UIを再描画
    TaskListBtnEvent();
  }
};



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

const ImageBtnEvent = () => {
  const imageBtns = document.querySelectorAll('.image-btn');
  imageBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const imagePath = btn.getAttribute('data-image-path');
      const img = new Image();
      img.src = imagePath;
      img.onload = () => {
        const width = img.width;
        const height = img.height;
        window.open(imagePath, 'manualImage', `width=${width},height=${height}`);
      };
    });
  });
};

//ローカルストレージにタスクがある場合は表示する
const displayTasks = () => {
  taskList.innerHTML = '';
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks.sort((a, b) => {
    return (a.completed === b.completed) ? 0 : a.completed ? 1 : -1;
  });
  if (tasks.length !== 0) {
    tasks.forEach((task) => {
      taskList.innerHTML += createTaskElement(task);
    });
    ImageBtnEvent(); // ← ここでイベントを再設定
  }
}

//タスクの完了や削除の処理を実装
const TaskListBtnEvent = () => {
  const deleteBtns = document.querySelectorAll('.delete-btn');
  const compBtns = document.querySelectorAll('.complete-btn');
  deleteBtns.forEach((deleteBtn) => {
    deleteBtn.addEventListener('click', (e) => {
      const deleteTarget = e.target.closest('.task-item');
      const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
      const targetId = deleteTarget.closest('li').dataset.taskId;
      const updatedTasks = tasks.filter(task => task.id !== parseInt(targetId));
      //ローカルストレージにupdatedTasksを保存する
      localStorage.setItem('tasks', JSON.stringify(updatedTasks));
      //taskListから削除するタスクを取り除く
      taskList.removeChild(deleteTarget.closest('li'));
    });
  });

  //compBtnsを1つずつ取り出して処理を実行する
  compBtns.forEach((compBtn) => {
    //完了ボタンをクリックすると処理を実行する
    compBtn.addEventListener('click', (e) => {
      //完了するタスクのliタグを取得
      const compTarget = e.target.closest('li');
      const targetId = compTarget.dataset.taskId;
      const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

      // 対象のタスクを更新
      const updatedTasks = tasks.map(task => {
        if (task.id === parseInt(targetId)) {
          task.completed = !task.completed;
        }
        return task;
      })

      // 保存しなおす
      localStorage.setItem('tasks', JSON.stringify(updatedTasks));

      //compTargetにcompleteクラスがない場合は追加、ある場合は削除する
      compTarget.classList.toggle('complete');

      // ボタンラベルを切り替える
      const button = compTarget.querySelector('.complete-btn');
      const isCompleted = compTarget.classList.contains('complete');
      button.textContent = isCompleted ? '取消' : '完了';

      // 🔽 完了したタスクはリストの末尾へ移動
      if (isCompleted) {
        taskList.appendChild(compTarget); // 完了 → 下へ移動
      } else {
        // 未完了に戻した場合は先頭へ移動（任意）
        taskList.insertBefore(compTarget, taskList.firstChild);
      }

      // すべてが完了すれば、フラグをリセットする。
      resetAllFlagsIfComplete();
    });
  });

  // 上へ移動
  document.querySelectorAll('.up-btn').forEach((upBtn) => {
    upBtn.addEventListener('click', (e) => {
      const item = e.target.closest('.task-item');
      const prev = item.previousElementSibling;
      if (prev) {
        taskList.insertBefore(item, prev);
        updateStorageOrder();
      }
    });
  });

  // 下へ移動
  document.querySelectorAll('.down-btn').forEach((downBtn) => {
    downBtn.addEventListener('click', (e) => {
      const item = e.target.closest('.task-item');
      const next = item.nextElementSibling;
      if (next) {
        taskList.insertBefore(next, item);
        updateStorageOrder();
      }
    });
  });

  // 編集イベント
  const editButtons = document.querySelectorAll('.edit-btn');
  if (!editButtons.length) return;
  editButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const taskId = e.target.dataset.taskId;
      const taskItem = document.querySelector(`[data-task-id="${taskId}"]`);
      const contentDiv = taskItem.querySelector('.task-content');

      const currentContent = contentDiv.innerHTML.replace(/<br>/g, '\n');

      inputForm.value = currentContent;

      editingTaskId = taskId;
      // 追加ボタンのラベルを変更
      addBtn.textContent = '更新';
    });
  });
}
