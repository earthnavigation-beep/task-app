const inputImageName = document.getElementById('image-name');

//タスクのidをセットする
const setTaskId = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const key = urlParams.get('key') || 'tasks';
  const tasks = JSON.parse(localStorage.getItem(key)) || [];
  if (tasks.length !== 0) {
    const task = tasks[tasks.length - 1];
    return task.id + 1;
  }
  return 1;
}


//タスクの完了や削除の処理を実装
const TaskListBtnEvent = () => {
  console.log("TaskListBtnEvent 実行中");
  // URLパラメータからキーを取得
  const urlParams = new URLSearchParams(window.location.search);
  const key = urlParams.get('key') || 'tasks'; // パラメータがなければ 'tasks' をデフォルトに

  const deleteBtns = document.querySelectorAll('.delete-btn');
  const compBtns = document.querySelectorAll('.complete-btn');

  deleteBtns.forEach((deleteBtn) => {
    deleteBtn.addEventListener('click', (e) => {
      const deleteTarget = e.target.closest('.task-item');
      const tasks = JSON.parse(localStorage.getItem(key)) || [];
      const targetId = deleteTarget.closest('li').dataset.taskId;
      const updatedTasks = tasks.filter(task => task.id !== parseInt(targetId));
      localStorage.setItem(key, JSON.stringify(updatedTasks));
      taskList.removeChild(deleteTarget.closest('li'));
    });
  });

  compBtns.forEach((compBtn) => {
    compBtn.addEventListener('click', (e) => {
      const compTarget = e.target.closest('li');
      const targetId = compTarget.dataset.taskId;
      const tasks = JSON.parse(localStorage.getItem(key)) || [];

      const updatedTasks = tasks.map(task => {
        if (task.id === parseInt(targetId)) {
          task.completed = !task.completed;
        }
        return task;
      });

      localStorage.setItem(key, JSON.stringify(updatedTasks));
      compTarget.classList.toggle('complete');

      const button = compTarget.querySelector('.complete-btn');
      const isCompleted = compTarget.classList.contains('complete');
      button.textContent = isCompleted ? '取消' : '完了';

      if (isCompleted) {
        taskList.appendChild(compTarget);
      } else {
        taskList.insertBefore(compTarget, taskList.firstChild);
      }

      resetAllFlagsIfComplete();
    });
  });

  document.querySelectorAll('.up-btn').forEach((upBtn) => {
    upBtn.addEventListener('click', (e) => {
      const item = e.target.closest('.task-item');
      const prev = item.previousElementSibling;
      if (prev) {
        taskList.insertBefore(item, prev);
        updateStorageOrder(key); // ← keyを渡すように変更
      }
    });
  });

  document.querySelectorAll('.down-btn').forEach((downBtn) => {
    downBtn.addEventListener('click', (e) => {
      const item = e.target.closest('.task-item');
      const next = item.nextElementSibling;
      if (next) {
        taskList.insertBefore(next, item);
        updateStorageOrder(key); // ← keyを渡すように変更
      }
    });
  });

  const editButtons = document.querySelectorAll('.edit-btn');
  editButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const taskId = e.target.dataset.taskId;
      const taskItem = document.querySelector(`[data-task-id="${taskId}"]`);
      const contentDiv = taskItem.querySelector('.task-content');
      const currentContent = contentDiv.innerHTML.replace(/<br>/g, '\n');
      inputForm.value = currentContent;
      editingTaskId = taskId;
      addBtn.textContent = '更新';
    });
  });
}

