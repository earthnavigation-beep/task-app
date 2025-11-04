// タスク管理固有のスクリプト
const inputForm = document.querySelector('.task-input'); // 入力エリア

//ページがロードされたら処理を実行する
window.addEventListener('load', () => {
  displayTasks();
  TaskListBtnEvent();
  initSortable(); // ← 追加！
  ImageBtnEvent(); // 画像
});

//タスクの入力フォームでキーが離されたときに処理を実行する
inputForm.addEventListener('keyup', () => {
  const errorMsg = document.querySelector('.error-msg');
  if (errorMsg.classList.contains('show')) {
    if (inputForm.value !== '') {
      errorMsg.classList.remove('show');
    }
  }
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

//タスクを表示するためのHTMLタグを作成する
const createTaskElement = (task) => {
  const completeClass = task.completed ? 'complete' : '';
  const buttonText = task.completed ? '取消' : '完了'; // ← 追加！

  const formattedContent = task.content.replace(/\n/g, '<br>'); // 改行コードを<br>に変換

  return `<li class="task-item ${completeClass}" data-task-id="${task.id}">
    <div class="task-content">
      ${formattedContent}
    </div>
    <div class="item-wrapper">
     ${task.date ? `<div class="item-date">期日:${task.date}</div>` : ''} 
     <div class="item-btn">
     ${task.imagePath ? `<button class="btn image-btn" data-image-path="${task.imagePath}">マニュアル</button>` : ''}
      <button class="btn complete-btn">${buttonText}</button>
      <button class="btn delete-btn" data-task-id="${task.id}">削除</button>
      <div class="move-btns-vertical">
        <button class="btn up-btn">↑</button>
        <button class="btn edit-btn" data-task-id="${task.id}">編集</button>
        <button class="btn down-btn">↓</button>
      </div>
     </div>
    </div>
   </li>`;
}