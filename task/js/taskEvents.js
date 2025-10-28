const inputImageName = document.getElementById('image-name');

//追加ボタンを押したら処理を実行する
addBtn.addEventListener('click', () => {
  if (!inputForm.value) {
    document.querySelector('.error-msg').classList.add('show');
    return;
  }

  if (editingTaskId) {
    const taskItem = document.querySelector(`[data-task-id="${editingTaskId}"]`);
    const contentDiv = taskItem.querySelector('.task-content');

    const rawInput = inputForm.value;
    const sanitized = sanitizeHtml(rawInput);

    contentDiv.innerHTML = sanitized;

    updateLocalStorage(editingTaskId, {
      raw: rawInput,
      content: sanitized
    });

    displayTasks();
    TaskListBtnEvent();
    ImageBtnEvent();

    editingTaskId = null;
    addBtn.textContent = '追加';
  } else {
    // 通常の新規追加処理
    let taskId = setTaskId();

    const rawInput = inputForm.value;
    const sanitized = sanitizeHtml(rawInput);

    const task = {
      id: taskId,
      raw: rawInput,         // 編集用に元の入力を保存
      content: sanitized,    // 表示用にサニタイズ済みのHTMLを保存
      date: inputDate.value ? formattedDate(inputDate.value) : null,
      completed: false,
      imagePath: inputImageName.value ? `images/${inputImageName.value}` : null
    };

    taskList.innerHTML += createTaskElement(task); // 表示用に sanitized を使うように
    TaskListBtnEvent();
    saveLocalStorage(task);
    ImageBtnEvent();
  }

  // 入力フォームをリセット
  inputForm.value = '';
  inputDate.value = '';
  inputImageName.value ='';
});

//タスクのidをセットする
const setTaskId = () => {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  if (tasks.length !== 0) {
    const task = tasks[tasks.length - 1];
    return task.id + 1;
  }
  return 1;
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
  editButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const taskId = e.target.dataset.taskId;
      const taskItem = document.querySelector(`[data-task-id="${taskId}"]`);
      const contentDiv = taskItem.querySelector('.task-content');

      // 現在の内容を取得
      const currentContent = contentDiv.innerHTML.replace(/<br>/g, '\n');

      // 入力フォームに内容をセット
      inputForm.value = currentContent;

      // 編集モードに切り替え（例：グローバル変数で管理）
      editingTaskId = taskId;
      // 追加ボタンのラベルを変更
      addBtn.textContent = '更新';
    });
  });
}

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

