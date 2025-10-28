//タスクを表示するためのHTMLタグを作成する
const createTaskElement = (task) => {
  const completeClass = task.completed ? 'complete' : '';
  const buttonText = task.completed ? '取消' : '完了';
  const formattedContent = task.content.replace(/\n/g, '<br>');

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
        <button class="btn down-btn">↓</button>
      </div>
     </div>
    </div>
   </li>`;
}

const renderTasks = (tasks) => {
  taskList.innerHTML = ""; // 既存のリストをクリア

  tasks.forEach(task => {
    const taskHTML = createTaskElement(task);
    taskList.insertAdjacentHTML('beforeend', taskHTML);
  });

  // HTMLを挿入した後にイベントを登録
  TaskListBtnEvent();
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