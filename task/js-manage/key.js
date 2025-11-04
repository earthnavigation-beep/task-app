function listAndEditLocalStorageKeys() {
    const container = document.getElementById("storage-keys");
    container.innerHTML = "";

    const excludedKeys = ["task-category-list", "another-key"];
    const keys = Object.keys(localStorage).filter(key => !excludedKeys.includes(key));

    if (keys.length === 0) {
        container.textContent = "ローカルストレージにデータはありません。";
        return;
    }

    keys.forEach(key => {
        const wrapper = document.createElement("div");
        wrapper.className = "storage-card";

        // ボタン行（キー名変更＋リンク）
        const buttonRow = document.createElement("div");
        buttonRow.className = "button-row";

        const input = document.createElement("input");
        input.value = key;

        const renameBtn = document.createElement("button");
        renameBtn.classList.add("rename-btn");
        renameBtn.textContent = "キー名変更";

        const linkBtn = document.createElement("button");
        linkBtn.textContent = "タスクを開く";
        linkBtn.className = "task-link-btn";
        linkBtn.addEventListener("click", () => {
            window.open(`task-runner.html?key=${encodeURIComponent(key)}`, "_blank");
        });

        // カテゴリ行（select＋登録ボタン＋情報表示）
        const categoryRow = document.createElement("div");
        categoryRow.className = "category-row";

        const categories = getCategoryList();
        const categorySelect = document.createElement("select");
        categories.forEach(cat => {
            const option = document.createElement("option");
            option.value = cat;
            option.textContent = cat;
            categorySelect.appendChild(option);
        });

        const assignBtn = document.createElement("button");
        assignBtn.classList.add("category-btn");
        assignBtn.textContent = "カテゴリ登録";

        // カテゴリ情報表示
        const categoryInfo = document.createElement("span");
        categoryInfo.style.marginLeft = "10px";

        const currentCategory = getCategoryForTask(key);
        if (currentCategory) {
            categoryInfo.textContent = `このタスクは現在「${currentCategory}」に登録されています`;
            categorySelect.value = currentCategory; // 初期選択
        } else {
            categoryInfo.style.display = "none"; // 未登録なら非表示
        }

        // カテゴリ登録後に更新
        assignBtn.addEventListener("click", () => {
            const selectedCategory = categorySelect.value;
            addTaskToCategory(selectedCategory, key);
            categoryInfo.style.display = "inline";
            categoryInfo.textContent = `このタスクは現在「${selectedCategory}」に登録されています`;
        });

        // キー名変更処理
        renameBtn.addEventListener("click", () => {
            const newKey = input.value.trim();
            if (!newKey || newKey === key) {
                alert("キー名が変更されていません。");
                return;
            }
            if (localStorage.getItem(newKey) !== null) {
                alert(`キー名 "${newKey}" はすでに存在しています。`);
                return;
            }
            const value = localStorage.getItem(key);
            localStorage.setItem(newKey, value);
            localStorage.removeItem(key);
            listAndEditLocalStorageKeys(); // 再描画
            showTaskKeyLinks(); // リンク一覧も再描画
        });

        // DOM構築
        container.appendChild(wrapper);
        wrapper.appendChild(buttonRow);
        wrapper.appendChild(categoryRow);
        buttonRow.appendChild(input);
        buttonRow.appendChild(renameBtn);
        buttonRow.appendChild(linkBtn);
        categoryRow.appendChild(categorySelect);
        categoryRow.appendChild(assignBtn);
        categoryRow.appendChild(categoryInfo);
    });

    showTaskKeyLinks();
}


function showTaskKeyLinks() {
    const container = document.getElementById("task-key-links");
    if (!container) return;
    container.innerHTML = "";

    const keys = Object.keys(localStorage);
    if (keys.length === 0) return;

    const ul = document.createElement("ul");

    keys.forEach(key => {
        const li = document.createElement("li");

        const link = document.createElement("a");
        link.href = `task-runner.html?key=${encodeURIComponent(key)}`;
        link.target = "_blank";

        li.appendChild(link);
        ul.appendChild(li);
    });

    container.appendChild(ul);
}

// 初期表示
listAndEditLocalStorageKeys();

function getTaskKeyFromURL() {
    const params = new URLSearchParams(window.location.search);
    return decodeURIComponent(params.get('key'));
}

function displayTasksByKey() {
    const key = getTaskKeyFromURL();
    const tasks = JSON.parse(localStorage.getItem(key)) || [];

    taskList.innerHTML = '';
    tasks.forEach(task => {
        taskList.innerHTML += createTaskElement(task);
    });

    ImageBtnEvent(); // 必要ならイベント再設定
}

function getCategoryList() {
    const raw = localStorage.getItem("task-category-list");
    const categoryMap = raw ? JSON.parse(raw) : {};
    return Object.keys(categoryMap); // ← これでカテゴリ名一覧が取得できる
}

function addTaskToCategory(category, taskKey) {
    const raw = localStorage.getItem("task-category-list");
    const categoryMap = raw ? JSON.parse(raw) : {};

    if (!categoryMap[category]) {
        categoryMap[category] = [];
    }

    if (!categoryMap[category].includes(taskKey)) {
        categoryMap[category].push(taskKey);
        localStorage.setItem("task-category-list", JSON.stringify(categoryMap));
        alert(`「${taskKey}」をカテゴリ「${category}」に登録しました。`);
    } else {
        alert(`すでに「${taskKey}」はカテゴリ「${category}」に登録されています。`);
    }
}

// カテゴリ情報を取得する関数

function getCategoryForTask(key) {
    const raw = localStorage.getItem("task-category-list");
    if (!raw) return null;
    const categoryMap = JSON.parse(raw);

    for (const cat in categoryMap) {
        if (categoryMap[cat].includes(key)) {
            return cat;
        }
    }
    return null; // 未登録なら null
}

function removeTaskFromCategory(category, taskKey) {
    const raw = localStorage.getItem("task-category-list");
    if (!raw) return;
    const categoryMap = JSON.parse(raw);

    if (categoryMap[category]) {
        categoryMap[category] = categoryMap[category].filter(task => task !== taskKey);
        localStorage.setItem("task-category-list", JSON.stringify(categoryMap));
        alert(`「${taskKey}」をカテゴリ「${category}」から削除しました。`);
    } else {
        alert(`カテゴリ「${category}」は存在しません。`);
    }
}