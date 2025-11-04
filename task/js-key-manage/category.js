const categoryKey = 'task-category-list';

function loadCategories() {
  const categoryKey = "task-category-list";
  const categoryMap = JSON.parse(localStorage.getItem(categoryKey)) || {};
  const list = document.getElementById('category-list');
  list.innerHTML = '';

  Object.keys(categoryMap).forEach(category => {
    const item = document.createElement('div');
    item.className = 'category-item';

    const name = document.createElement('span');
    name.textContent = category;

    const delBtn = document.createElement('button');
    delBtn.textContent = '削除';
    delBtn.addEventListener('click', () => {
      removeCategory(category);
    });

    item.appendChild(name);
    item.appendChild(delBtn);
    list.appendChild(item);
  });
}

function addCategory() {
  const input = document.getElementById('new-category');
  const newCategory = input.value.trim();
  if (!newCategory) return;

  const categoryKey = "task-category-list";
  const categoryMap = JSON.parse(localStorage.getItem(categoryKey)) || {};

  if (!categoryMap[newCategory]) {
    categoryMap[newCategory] = []; // ← タスクKeyを入れる配列
    localStorage.setItem(categoryKey, JSON.stringify(categoryMap));
    input.value = '';
    loadCategories(); // カテゴリ一覧の再描画
  }
}

function removeCategory(category) {
  const categoryKey = "task-category-list";
  const categoryMap = JSON.parse(localStorage.getItem(categoryKey)) || {};

  if (categoryMap.hasOwnProperty(category)) {
    delete categoryMap[category]; // ← キーを削除
    localStorage.setItem(categoryKey, JSON.stringify(categoryMap));
    loadCategories(); // 再描画
  }
}

document.getElementById('add-category').addEventListener('click', addCategory);
window.addEventListener('DOMContentLoaded', loadCategories);