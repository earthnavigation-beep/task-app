function listAndEditLocalStorageKeys() {
    const container = document.getElementById("storage-keys");
    container.innerHTML = "";

    const keys = Object.keys(localStorage);

    if (keys.length === 0) {
        container.textContent = "ローカルストレージにデータはありません。";
        return;
    }

    keys.forEach(key => {
        const wrapper = document.createElement("div");
        wrapper.className = "storage-card";
        wrapper.style.marginBottom = "10px";

        const input = document.createElement("input");
        input.value = key;
        input.style.marginRight = "10px";

        const renameBtn = document.createElement("button");
        renameBtn.textContent = "キー名変更";

        const link = document.createElement("a");
        link.href = `task-runner.html?key=${encodeURIComponent(key)}`;
        link.textContent = `→ "${key}" を実行ページで開く`;
        link.target = "_blank";
        link.className = "task-link";

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

            // 実行ページへのリンクを表示
            const link = document.createElement("a");
            link.href = `task-runner.html?key=${encodeURIComponent(newKey)}`;
            link.textContent = `→ "${newKey}" を実行ページで開く`;
            link.target = "_blank";
            container.appendChild(link);
        });

        wrapper.appendChild(input);
        wrapper.appendChild(renameBtn);
        wrapper.appendChild(link);
        container.appendChild(wrapper);
    });

    showTaskKeyLinks(); // 初回表示時にもリンク一覧を表示
}


function showTaskKeyLinks() {
    const container = document.getElementById("task-key-links");
    container.innerHTML = "";

    const keys = Object.keys(localStorage);
    if (keys.length === 0) return;

    const ul = document.createElement("ul");

    keys.forEach(key => {
        const li = document.createElement("li");

        const link = document.createElement("a");
        link.href = `task-runner.html?key=${encodeURIComponent(key)}`;
        link.textContent = `→ 実行ページで「${key}」を開く`;
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
