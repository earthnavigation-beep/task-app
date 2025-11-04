//ページがロードされたら処理を実行する
window.addEventListener('load', () => {
  displayTasks();
  initSortable(); // ← 追加！
  ImageBtnEvent(); // 画像
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
        <button class="btn down-btn">↓</button>
      </div>
     </div>
    </div>
   </li>`;
}